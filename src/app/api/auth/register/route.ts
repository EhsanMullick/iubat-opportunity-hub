import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://undqievietxhfewqghkx.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, role = 'user', studentId, department } = body;

    // 1. Validation
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const validRole = role === 'organizer' ? 'organizer' : 'user';

    // 2. Create user via Supabase Auth Admin API
    // Passing email_confirm: true bypasses email rate limits and activates user immediately!
    const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: cleanEmail,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName.trim(),
          role: validRole,
          student_id: studentId?.trim() || null,
          department: department?.trim() || null,
        },
      }),
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      // Check if user already exists
      if (
        createData.msg?.includes('already been registered') ||
        createData.message?.includes('already registered') ||
        createData.error_code === 'email_exists'
      ) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: createData.msg || createData.message || 'Failed to create user account' },
        { status: createRes.status || 400 }
      );
    }

    const userId = createData.id;

    // 3. Upsert user into public.profiles table in PostgreSQL database
    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify({
        id: userId,
        display_name: fullName.trim(),
        role: validRole,
        organizer_verified: validRole === 'organizer' ? false : false,
        student_id: studentId?.trim() || null,
        department: department?.trim() || null,
        skills: [],
        interests: [],
        updated_at: new Date().toISOString(),
      }),
    });

    return NextResponse.json({
      success: true,
      message: 'Account successfully created and registered in database',
      user: {
        id: userId,
        email: cleanEmail,
        fullName: fullName.trim(),
        role: validRole,
      },
    });
  } catch (err) {
    console.error('Registration API error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
