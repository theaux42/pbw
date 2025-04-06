"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [payload, setPayload] = useState(null);
  const [checking, setChecking] = useState(false);
  const [loginAsAsso, setloginAsAsso] = useState(false);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const accountType = localStorage.getItem("account_type");
      if (!accountType) {
        localStorage.removeItem("xumm_account");
      }
      const logged_in = localStorage.getItem("xumm_account");
      if (logged_in && accountType) {
        let res;

        try {
          if (accountType === "asso" && loginAsAsso) {
            res = await fetch(`/api/user/get-asso-data?xumm_id=${logged_in}`);
			if (res.status === 404) {
			  router.push("/on-boarding/asso");
			} else if (!res.ok) {
                throw new Error(`Error fetching asso data ${res.status}`);
            } else {
              router.push("/dashboard");
            }
          } else if (accountType === "user" && !loginAsAsso) {
            res = await fetch(`/api/user/get-user-data?xumm_id=${logged_in}`);
			if (res.status === 404) {
			  router.push("/on-boarding/user");
            } else if (!res.ok) {
        	  throw new Error(`Error fetching user data ${res.status}`);
            } else {
              router.push("/profile");
            }
          }
        } catch (err) {
          console.error("[Auto-login error]", err);
        }
      }
    };

    checkUserAndRedirect();
  }, [router, loginAsAsso]);

  useEffect(() => {
    let interval;

    if (payload && !account) {
      setChecking(true);
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/xumm/check/${payload.uuid}`);
          if (!res.ok) {
            throw new Error(`Check response not ok: ${res.status}`);
          }

          const data = await res.json();
          if (data.success) {
            setAccount(data.account);
            const storageKey = loginAsAsso
              ? "xumm_asso_account"
              : "xumm_account";
            localStorage.setItem(storageKey, data.account);
            localStorage.setItem("account_type", loginAsAsso ? "asso" : "user");

            setPayload(null);
            setChecking(false);
            clearInterval(interval);

            try {
              const userRes = await fetch(
                `/api/user/get-user-data?xumm_id=${data.account}`
              );
              if (!userRes.ok) {
                throw new Error(`User data response not ok: ${userRes.status}`);
              }

              const userData = await userRes.json();
              if (userData.user && userData.user.id) {
                localStorage.setItem(
                  loginAsAsso ? "asso_uuid" : "user_uuid",
                  userData.user.id
                );
              }

              router.push(loginAsAsso ? "/page-asso" : "/profile");
            } catch (err) {
              console.error(
                `Error checking ${loginAsAsso ? "asso" : "user"} after login:`,
                err
              );
              router.push(loginAsAsso ? "/page-asso" : "/profile");
            }
          }
        } catch (err) {
          console.error("[Polling Error]", err);
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [payload, account, router, loginAsAsso]);

  const handleLogin = async () => {
    try {
      setPayload(null);
      setAccount(null);

      const res = await fetch("/api/xumm/login", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`Login response not ok: ${res.status}`);
      }

      const data = await res.json();
      setPayload(data);
    } catch (err) {
      console.error("[handleLogin Error]", err);
      alert("Erreur lors du login");
    }
  };

  const toggleMode = () => {
    setloginAsAsso(!loginAsAsso);
    setPayload(null);
    setAccount(null);
    setChecking(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-md shadow-xl rounded-xl p-6 border border-gray-800/50">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800 rounded-full p-1 flex">
            <button
              onClick={() => setloginAsAsso(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !loginAsAsso
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Donateur
            </button>
            <button
              onClick={() => setloginAsAsso(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                loginAsAsso
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Association
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-white text-center">
          Connexion {loginAsAsso ? "Association" : "Donateur"}
        </h1>
        <p className="mb-6 text-gray-300 text-center">
          Connectez-vous avec Xumm pour{" "}
          {loginAsAsso ? "gérer votre organisation" : "faire des dons"}
        </p>

        <button
          onClick={handleLogin}
          className={`w-full ${
            loginAsAsso
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          } text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md flex items-center justify-center`}
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21ZM16 11H8V7H16V11Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Connecter avec Xumm
        </button>

        {payload && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-300 mb-3">
              Scannez ce QR code avec l'app Xumm:
            </p>
            <div className="bg-white p-2 rounded-lg mx-auto w-56 h-56 mb-4">
              <img src={payload.qr} alt="QR Xumm" className="w-full h-full" />
            </div>
            <p className="text-sm text-gray-300 mb-2">
              Ou utilisez ce lien sur mobile:
            </p>
            <a
              href={payload.link}
              target="_blank"
              rel="noreferrer"
              className={`${
                loginAsAsso ? "text-green-400" : "text-blue-400"
              } underline break-all`}
            >
              {payload.link}
            </a>

            {checking && (
              <p className="text-orange-400 mt-4 flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-orange-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                En attente de signature...
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
