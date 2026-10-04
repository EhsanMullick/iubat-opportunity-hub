import { NextResponse } from 'next/server';
import {
  getStudentSaves,
  saveOpportunity,
  updateOpportunityStatus,
  removeSavedOpportunity,
} from '@/lib/data/store';
import { ApplicationStatus } from '@/types';

export async function GET() {
  const saves = getStudentSaves('current-student');
  return NextResponse.json({ success: true, data: saves });
}

export async function POST(request: Request) {
  try {
    const { eventId, status } = await request.json();
    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required' }, { status: 400 });
    }
    const save = saveOpportunity(eventId, 'current-student', (status as ApplicationStatus) || 'saved');
    return NextResponse.json({ success: true, data: save });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save event', details: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { saveId, status, notes } = await request.json();
    if (!saveId || !status) {
      return NextResponse.json({ error: 'saveId and status are required' }, { status: 400 });
    }
    const ok = updateOpportunityStatus(saveId, status as ApplicationStatus, notes);
    if (!ok) {
      return NextResponse.json({ error: 'Save record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update save status', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const saveId = searchParams.get('saveId');
    if (!saveId) {
      return NextResponse.json({ error: 'saveId is required' }, { status: 400 });
    }
    const ok = removeSavedOpportunity(saveId);
    if (!ok) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Opportunity unsaved' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete record', details: String(error) }, { status: 500 });
  }
}
