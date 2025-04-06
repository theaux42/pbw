// api/user/donation-logs/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Add safety checks for environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    console.log('Received donation request:', JSON.stringify(body, null, 2));
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

    if (isNaN(parseFloat(amount)) || (platform_fee !== undefined && isNaN(parseFloat(platform_fee)))) {
      return NextResponse.json(
        { error: 'Amount and platform_fee must be valid numbers' },
        { status: 400 }
      );
    }

    const { data: allOrgs, error: listOrgError } = await supabase
      .from('organizations')
      .select('id, name')
      .limit(100);

    if (listOrgError) {
      console.error('Error fetching organizations:', listOrgError);
    } else {
      console.log(`Found ${allOrgs.length} organizations`);
      const orgIds = allOrgs.map(org => org.id);
      console.log('Available organization IDs:', orgIds);
      console.log('Checking if org_id exists:', org_id, orgIds.includes(org_id));
    }

    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', org_id);

    if (orgError) {
      console.error('Organization query error:', orgError);
      return NextResponse.json(
        { error: 'Error checking organization', details: orgError.message },
        { status: 500 }
      );
    }

    if (!organization || organization.length === 0) {
      return NextResponse.json(
        { error: 'Organization not found', details: `Organization with ID ${org_id} does not exist` },
        { status: 404 }
      );
    }

    const { data: userExists, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors if missing

    if (userError) {
      console.error('User query error:', userError);
      return NextResponse.json(
        { error: 'Error checking user', details: userError.message },
        { status: 500 }
      );
    }

    if (!userExists) {
      return NextResponse.json(
        { error: 'User not found', details: `User with ID ${user_id} does not exist` },
        { status: 404 }
      );
    }

    const { data: existingDonation, error: txHashError } = await supabase
      .from('donations')
      .select('id')
      .eq('tx_hash', tx_hash)
      .maybeSingle(); // Use maybeSingle instead of single

    if (txHashError) {
      console.error('Transaction hash check error:', txHashError);
      return NextResponse.json(
        { error: 'Error checking for existing donation', details: txHashError.message },
        { status: 500 }
      );
    }

    if (existingDonation) {
      return NextResponse.json(
        { error: 'Donation with this transaction hash already exists', id: existingDonation.id },
        { status: 409 }
      );
    }

    try {
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
          { 
            error: 'Failed to create donation record', 
            details: donationError.message,
            code: donationError.code
          },
          { status: 500 }
        );
      }

      // Update user's donation count and last donation timestamp
      const { data: user, error: getUserError } = await supabase
        .from('users')
        .select('donation_count, total_donated')
        .eq('id', user_id)
        .maybeSingle();
      
      if (getUserError) {
        console.error('Error fetching user data:', getUserError);
      } else if (user) {
        const currentCount = user.donation_count || 0;
        const totalDonated = user.total_donated || 0;
        
        const { error: updateUserError } = await supabase
          .from('users')
          .update({ 
            donation_count: currentCount + 1,
            total_donated: totalDonated + parseFloat(amount),
            last_donation: new Date().toISOString()
          })
          .eq('id', user_id);
        
        if (updateUserError) {
          console.error('Error updating user stats:', updateUserError);
        }
      }

      // Return success response
      return NextResponse.json({
        message: 'Donation recorded successfully',
        donation
      }, { status: 201 });
    } catch (insertError) {
      console.error('Insert operation error:', insertError);
      return NextResponse.json(
        { error: 'Database operation failed', details: insertError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in donation-logs API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}