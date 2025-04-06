import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Map of achievement IDs to their metadata
const achievementMetadata = {
  'first_donation': {
    title: 'First Donation',
    description: 'Made your first donation on FundXR',
    image: '/achievements/first_donation.png'
  },
  'regular_donor': {
    title: 'Regular Donor',
    description: 'Made 5 donations on FundXR',
    image: '/achievements/regular_donor.png'
  },
  'big_supporter': {
    title: 'Big Supporter',
    description: 'Donated 100 XRP total on FundXR',
    image: '/achievements/big_supporter.png'
  },
  'xp_master': {
    title: 'XP Master',
    description: 'Earned 1000 XP on FundXR',
    image: '/achievements/xp_master.png'
  },
  'philanthropist': {
    title: 'Philanthropist',
    description: 'Donated 500 XRP total on FundXR',
    image: '/achievements/philanthropist.png'
  },
  'veteran_supporter': {
    title: 'Veteran Supporter',
    description: 'Made 20 donations on FundXR',
    image: '/achievements/veteran_supporter.png'
  }
};

// Simplified function to update user achievements using Supabase
async function updateUserAchievements(userId, achievementId, nftId) {
  try {
    // First, get the user's current claimed_achievements and achievement_nfts
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('claimed_achievements, achievement_nfts')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error("Error fetching profile:", fetchError);
      return;
    }

    // Update with the new achievement
    const claimed_achievements = profile.claimed_achievements || [];
    const achievement_nfts = profile.achievement_nfts || [];
    
    claimed_achievements.push(achievementId);
    achievement_nfts.push({ id: achievementId, nft_id: nftId });

    // Update the profile with the new arrays
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        claimed_achievements,
        achievement_nfts
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
    }
  } catch (error) {
    console.log("Error updating achievements, but continuing:", error);
    // Continue execution even if this fails
  }
}

export async function POST(request) {
  try {
    // Parse request body
    const { achievementId, userId, wallet_address } = await request.json();
    
    if (!achievementId) {
      return NextResponse.json({
        error: 'Achievement ID is required'
      }, {
        status: 400
      });
    }
    
    if (!wallet_address) {
      return NextResponse.json({
        error: 'Wallet address is required'
      }, {
        status: 400
      });
    }
    
    // Get the metadata for this achievement
    const metadata = achievementMetadata[achievementId];
    if (!metadata) {
      return NextResponse.json({
        error: 'Invalid achievement ID'
      }, {
        status: 400
      });
    }
    
    // Use data from the request payload
    const userData = {
      id: userId || "anonymous-user",
      wallet_address: wallet_address,
    };
    
    // Call the mint API
    let mintResult;
    try {
      const mintResponse = await fetch(new URL('/api/xumm/mint', request.url).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiver_address: userData.wallet_address,
          img_path: metadata.image,
          metadata: {
            name: `${metadata.title} - Achievement NFT`,
            description: metadata.description,
            achievement_id: achievementId,
            claimed_at: new Date().toISOString(),
            user_id: userData.id
          }
        })
      });
      
      mintResult = await mintResponse.json();
      
      if (!mintResponse.ok) {
        console.error('Mint API error details:', JSON.stringify(mintResult, null, 2));
        throw new Error(
          mintResult.message || 
          mintResult.error || 
          'Failed to mint achievement NFT'
        );
      }
    } catch (error) {
      console.error('Error during NFT minting process:', error);
      console.error('Stack trace:', error.stack);
      return NextResponse.json({
        error: 'NFT minting failed',
        message: error.message,
        details: mintResult || 'No additional details available'
      }, {
        status: 502 // Bad Gateway since the downstream service failed
      });
    }
    
    // Optionally update user achievements - but don't throw if it fails
    try {
      await updateUserAchievements(userData.id, achievementId, mintResult.data.nft_id);
    } catch (error) {
      console.error("Failed to update user achievements, but continuing:", error);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Achievement claimed and NFT minted successfully',
      data: {
        achievement_id: achievementId,
        achievement_title: metadata.title,
        nft_data: mintResult.data
      }
    });
  } catch (error) {
    console.error('Error in claiming achievement:', error);
    
    // Check if this is an NFT minting error
    const isNftMintingError = error.message && (
      error.message.includes('Could not find minted NFToken ID') ||
      error.message.includes('Failed to mint NFT') ||
      error.message.includes('NFT minting failed')
    );
    
    const errorResponse = {
      error: isNftMintingError ? 'NFT Minting Failed' : 'Failed to claim achievement',
      message: error.message,
      suggestedAction: isNftMintingError 
        ? 'Please try again later. The XRP Ledger may be experiencing high traffic or your wallet may need additional setup.'
        : 'Please try again or contact support if this issue persists.',
      technicalDetails: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        originalError: error.toString()
      } : undefined
    };
    
    return NextResponse.json(errorResponse, {
      status: isNftMintingError ? 502 : 500 // Use 502 for downstream service failures
    });
  }
}
