import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'node-html-parser';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('Supabase admin environment variables are missing');
    }
    supabaseAdmin = createClient(url, key);
  }
  return supabaseAdmin;
}

export async function POST(req: NextRequest) {
  try {
    const admin = getSupabaseAdmin();
    const { url } = await req.json();

    if (!url || !url.includes('pinterest.com')) {
      return NextResponse.json({ error: 'Invalid Pinterest URL' }, { status: 400 });
    }

    // 1. Fetch Pinterest Page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Pinterest page');
    }

    const html = await response.text();
    const root = parse(html);

    // 2. Extract Open Graph Image
    const ogImage = root.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const title = root.querySelector('meta[property="og:title"]')?.getAttribute('content') || 'Pinterest Import';

    if (!ogImage) {
      throw new Error('Could not find image on Pinterest page');
    }

    // 3. Download the image
    const imageRes = await fetch(ogImage);
    const imageBlob = await imageRes.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();

    // 4. Upload to Supabase Storage
    const fileName = `pinterest-${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await admin.storage
      .from('board-assets')
      .upload(`imports/${fileName}`, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    // 5. Get Public URL
    const { data: { publicUrl } } = admin.storage
      .from('board-assets')
      .getPublicUrl(`imports/${fileName}`);

    return NextResponse.json({
      url: publicUrl,
      title,
      source: url,
    });
  } catch (error: any) {
    console.error('Pinterest Import Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
