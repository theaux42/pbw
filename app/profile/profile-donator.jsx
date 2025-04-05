import React, { useState, useEffect } from "react";
import { fetchNFTs } from "../../services/xrpServices";
import "./profile-donator.css";

const ProfileDonator = ({ account }) => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    // Charger les NFTs existants liés à l'adresse
    const loadNFTs = async () => {
      try {
        const fetchedNFTs = await fetchNFTs(account);
        setNfts(fetchedNFTs);
      } catch (error) {
        console.error("Erreur lors de la récupération des NFTs:", error);
      }
    };
    loadNFTs();
  }, [account]);

  return (
    <div className="profile-donator">
      <h1>Galerie de NFTs</h1>
      <div className="gallery">
        {nfts.length > 0 ? (
          nfts.map((nft, index) => (
            <div key={index} className="nft-card">
              <img src={nft.image} alt={nft.name} />
              <p>{nft.name}</p>
            </div>
          ))
        ) : (
          <p>Aucun NFT trouvé pour cette adresse.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileDonator;
