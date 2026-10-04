import { NextResponse } from 'next/server';
import { runEventExpirationJob, simulateEventExpiration, getEligibleUpcomingEvents } from '@/lib/data/store';

// GET: Checks current authoritative time and marks any ended events as expired
export async function GET() {
  const result = runEventExpirationJob();
  const { total } = getEligibleUpcomingEvents();
  return NextResponse.json({
    success: true,
    message: 'Auto-expiration check completed.',
    expiredCount: result.expiredCount,
    expiredEventIds: result.expiredIds,
    remainingActiveEvents: total,
    timestamp: new Date().toISOString(),
  });
}

// POST: Simulate an event ending according to its date & time to demonstrate auto-removal
export async function POST(request: Request) {
  try {
    const { eventId } = await request.json();
    if (!eventId) {
      // If no ID passed, execute general expiration check
      const result = runEventExpirationJob();
      return NextResponse.json({
        success: true,
        action: 'batch_expired_check',
        expiredCount: result.expiredCount,
      });
    }

    const sim = simulateEventExpiration(eventId);
    if (!sim) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      action: 'event_ended_and_removed',
      message: `Event "${sim.eventTitle}" reached its end date & time and was automatically removed from upcoming discovery.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process auto-expiration action', details: String(error) },
      { status: 500 }
    );
  }
}
