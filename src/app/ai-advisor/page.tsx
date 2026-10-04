'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  BrainCircuit,
  GraduationCap,
  Target,
  ArrowRight,
  BookmarkCheck,
  Check,
  Layers,
  Award,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { RecommendationResult } from '@/types';
import { formatEventDateTime } from '@/lib/utils/date';

export default function AiAdvisorPage() {
  const [department, setDepartment] = useState('CSE');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([
    'Python',
    'React',
    'Machine Learning',
    'Problem Solving',
  ]);
  const [interests, setInterests] = useState<string[]>([
    'Hackathons',
    'AI Research',
    'Startup Innovation',
  ]);
  const [careerGoals, setCareerGoals] = useState(
    'Aspiring to lead software architecture and win national hackathons in South Asia.'
  );

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendationResult[] | null>(null);
  const [savedIds, setSavedIds] = useState<{ [id: string]: boolean }>({});

  const popularSkillsByDept: { [key: string]: string[] } = {
    CSE: ['Python', 'JavaScript', 'React', 'AI/ML', 'Competitive Programming', 'DevOps', 'Cybersecurity'],
    BBA: ['Business Analytics', 'Case Study', 'Financial Modeling', 'Digital Marketing', 'Pitching'],
    Agriculture: ['Precision Farming', 'Soil Science', 'Green Tech', 'Organic Cultivation', 'Drone Surveying'],
    EEE: ['Embedded Systems', 'IoT', 'Arduino/Robotics', 'Power Systems', 'Circuit Design'],
    CTHM: ['Hotel Management', 'Culinary Operations', 'Customer Service', 'Tourism Planning'],
  };

  const handleAddSkill = (s: string) => {
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
    }
  };

  const handleRemoveSkill = (s: string) => {
    setSkills(skills.filter((item) => item !== s));
  };

  const handleRunAiRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department,
          skills,
          interests,
          careerGoals,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setResults(json.recommendations || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToTracker = async (eventId: string) => {
    try {
      const res = await fetch('/api/student/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, status: 'saved' }),
      });
      if (res.ok) {
        setSavedIds((prev) => ({ ...prev, [eventId]: true }));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Hero Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>AI Gateway Powered Career Recommender</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Personalized Opportunity Matcher
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Share your IUBAT major, skills, and career ambitions. Our intelligent model evaluates all verified upcoming opportunities and recommends high-impact matches with personalized explanations.
        </p>
      </div>

      {/* Input Glass Form Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80">
        <form onSubmit={handleRunAiRecommendation} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>IUBAT Department / Major</span>
              </label>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  const suggestions = popularSkillsByDept[e.target.value] || [];
                  if (suggestions.length > 0) {
                    setSkills(suggestions.slice(0, 4));
                  }
                }}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-semibold text-slate-900 cursor-pointer"
              >
                <option value="CSE">Computer Science & Engineering (BCSE)</option>
                <option value="BBA">Bachelor of Business Administration (BBA)</option>
                <option value="Agriculture">Faculty of Agricultural Sciences (BSAg)</option>
                <option value="EEE">Electrical & Electronic Engineering (BSEEE)</option>
                <option value="Civil">Civil Engineering (BSCE)</option>
                <option value="Mechanical">Mechanical Engineering (BSME)</option>
                <option value="CTHM">College of Tourism & Hospitality (BATHM)</option>
                <option value="Economics">Economics (BAEcon)</option>
                <option value="English">English Literature & Linguistics (BAEng)</option>
              </select>
            </div>

            {/* Career Goals */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-600" />
                <span>Career Ambition & Target Roles</span>
              </label>
              <input
                type="text"
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                placeholder="e.g. AI Research Engineer, Investment Analyst, Green Agritech Founder"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-900"
              />
            </div>
          </div>

          {/* Skills Management */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>Current Skills & Technical Competencies</span>
            </label>

            {/* Active skill badges */}
            <div className="flex items-center gap-2 flex-wrap min-h-[36px]">
              {skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center gap-1.5"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="hover:text-rose-600 text-slate-400 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Skill input & quick suggestions */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(skillInput.trim());
                    setSkillInput('');
                  }
                }}
                placeholder="Type a skill and press Enter..."
                className="px-3.5 py-2 rounded-xl glass-input text-xs w-full sm:w-72"
              />
              <button
                type="button"
                onClick={() => {
                  handleAddSkill(skillInput.trim());
                  setSkillInput('');
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
              >
                Add
              </button>
            </div>

            {/* Suggested skill chips */}
            {popularSkillsByDept[department] && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-slate-500">
                <span className="font-semibold">Suggested for {department}:</span>
                {popularSkillsByDept[department].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddSkill(s)}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Analyzing Campus & National Opportunities with AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Analyze & Rank Matches</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* AI Recommendations Display */}
      {results && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-slate-900">
                AI Match Recommendations for You ({results.length})
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Ranked by Career Trajectory & Skill Alignment
            </span>
          </div>

          <div className="space-y-4">
            {results.map(({ event, matchScore, reasons, skillAlignment }) => {
              const isSaved = !!savedIds[event.id];
              return (
                <div
                  key={event.id}
                  className="glass-card rounded-3xl p-6 border border-white/80 shadow-glass flex flex-col md:flex-row md:items-start justify-between gap-6"
                >
                  {/* Left: Poster & Main Details */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                      <Image
                        src={event.poster_url}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-2 min-w-0">
                      {/* Top Match Score Pill */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs">
                          {matchScore}% Match
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          {event.category}
                        </span>
                      </div>

                      <Link href={`/events/${event.slug}`}>
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 hover:text-indigo-600 transition-colors">
                          {event.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-500">
                        📍 {event.venue_name}, {event.city} • 📅{' '}
                        {formatEventDateTime(event.start_datetime, true, event.timezone)}
                      </p>

                      {/* AI Explanations */}
                      <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 space-y-1.5 mt-2">
                        <span className="text-[11px] font-bold text-purple-900 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-600" /> Why this matches you:
                        </span>
                        <ul className="text-xs text-purple-950/90 space-y-1 pl-4 list-disc">
                          {reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2 shrink-0 md:w-44 pt-2 md:pt-0">
                    <button
                      onClick={() => handleSaveToTracker(event.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                        isSaved
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Saved in Hub</span>
                        </>
                      ) : (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5" />
                          <span>Save to Tracker</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/events/${event.slug}`}
                      className="px-4 py-2.5 rounded-xl glass-input hover:bg-white text-slate-700 font-semibold text-xs text-center transition-colors"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
