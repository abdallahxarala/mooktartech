import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import ShortUniqueId from 'short-unique-id';
import QRCode from 'qrcode';

const uid = new ShortUniqueId({ length: 8 });

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const json = await request.json();
    const {
      name,
      title,
      company,
      photo_url,
      template_id,
      metadata,
      is_public = true,
    } = json;

    // Générer un ID court unique
    const shortId = uid.rnd();

    // Générer le QR code
    const qrCodeUrl = await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_BASE_URL}/c/${shortId}`);

    const { data: card, error } = await supabase
      .from('virtual_cards')
      .insert({
        user_id: session.user.id,
        name,
        title,
        company,
        photo_url,
        template_id,
        metadata,
        is_public,
        short_id: shortId,
        qr_code_url: qrCodeUrl,
        version: 1,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data: cards, error, count } = await supabase
      .from('virtual_cards')
      .select('*', { count: 'exact' })
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      cards,
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}