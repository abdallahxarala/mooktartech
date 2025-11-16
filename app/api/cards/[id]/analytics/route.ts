import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Vérifier la propriété de la carte
    const { data: card } = await supabase
      .from('virtual_cards')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (!card || card.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Récupérer les statistiques
    const { data: analytics, error } = await supabase
      .from('card_analytics')
      .select('*')
      .eq('card_id', params.id)
      .gte('created_at', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .lte('created_at', endDate || new Date().toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Agréger les données
    const stats = {
      total_views: analytics.length,
      views_by_date: {},
      views_by_location: {},
      views_by_device: {},
    };

    analytics.forEach((event) => {
      // Par date
      const date = event.created_at.split('T')[0];
      stats.views_by_date[date] = (stats.views_by_date[date] || 0) + 1;

      // Par localisation
      if (event.location) {
        stats.views_by_location[event.location] = (stats.views_by_location[event.location] || 0) + 1;
      }

      // Par appareil
      if (event.user_agent) {
        const device = event.user_agent.includes('Mobile') ? 'mobile' : 'desktop';
        stats.views_by_device[device] = (stats.views_by_device[device] || 0) + 1;
      }
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}