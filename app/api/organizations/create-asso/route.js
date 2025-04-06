import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    // Parse FormData
    const formData = await request.formData();
    console.log('Request FormData received');
    
    // Get values from FormData
    const name = formData.get('name');
    const description = formData.get('description');
    const wallet_address = formData.get('wallet_address');
    const website = formData.get('website');
    const full_description = formData.get('full_description');
    const wallet_seed = formData.get('wallet_seed');
    
    // Get files from FormData
    const logo = formData.get('logo');
    const banner = formData.get('banner');
    
    let logo_url = formData.get('logo_url');
    let banner_url = formData.get('banner_url');

    // Validate required inputs
    if (!name || !wallet_address) {
      return NextResponse.json(
        { error: 'Missing required parameters: name and wallet_address are required' },
        { status: 400 }
      );
    }

    // Check if organization already exists with this wallet address
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('wallet_address', wallet_address)
      .single();

    if (existingOrg) {
      return NextResponse.json(
        { error: 'Organization with this wallet address already exists' },
        { status: 409 }
      );
    }

    // Handle logo upload if a file is provided
    if (logo && logo.size > 0) {
      const fileExt = logo.name.split('.').pop();
      const fileName = `logo-${wallet_address.substring(0, 8)}-${Date.now()}.${fileExt}`;
      const filePath = `organization_assets/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('org-uploads')
        .upload(filePath, logo, {
          contentType: logo.type,
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
      } else {
        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase
          .storage
          .from('org-uploads')
          .getPublicUrl(filePath);
        
        logo_url = publicUrl;
      }
    }

    // Handle banner upload if a file is provided
    if (banner && banner.size > 0) {
      const fileExt = banner.name.split('.').pop();
      const fileName = `banner-${wallet_address.substring(0, 8)}-${Date.now()}.${fileExt}`;
      const filePath = `organization_assets/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('org-uploads')
        .upload(filePath, banner, {
          contentType: banner.type,
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading banner:', uploadError);
      } else {
        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase
          .storage
          .from('org-uploads')
          .getPublicUrl(filePath);
        
        banner_url = publicUrl;
      }
    }

    // Prepare organization data
    const orgData = {
      name,
      description,
      wallet_address,
      logo_url,
      website,
      banner_url,
      full_description,
      wallet_seed,
      total_received: 0
      // created_at will use database default
    };

    // Insert new organization
    const { data, error } = await supabase
      .from('organizations')
      .insert(orgData)
      .select()
      .single();

    // Handle insert error
    if (error) {
      console.error('Error creating organization:', error);
      return NextResponse.json(
        { error: 'Failed to create organization' },
        { status: 500 }
      );
    }

    // Return the created organization data
    return NextResponse.json({ 
      message: 'Organization created successfully',
      organization: data 
    }, { status: 201 });

  } catch (error) {
    console.error('Error in create organization API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}