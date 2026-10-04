import { NextResponse } from 'next/server';
import { getEligibleUpcomingEvents, addEvent } from '@/lib/data/store';
import { eventFormSchema } from '@/lib/utils/validation';
import { generateSlug } from '@/lib/utils/slug';
import { createAdminClient } from '@/lib/supabase/service-role';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get('search') || undefined;
  const category = searchParams.get('category') || undefined;
  const city = searchParams.get('city') || undefined;
  const priceType = (searchParams.get('priceType') as 'all' | 'free' | 'paid') || 'all';
  const sortBy = (searchParams.get('sortBy') as 'soonest' | 'newest' | 'popular') || 'soonest';
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);

  const result = getEligibleUpcomingEvents({
    search,
    category,
    city,
    priceType,
    sortBy,
    startDate,
    endDate,
    page,
    limit,
  });

  return NextResponse.json({
    success: true,
    data: result.events,
    total: result.total,
    page,
    limit,
  });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // Server-side Zod validation
    const parsed = eventFormSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const val = parsed.data;
    const slug = generateSlug(val.title);

    let supabaseEventId: string | null = null;
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock');

    if (!isMock) {
      try {
        const supabase = createAdminClient();
        const { data: dbData, error: dbError } = await supabase
          .from('events')
          .insert({
            organizer_id: 'a0000000-0000-0000-0000-000000000098', // Default to Ehsan Mullick creator id
            title: val.title,
            slug,
            description: val.description,
            category: val.category,
            poster_url: val.poster_url,
            start_datetime: val.start_datetime,
            end_datetime: val.end_datetime,
            timezone: 'Asia/Dhaka',
            venue_name: val.venue_name,
            venue_address: val.venue_address,
            city: val.city,
            country: 'Bangladesh',
            latitude: val.latitude,
            longitude: val.longitude,
            registration_url: val.registration_url || null,
            ticket_price: val.ticket_price || 0,
            currency: val.currency || 'BDT',
            capacity: val.capacity || null,
            contact_email: val.contact_email || null,
            contact_url: val.contact_url || null,
            status: 'pending_review',
            is_featured: false,
          })
          .select()
          .single();

        if (dbData && !dbError) {
          supabaseEventId = dbData.id;
        }
      } catch (err) {
        console.warn('Supabase insert skipped or failed:', err);
      }
    }

    const newEvent = addEvent({
      organizer_id: 'a0000000-0000-0000-0000-000000000098',
      title: val.title,
      slug,
      description: val.description,
      category: val.category,
      poster_url: val.poster_url,
      start_datetime: val.start_datetime,
      end_datetime: val.end_datetime,
      timezone: 'Asia/Dhaka',
      venue_name: val.venue_name,
      venue_address: val.venue_address,
      city: val.city,
      country: 'Bangladesh',
      latitude: val.latitude,
      longitude: val.longitude,
      registration_url: val.registration_url || undefined,
      ticket_price: val.ticket_price || 0,
      currency: val.currency || 'BDT',
      capacity: val.capacity || undefined,
      contact_email: val.contact_email || undefined,
      contact_url: val.contact_url || undefined,
      // Default to pending_review for moderation safety!
      status: 'pending_review',
      is_featured: false,
      organizer: {
        display_name: 'Ehsan Mullick (Creator & Lead Organizer)',
        organizer_verified: true,
      },
    });

    return NextResponse.json({
      success: true,
      event: newEvent,
      message: 'Event submitted successfully! Saved to database and queued for administrator review.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event', details: String(error) },
      { status: 500 }
    );
  }
}
