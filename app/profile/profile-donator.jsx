import React, { useState, useEffect } from "react";
import { mintNFT, fetchNFTs } from "../../services/xrpServices";
import "./profile-donator.css";

const ProfileDonator = (account) => {
  const [nfts, setNfts] = useState([]);
  const [minting, setMinting] = useState(false);
  const [newNFT, setNewNFT] = useState({ name: "", image: "" });

  useEffect(() => {
    // Charger les NFTs existants
    const loadNFTs = async () => {
      const fetchedNFTs = await fetchNFTs();
      setNfts(fetchedNFTs);
    };
    loadNFTs();
  }, []);

  const handleMint = async () => {
    if (!newNFT.name || !newNFT.image) {
      alert("Veuillez remplir tous les champs pour créer un NFT.");
      return;
    }
    setMinting(true);
    try {
      const mintedNFT = await mintNFT(newNFT.name, newNFT.image);
      setNfts([...nfts, mintedNFT]);
      setNewNFT({ name: "", image: "" });
    } catch (error) {
      console.error("Erreur lors du minting du NFT:", error);
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="profile-donator">
      <h1>Galerie de NFTs</h1>
      <div className="mint-form">
        <h2>Créer un nouveau NFT</h2>
        <input
          type="text"
          placeholder="Nom du NFT"
          value={newNFT.name}
          onChange={(e) => setNewNFT({ ...newNFT, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL de l'image"
          value={newNFT.image}
          onChange={(e) => setNewNFT({ ...newNFT, image: e.target.value })}
        />
        <button onClick={handleMint} disabled={minting}>
          {minting ? "Minting..." : "Mint NFT"}
        </button>
      </div>
      <div className="gallery">
        {nfts.map((nft, index) => (
          <div key={index} className="nft-card">
            <img src={nft.image} alt={nft.name} />
            <p>{nft.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileDonator;
