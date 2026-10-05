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

  let dbExpiredCount = 0;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && !supabaseUrl.includes('mock') && serviceKey && !serviceKey.includes('mock')) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/service-role');
      const supabase = createAdminClient();
      const { data, error } = await supabase.rpc('expire_past_events');
      if (!error && typeof data === 'number') {
        dbExpiredCount = data;
      }
    } catch (err) {
      console.warn('Database RPC expiration fallback:', err);
    }
  }

  const result = runEventExpirationJob();

  return NextResponse.json({
    success: true,
    message: `Event expiration job executed successfully.`,
    expiredCount: dbExpiredCount || result.expiredCount,
    expiredEventIds: result.expiredIds,
    authoritativeTimeUtc: new Date().toISOString(),
    source: serviceKey && !serviceKey.includes('mock') ? 'supabase_rpc' : 'in_memory',
  });
}
