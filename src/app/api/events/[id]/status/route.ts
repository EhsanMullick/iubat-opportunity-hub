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
