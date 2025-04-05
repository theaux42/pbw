export const mintNFT = async (name, image) => {
	try {
	  // Simulez une interaction avec la blockchain XRP pour mint un NFT
	  // Remplacez cette logique par l'intégration réelle avec XRP
	  const newNFT = {
	    name,
	    image,
	    id: Date.now(), // ID unique simulé
	  };
	  console.log("NFT minté avec succès:", newNFT);
	  return newNFT;
	} catch (error) {
	  console.error("Erreur lors du minting du NFT:", error);
	  throw error;
	}
      };
      
      // Exemple de fonction pour récupérer les NFTs existants
      export const fetchNFTs = async () => {
	try {
	  // Simulez une récupération des NFTs depuis la blockchain XRP
	  // Remplacez cette logique par une intégration réelle
	  const nfts = [
	    { name: "NFT Exemple 1", image: "https://via.placeholder.com/150" },
	    { name: "NFT Exemple 2", image: "https://via.placeholder.com/150" },
	  ];
	  console.log("NFTs récupérés:", nfts);
	  return nfts;
	} catch (error) {
	  console.error("Erreur lors de la récupération des NFTs:", error);
	  throw error;
	}
      };