import React, { useState } from 'react';
import {
  Calendar,
  AlertCircle,
  Clock,
  Filter,
  ArrowRight,
  CheckCircle2,
  Bell,
  Sparkles,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { ACADEMIC_DEADLINES, AcademicDeadline } from '../data/knowledgeBase.ts';

interface DeadlinesTabProps {
  onAskAboutDeadline: (question: string) => void;
}

export const DeadlinesTab: React.FC<DeadlinesTabProps> = ({ onAskAboutDeadline }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [onlyCritical, setOnlyCritical] = useState<boolean>(false);

  const filteredDeadlines = ACADEMIC_DEADLINES.filter((d) => {
    if (onlyCritical && !d.critical) return false;
    if (filterCategory !== 'all' && d.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/30 text-amber-200 text-xs font-semibold border border-amber-400/30 mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            Official Academic Year Calendar & Cutoff Dates
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Campus Deadline Radar & Action Tracker
          </h1>
          <p className="text-sm text-amber-100/80 max-w-2xl mt-1">
            Stay ahead of registration dates, tuition payment holds, internship agreement cutoffs, and graduation application deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 text-center">
            <span className="text-xs uppercase text-amber-200 block font-semibold">Active Term</span>
            <span className="text-lg font-black text-white">Fall 2026</span>
          </div>
        </div>
      </div>

      {/* Filter and Switch Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterCategory === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Milestones
          </button>
          <button
            onClick={() => setFilterCategory('courses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterCategory === 'courses'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            Courses & Registration
          </button>
          <button
            onClick={() => setFilterCategory('internships')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterCategory === 'internships'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Internships & CPT
          </button>
          <button
            onClick={() => setFilterCategory('deadlines')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterCategory === 'deadlines'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Financial & Bursar
          </button>
          <button
            onClick={() => setFilterCategory('certificates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterCategory === 'certificates'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Graduation & Transcripts
          </button>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={onlyCritical}
            onChange={(e) => setOnlyCritical(e.target.checked)}
            className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
          />
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Critical Deadlines Only
          </span>
        </label>
      </div>

      {/* Deadline Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDeadlines.map((dl) => (
          <div
            key={dl.id}
            className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-md flex flex-col justify-between ${
              dl.critical
                ? 'border-amber-300 shadow-xs ring-1 ring-amber-400/20'
                : 'border-slate-200 shadow-xs'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    dl.critical
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {dl.critical ? '⚠️ Critical Cutoff' : 'ℹ️ Milestone'}
                </span>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  {dl.date}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {dl.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {dl.actionRequired}
              </p>

              <div className="text-[11px] text-slate-500 font-medium">
                🏛️ Managing Unit: <strong className="text-slate-700">{dl.department}</strong>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Official Registrar Schedule
              </span>
              <button
                onClick={() =>
                  onAskAboutDeadline(`What are the exact policies, steps, and penalties for ${dl.title}?`)
                }
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Ask Helpdesk Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
