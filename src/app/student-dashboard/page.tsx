'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookmarkCheck,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { EventSaveItem, ApplicationStatus } from '@/types';
import { formatEventDateTime, getRelativeTimeString, isEventExpired } from '@/lib/utils/date';

export default function StudentDashboardPage() {
  const [saves, setSaves] = useState<EventSaveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | ApplicationStatus>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  const fetchSaves = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/student/saves');
      if (res.ok) {
        const json = await res.json();
        setSaves(json.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaves();
  }, []);

  const handleStatusChange = async (saveId: string, newStatus: ApplicationStatus) => {
    try {
      const res = await fetch('/api/student/saves', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saveId, status: newStatus }),
      });
      if (res.ok) {
        setSaves((prev) =>
          prev.map((s) => (s.id === saveId ? { ...s, status: newStatus } : s))
        );
      }
    } catch {
      // ignore
    }
  };

  const handleSaveNotes = async (saveId: string) => {
    try {
      const res = await fetch('/api/student/saves', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          saveId,
          status: saves.find((s) => s.id === saveId)?.status || 'saved',
          notes: notesDraft,
        }),
      });
      if (res.ok) {
        setSaves((prev) =>
          prev.map((s) => (s.id === saveId ? { ...s, notes: notesDraft } : s))
        );
        setEditingId(null);
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async (saveId: string) => {
    if (!confirm('Remove this opportunity from your tracker?')) return;
    try {
      const res = await fetch(`/api/student/saves?saveId=${saveId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSaves((prev) => prev.filter((s) => s.id !== saveId));
      }
    } catch {
      // ignore
    }
  };

  const filteredSaves =
    activeTab === 'all' ? saves : saves.filter((s) => s.status === activeTab);

  // Status stage badge colors
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'saved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'applied':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'interviewing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  // Metrics
  const totalCount = saves.length;
  const appliedCount = saves.filter((s) => s.status === 'applied').length;
  const interviewingCount = saves.filter((s) => s.status === 'interviewing').length;
  const acceptedCount = saves.filter((s) => s.status === 'accepted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Student Profile Header Box */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25 shrink-0">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                IUBAT Student Opportunity Tracker
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Active Student
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage saved competitions, monitor upcoming deadlines, and track your application progress in one place.
            </p>
          </div>
        </div>

        <Link
          href="/ai-advisor"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-purple-600/20 hover:scale-[1.02] transition-transform flex items-center gap-1.5 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Get AI Match Recommendations</span>
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 text-center">
          <span className="text-2xl font-black text-slate-900">{totalCount}</span>
          <p className="text-xs font-semibold text-slate-500 mt-1">Total Tracked</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center border-amber-200/50">
          <span className="text-2xl font-black text-amber-700">{appliedCount}</span>
          <p className="text-xs font-semibold text-amber-800 mt-1">Applications Sent</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center border-purple-200/50">
          <span className="text-2xl font-black text-purple-700">{interviewingCount}</span>
          <p className="text-xs font-semibold text-purple-800 mt-1">Shortlisted / Round 2</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center border-emerald-200/50">
          <span className="text-2xl font-black text-emerald-700">{acceptedCount}</span>
          <p className="text-xs font-semibold text-emerald-800 mt-1">Offers / Accepted</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'saved', 'applied', 'interviewing', 'accepted', 'rejected'] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                activeTab === status
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'glass-panel text-slate-600 hover:text-slate-900'
              }`}
            >
              {status === 'all' ? 'All Opportunities' : status}
            </button>
          )
        )}
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {loading && (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-500 text-sm">
            Loading your tracked opportunities...
          </div>
        )}

        {!loading && filteredSaves.length === 0 && (
          <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
            <BookmarkCheck className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">No opportunities in this stage</h3>
            <p className="text-xs text-slate-500">
              Browse upcoming hackathons and events to bookmark and track your applications.
            </p>
            <Link
              href="/events"
              className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
            >
              Explore Events
            </Link>
          </div>
        )}

        {!loading &&
          filteredSaves.map((save) => {
            const evt = save.event;
            if (!evt) return null;
            const expired = isEventExpired(evt.end_datetime);

            return (
              <div
                key={save.id}
                className="glass-card rounded-3xl p-5 sm:p-6 border border-white/80 shadow-glass flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Event Poster & Core Info */}
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                    <Image
                      src={evt.poster_url}
                      alt={evt.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {evt.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${getStatusBadge(
                          save.status
                        )}`}
                      >
                        {save.status}
                      </span>
                      {expired && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-200">
                          Ended
                        </span>
                      )}
                    </div>

                    <Link href={`/events/${evt.slug}`}>
                      <h3 className="font-bold text-base text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1">
                        {evt.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{formatEventDateTime(evt.start_datetime, true, evt.timezone)}</span>
                    </p>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Deadline / Event: {getRelativeTimeString(evt.start_datetime)}</span>
                    </p>

                    {/* Notes preview or editor */}
                    {editingId === save.id ? (
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={notesDraft}
                          onChange={(e) => setNotesDraft(e.target.value)}
                          placeholder="Add team notes, checklist, or deadline reminder..."
                          className="px-3 py-1.5 rounded-lg glass-input text-xs text-slate-900 w-full sm:w-80"
                        />
                        <button
                          onClick={() => handleSaveNotes(save.id)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1.5 text-xs text-slate-500"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="pt-1 flex items-center gap-2 text-xs text-slate-500">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span className="italic line-clamp-1">
                          {save.notes || 'No notes added yet.'}
                        </span>
                        <button
                          onClick={() => {
                            setEditingId(save.id);
                            setNotesDraft(save.notes || '');
                          }}
                          className="text-indigo-600 hover:underline flex items-center gap-0.5 font-medium ml-1"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Pipeline Controls & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {/* Status Dropdown Stage Mover */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Pipeline Stage
                    </label>
                    <select
                      value={save.status}
                      onChange={(e) =>
                        handleStatusChange(save.id, e.target.value as ApplicationStatus)
                      }
                      className="px-3 py-2 rounded-xl glass-input text-xs font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="saved">1. Saved</option>
                      <option value="applied">2. Applied</option>
                      <option value="interviewing">3. Interviewing / Round 2</option>
                      <option value="accepted">4. Accepted / Winner</option>
                      <option value="rejected">5. Rejected</option>
                    </select>
                  </div>

                  {/* External Registration Link */}
                  {evt.registration_url && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Portal
                      </label>
                      <a
                        href={evt.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Remove Button */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-transparent block">Del</label>
                    <button
                      onClick={() => handleDelete(save.id)}
                      title="Remove from tracker"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
