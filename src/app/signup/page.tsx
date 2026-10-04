'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Mail, Lock, User, Building, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'organizer'>('user');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            student_id: studentId,
            department,
          },
        },
      });

      if (authError) {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('mock')) {
          setSuccess('Account registered successfully! Redirecting...');
          setTimeout(() => router.push(role === 'organizer' ? '/dashboard' : '/student-dashboard'), 1000);
          return;
        }
        throw authError;
      }

      setSuccess('Account created! Please check your email inbox to verify your account.');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 shadow-glass border border-white/80 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/25">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-500">
            Join IUBAT Opportunity Hub to save competitions, track deadlines & publish events
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Role selector pill */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                role === 'user' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              🎓 IUBAT Student
            </button>
            <button
              type="button"
              onClick={() => setRole('organizer')}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                role === 'organizer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              🏛️ Event Host / Club
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Fahim Ahmed"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="21103001@iubat.edu"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-slate-900"
              />
            </div>
          </div>

          {role === 'user' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="21103001"
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-slate-900 font-medium cursor-pointer"
                >
                  <option value="CSE">BCSE</option>
                  <option value="BBA">BBA</option>
                  <option value="Agriculture">BSAg</option>
                  <option value="EEE">BSEEE</option>
                  <option value="Civil">BSCE</option>
                  <option value="CTHM">BATHM</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Create Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Already have an account? </span>
          <Link href="/login" className="font-bold text-indigo-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
