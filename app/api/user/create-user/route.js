import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { xumm_id, username, pic_url } = body;

    // Validate required inputs
    if (!xumm_id) {
      return NextResponse.json(
        { error: 'Missing required parameter: xumm_id' },
        { status: 400 }
      );
    }

    // Check if user already exists with this wallet address
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('xumm_id', xumm_id)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this wallet address already exists' },
        { status: 409 }
      );
    }

    // Prepare user data with default values
    const userData = {
      xumm_id,
      username: username || `User-${xumm_id.substring(0, 8)}`, // Default username if not provided
      pic_url: pic_url || null,
      // Other fields will use database defaults
    };

    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    // Handle insert error
    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Return the created user data
    return NextResponse.json({ 
      message: 'User created successfully',
      user: data 
    }, { status: 201 });

  } catch (error) {
    console.error('Error in create user API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}