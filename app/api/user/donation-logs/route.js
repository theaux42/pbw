import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { 
      user_id, 
      org_id, 
      amount, 
      tx_hash, 
      nft_id = null, 
      platform_fee = 0,
      status = 'completed'  // Default to completed since this API is for successful transactions
    } = body;

    // Validate required inputs
    if (!user_id || !org_id || !amount || !tx_hash) {
      return NextResponse.json(
        { error: 'Missing required parameters: user_id, org_id, amount, and tx_hash are required' },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (isNaN(parseFloat(amount)) || (platform_fee !== undefined && isNaN(parseFloat(platform_fee)))) {
      return NextResponse.json(
        { error: 'Amount and platform_fee must be valid numbers' },
        { status: 400 }
      );
    }

    // Check if a donation with this tx_hash already exists
    const { data: existingDonation } = await supabase
      .from('donations')
      .select('id')
      .eq('tx_hash', tx_hash)
      .single();

    if (existingDonation) {
      return NextResponse.json(
        { error: 'Donation with this transaction hash already exists' },
        { status: 409 }
      );
    }

    // Create the donation record
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .insert({
        user_id,
        org_id,
        amount: parseFloat(amount),
        tx_hash,
        nft_id,
        platform_fee: parseFloat(platform_fee) || 0,
        status
      })
      .select()
      .single();

    if (donationError) {
      console.error('Error creating donation record:', donationError);
      return NextResponse.json(
        { error: 'Failed to create donation record' },
        { status: 500 }
      );
    }

    // Update user's donation count and last donation timestamp
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('donation_count, total_donated')
      .eq('id', user_id)
      .single();
    
    if (!getUserError && user) {
      const currentCount = user.donation_count || 0;
      const totalDonated = user.total_donated || 0;
      
      await supabase
        .from('users')
        .update({ 
          donation_count: currentCount + 1,
          total_donated: totalDonated + parseFloat(amount),
          last_donation: new Date().toISOString()
        })
        .eq('id', user_id);
    }

    // Return success response
    return NextResponse.json({
      message: 'Donation recorded successfully',
      donation
    }, { status: 201 });

  } catch (error) {
    console.error('Error in donation-logs API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}