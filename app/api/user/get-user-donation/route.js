import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request) {
  try {
    // Get wallet address from URL search params
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet_address');

    // Validate input
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Missing required parameter: wallet_address' },
        { status: 400 }
      );
    }

    // First fetch user ID from the wallet address
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('xumm_id', walletAddress)
      .single();

    if (userError && userError.code !== 'PGRST116') { // Not found is okay, could be first donation
      console.error('Error fetching user data:', userError);
      return NextResponse.json(
        { error: 'Error fetching user data' },
        { status: 500 }
      );
    }

    const userId = userData?.id;

    // Fetch donations made by this wallet (via user ID)
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select(`
        id,
        amount,
        tx_hash,
        status,
        created_at,
        platform_fee,
        org_id
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (donationsError) {
      console.error('Error fetching donations:', donationsError);
      return NextResponse.json(
        { error: 'Error fetching donation data' },
        { status: 500 }
      );
    }

    if (!donations || donations.length === 0) {
      return NextResponse.json({
        message: 'No donations found for this wallet address',
        donations: []
      });
    }

    // Get all unique organization IDs
    const orgIds = [...new Set(donations.map(d => d.org_id))];

    // Fetch organization details for all donations
    const { data: organizations, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name, description, logo_url, wallet_address')
      .in('id', orgIds);

    if (orgsError) {
      console.error('Error fetching organization data:', orgsError);
      return NextResponse.json(
        { error: 'Error fetching organization data' },
        { status: 500 }
      );
    }

    // Create an organizations lookup map for quick access
    const orgsMap = organizations.reduce((map, org) => {
      map[org.id] = org;
      return map;
    }, {});

    // Combine donation data with organization details
    const donationsWithOrgDetails = donations.map(donation => {
      const org = orgsMap[donation.org_id] || { name: 'Unknown Organization' };
      return {
        ...donation,
        organization: org
      };
    });

    // Return the combined data
    return NextResponse.json({
      donations: donationsWithOrgDetails
    });

  } catch (error) {
    console.error('Error processing donation history request:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}