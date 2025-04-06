// api/user/get-user-data/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request) {
  try {
    // Get xumm_id from URL search params
    const { searchParams } = new URL(request.url);
    const xumm_id = searchParams.get('xumm_id');

    // Validate input
    if (!xumm_id) {
      return NextResponse.json(
        { error: 'Missing required parameter: xumm_id' },
        { status: 400 }
      );
    }

    // Query the database using Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('xumm_id', xumm_id)
      .single();

    // Handle query error
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Error fetching user data' },
        { status: 500 }
      );
    }

    // Check if user exists
    if (!data) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json({ user: data });

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}