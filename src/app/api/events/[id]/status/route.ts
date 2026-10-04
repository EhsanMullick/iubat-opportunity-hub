import { NextResponse } from 'next/server';
import { moderateEvent } from '@/lib/data/store';
import { EventStatus } from '@/types';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, is_featured } = body;

    const validStatuses: EventStatus[] = ['draft', 'pending_review', 'published', 'rejected', 'cancelled', 'expired'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
    }

    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock');
    if (!isMock) {
      try {
        const { createAdminClient } = await import('@/lib/supabase/service-role');
        const supabase = createAdminClient();
        const updatePayload: Record<string, any> = {};
        if (status) updatePayload.status = status;
        if (typeof is_featured === 'boolean') updatePayload.is_featured = is_featured;
        updatePayload.updated_at = new Date().toISOString();
        if (status === 'published') updatePayload.published_at = new Date().toISOString();
        if (status === 'cancelled') updatePayload.cancelled_at = new Date().toISOString();

        await supabase.from('events').update(updatePayload).eq('id', id);
      } catch (err) {
        console.warn('Supabase status update fallback:', err);
      }
    }

    const updated = moderateEvent(id, status as EventStatus, is_featured);
    if (!updated) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      event: updated,
      message: `Event status successfully updated to ${status || 'updated'}.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update event status', details: String(error) },
      { status: 500 }
    );
  }
}
