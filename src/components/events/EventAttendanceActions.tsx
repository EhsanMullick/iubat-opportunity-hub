'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Ticket, Check, BookmarkCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface EventAttendanceActionsProps {
  eventId: string;
}

export default function EventAttendanceActions({ eventId }: EventAttendanceActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'interested' | 'going' | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function checkUserAndAttendance() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsLoggedIn(true);
          // Check if already marked interested or going
          const res = await fetch('/api/student/saves');
          if (res.ok) {
            const json = await res.json();
            const existing = (json.data || []).find((s: any) => s.event_id === eventId);
            if (existing) {
              const s = existing.status;
              if (s === 'going' || s === 'applied' || s === 'accepted') {
                setStatus('going');
              } else {
                setStatus('interested');
              }
            }
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        // silent
      }
    }
    checkUserAndAttendance();
  }, [eventId]);

  const handleSetStatus = async (newStatus: 'interested' | 'going') => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/events`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/student/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 pt-2">
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
        Student Attendance & Interest
      </span>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleSetStatus('interested')}
          disabled={loading}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border active:scale-95 ${
            status === 'interested'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          {status === 'interested' ? (
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          ) : (
            <Star className="w-3.5 h-3.5 text-indigo-500 fill-indigo-100" />
          )}
          <span>{status === 'interested' ? 'Interested' : 'Interested'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetStatus('going')}
          disabled={loading}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border active:scale-95 ${
            status === 'going'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          {status === 'going' ? (
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          ) : (
            <Ticket className="w-3.5 h-3.5 text-emerald-600" />
          )}
          <span>{status === 'going' ? 'Going' : 'Going'}</span>
        </button>
      </div>

      {status && isLoggedIn && (
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>Marked as {status === 'going' ? 'Going' : 'Interested'}</span>
          </span>
          <Link href="/student-dashboard" className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
            <BookmarkCheck className="w-3 h-3" />
            <span>View in Student Hub</span>
          </Link>
        </div>
      )}
    </div>
  );
}
