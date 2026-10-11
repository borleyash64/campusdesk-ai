import React, { useState } from 'react';
import {
  BookOpen,
  Briefcase,
  Calendar,
  Award,
  Search,
  ExternalLink,
  MessageSquare,
  Mail,
  MapPin,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CAMPUS_COURSES, CAMPUS_FAQS, CourseDetail, FAQItem } from '../data/knowledgeBase.ts';
import { formatChatMessage } from '../utils/formatMarkdown.tsx';

interface KnowledgeBaseTabProps {
  onAskQuestion: (query: string) => void;
}

export const KnowledgeBaseTab: React.FC<KnowledgeBaseTabProps> = ({ onAskQuestion }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewType, setViewType] = useState<'faqs' | 'courses'>('faqs');

  const filteredFaqs = CAMPUS_FAQS.filter((faq) => {
    if (activeCategory !== 'all' && faq.category !== activeCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        faq.title.toLowerCase().includes(q) ||
        faq.summary.toLowerCase().includes(q) ||
        faq.content.toLowerCase().includes(q) ||
        faq.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filteredCourses = CAMPUS_COURSES.filter((c) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
            Official University Knowledge Directory
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Academic Policy, Course Catalog & Records Archive
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Browse through official rules, prerequisites, internship credit regulations, and registrar documents.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-white/10 p-1 rounded-xl border border-white/20 shrink-0">
          <button
            onClick={() => setViewType('faqs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewType === 'faqs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Policy & FAQs ({CAMPUS_FAQS.length})
          </button>
          <button
            onClick={() => setViewType('courses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewType === 'courses' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Course Catalog ({CAMPUS_COURSES.length})
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses, CPT, transcripts, withdrawal, drop deadlines..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {viewType === 'faqs' && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Topics
            </button>
            <button
              onClick={() => setActiveCategory('courses')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'courses'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveCategory('internships')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'internships'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Internships
            </button>
            <button
              onClick={() => setActiveCategory('deadlines')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'deadlines'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Deadlines
            </button>
            <button
              onClick={() => setActiveCategory('certificates')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'certificates'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              Certificates
            </button>
          </div>
        )}
      </div>

      {/* FAQs View */}
      {viewType === 'faqs' ? (
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-600 font-semibold">No policies matched your query.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
                className="mt-2 text-xs font-bold text-indigo-600 underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        {faq.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{faq.department}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{faq.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{faq.summary}</p>
                  </div>

                  <button
                    onClick={() => onAskQuestion(faq.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold shrink-0 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Ask AI
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  {formatChatMessage(faq.content)}
                </div>

                {faq.steps && faq.steps.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-bold text-slate-800">Official Process Steps:</span>
                    <div className="space-y-1">
                      {faq.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {faq.contactEmail}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {faq.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {faq.keywords.slice(0, 4).map((kw, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Courses Catalog View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course) => (
            <div
              key={course.code}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                    {course.code} • {course.credits} Credits
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {course.offeredSemesters.join(', ')}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {course.description}
                </p>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Prerequisites:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px]">
                    {course.prerequisites.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <p className="text-[11px] text-slate-500">
                  👨‍🏫 Instructor: <strong className="text-slate-700">{course.instructor}</strong>
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{course.department}</span>
                <button
                  onClick={() =>
                    onAskQuestion(`What are the prerequisites, syllabus, and registration tips for ${course.code}?`)
                  }
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Ask Chatbot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
