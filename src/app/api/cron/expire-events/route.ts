import { NextResponse } from 'next/server';
import { runEventExpirationJob } from '@/lib/data/store';

export async function GET(request: Request) {
  return handleExpiration(request);
}

export async function POST(request: Request) {
  return handleExpiration(request);
}

async function handleExpiration(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  const cronHeader = request.headers.get('x-cron-secret');

  // Verify secret if set in production
  if (cronSecret && cronSecret !== 'dev-cron-secret-key-12345') {
    const isBearerValid = authHeader === `Bearer ${cronSecret}`;
    const isCustomHeaderValid = cronHeader === cronSecret;

    if (!isBearerValid && !isCustomHeaderValid) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing CRON_SECRET.' },
        { status: 401 }
      );
    }
  }

  const result = runEventExpirationJob();

  return NextResponse.json({
    success: true,
    message: `Event expiration job executed successfully.`,
    expiredCount: result.expiredCount,
    expiredEventIds: result.expiredIds,
    authoritativeTimeUtc: new Date().toISOString(),
  });
}
