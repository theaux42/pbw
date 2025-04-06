import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet_address');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Missing required parameter: wallet_address' },
        { status: 400 }
      );
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('xumm_id', walletAddress)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error fetching user data:', userError);
      return NextResponse.json({ error: 'Error fetching user data' }, { status: 500 });
    }

    const userId = userData?.id;

    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select(`
        id,
        amount,
        tx_hash,
        status,
        timestamp,
        platform_fee,
        org_id
      `)
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (donationsError) {
      console.error('Error fetching donations:', donationsError);
      return NextResponse.json({ error: 'Error fetching donation data' }, { status: 500 });
    }

    if (!donations || donations.length === 0) {
      return NextResponse.json({
        message: 'No donations found for this wallet address',
        donations: []
      });
    }

    const orgIds = [...new Set(donations.map(d => d.org_id))];

    const { data: organizations, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name, description, logo_url, wallet_address')
      .in('id', orgIds);

    if (orgsError) {
      console.error('Error fetching organization data:', orgsError);
      return NextResponse.json({ error: 'Error fetching organization data' }, { status: 500 });
    }

    const orgsMap = organizations.reduce((map, org) => {
      map[org.id] = org;
      return map;
    }, {});

    const donationsWithOrgDetails = donations.map(donation => ({
      ...donation,
      organization: orgsMap[donation.org_id] || { name: 'Unknown Organization' }
    }));

    return NextResponse.json({ donations: donationsWithOrgDetails });

  } catch (error) {
    console.error('Error processing donation history request:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
