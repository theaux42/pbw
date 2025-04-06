// api/organisations/get-orga-data/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request) {
  try {
    // Get organization_id from URL search params
    const { searchParams } = new URL(request.url);
    const organization_id = searchParams.get('organization_id');

    // Validate input
    if (!organization_id) {
      return NextResponse.json(
        { error: 'Missing required parameter: organization_id' },
        { status: 400 },
	{ ok: false }
      );
    }

    // Query the database using Supabase
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('wallet_address', organization_id)
      .single();

    // Handle query error
    if (error == 500) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Error fetching organization data' },
        { status: 500 },
	{ ok: false }
      );
    }

    // Check if organization exists
    if (!data) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 },
	{ ok: true }
      );
    }

    // Return organization data
    return NextResponse.json({ organization: data }, { status: 200 }, { ok: true });

  } catch (error) {
    console.error('Error fetching organization data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
      { ok: false }
    );
  }
}