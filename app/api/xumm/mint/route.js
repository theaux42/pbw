import { NextResponse } from 'next/server';
import { Client, Wallet } from 'xrpl';

// Secret keys should be in environment variables in production
const MINTER_SEED = process.env.XRPL_MINTER_SEED;

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { receiver_address, img_path, metadata } = body;

    // Validate required inputs
    if (!receiver_address) {
      return NextResponse.json(
        { error: 'Missing required parameter: receiver_address' },
        { status: 400 }
      );
    }

    // Connect to XRP Ledger testnet
    const client = new Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    try {
      const minterWallet = Wallet.fromSeed(MINTER_SEED);
      
      const metadataHex = Buffer.from(
        JSON.stringify({
          image: img_path,
          ...metadata
        })
      ).toString('hex').toUpperCase();

      // Mint the NFT
      const mintTx = {
        TransactionType: 'NFTokenMint',
        Account: minterWallet.classicAddress,
        URI: metadataHex,
        Flags: 8, // transferable
        NFTokenTaxon: 0 // Required field with no operational significance
      };

      const preparedMint = await client.autofill(mintTx);
      const signedMint = minterWallet.sign(preparedMint);
      const mintResult = await client.submitAndWait(signedMint.tx_blob);

      if (mintResult.result.meta.TransactionResult !== 'tesSUCCESS') {
        throw new Error(`Failed to mint NFT: ${mintResult.result.meta.TransactionResult}`);
      }

      // Find the NFT ID from the transaction result
      const nodes = mintResult.result.meta.AffectedNodes;
      let nftokenID = null;

      // Log the entire metadata for debugging
      console.log('Mint transaction metadata:', JSON.stringify(mintResult.result.meta, null, 2));

      // First attempt: standard search in CreatedNode with LedgerEntryType 'NFTokenPage'
      for (const node of nodes) {
        if (node.CreatedNode && node.CreatedNode.LedgerEntryType === 'NFTokenPage') {
          const nftokens = node.CreatedNode.NewFields.NFTokens;
          if (nftokens && nftokens.length > 0) {
            nftokenID = nftokens[0].NFToken.NFTokenID;
            console.log('Found NFToken ID in CreatedNode:', nftokenID);
            break;
          }
        }
        
        // Second attempt: check in ModifiedNode with LedgerEntryType 'NFTokenPage'
        if (!nftokenID && node.ModifiedNode && node.ModifiedNode.LedgerEntryType === 'NFTokenPage') {
          // Check FinalFields
          const finalNFTokens = node.ModifiedNode.FinalFields?.NFTokens;
          const previousNFTokens = node.ModifiedNode.PreviousFields?.NFTokens || [];
          
          if (finalNFTokens && finalNFTokens.length > 0) {
            // Find tokens that exist in FinalFields but not in PreviousFields
            const previousTokenIds = new Set(
              previousNFTokens.map(token => token.NFToken.NFTokenID)
            );
            
            for (const token of finalNFTokens) {
              if (!previousTokenIds.has(token.NFToken.NFTokenID)) {
                nftokenID = token.NFToken.NFTokenID;
                console.log('Found NFToken ID in ModifiedNode:', nftokenID);
                break;
              }
            }
            
            if (nftokenID) break;
          }
        }
      }

      // Third attempt: use the NFTokenMint transaction result to extract the NFTokenID directly
      if (!nftokenID && mintResult.result.Account === minterWallet.classicAddress) {
        try {
          const client = new xrpl.Client(process.env.XRPL_SERVER || "wss://s.altnet.rippletest.net:51233");
          await client.connect();
          
          // Get the account's NFTs to find the most recently minted one
          const nfts = await client.request({
            command: "account_nfts",
            account: minterWallet.classicAddress
          });
          
          console.log('Account NFTs:', JSON.stringify(nfts, null, 2));
          
          if (nfts.result.account_nfts && nfts.result.account_nfts.length > 0) {
            // Sort by Sequence (assuming higher sequence = more recent)
            nfts.result.account_nfts.sort((a, b) => 
              parseInt(b.nft_serial) - parseInt(a.nft_serial)
            );
            
            nftokenID = nfts.result.account_nfts[0].NFTokenID;
            console.log('Found NFToken ID from account_nfts:', nftokenID);
          }
          
          await client.disconnect();
        } catch (error) {
          console.error('Error fetching account NFTs:', error);
        }
      }

      if (!nftokenID) {
        console.error('NFToken ID not found in transaction metadata:', mintResult.result.meta);
        throw new Error('Could not find minted NFToken ID');
      }

      // Create an offer to transfer the NFT
      const offerTx = {
        TransactionType: 'NFTokenCreateOffer',
        Account: minterWallet.classicAddress,
        NFTokenID: nftokenID,
        Amount: '0', // Free transfer
        Destination: receiver_address,
        Flags: 1 // Sell offer
      };

      const preparedOffer = await client.autofill(offerTx);
      const signedOffer = minterWallet.sign(preparedOffer);
      const offerResult = await client.submitAndWait(signedOffer.tx_blob);

      if (offerResult.result.meta.TransactionResult !== 'tesSUCCESS') {
        throw new Error(`Failed to create NFT offer: ${offerResult.result.meta.TransactionResult}`);
      }

      // Extract the offer ID
      let offerID = null;
      for (const node of offerResult.result.meta.AffectedNodes) {
        if (node.CreatedNode && node.CreatedNode.LedgerEntryType === 'NFTokenOffer') {
          offerID = node.CreatedNode.LedgerIndex;
          break;
        }
      }

      if (!offerID) {
        throw new Error('Could not find NFT offer ID');
      }

      return NextResponse.json({
        success: true,
        message: 'NFT minted and offer created',
        data: {
          nft_id: nftokenID,
          offer_id: offerID,
          mint_tx_hash: mintResult.result.hash,
          offer_tx_hash: offerResult.result.hash,
          mint_tx_url: `https://testnet.xrpl.org/transactions/${mintResult.result.hash}`,
          offer_tx_url: `https://testnet.xrpl.org/transactions/${offerResult.result.hash}`,
        }
      });
    } finally {
      // Ensure client is disconnected even if there's an error
      await client.disconnect();
    }
  } catch (error) {
    console.error('Error in NFT mint API:', error);
    return NextResponse.json(
      { error: 'Failed to mint NFT', message: error.message },
      { status: 500 }
    );
  }
}