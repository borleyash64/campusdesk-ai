import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Bot,
  Calendar,
  BookOpen,
  FlaskConical,
  Ticket,
  User,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { StudentProfile } from '../types.ts';

interface NavbarProps {
  activeTab: 'chat' | 'tests' | 'deadlines' | 'knowledge' | 'tickets';
  setActiveTab: (tab: 'chat' | 'tests' | 'deadlines' | 'knowledge' | 'tickets') => void;
  student: StudentProfile;
  onOpenPersonaModal: () => void;
  openTicketsCount: number;
  isAiConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  student,
  onOpenPersonaModal,
  openTicketsCount,
  isAiConnected
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-50">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                  CampusDesk<span className="text-indigo-600">AI</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Student Helpdesk
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Courses • Internships • Deadlines • Certificates
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-2 scrollbar-none">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Helpdesk Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
                activeTab === 'tests'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Quality Lab</span>
              <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-sky-100 text-sky-800 font-bold border border-sky-200">
                Test
              </span>
            </button>

            <button
              onClick={() => setActiveTab('deadlines')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'deadlines'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Deadlines</span>
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'knowledge'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
                activeTab === 'tickets'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Tickets</span>
              {openTicketsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500 text-white font-bold">
                  {openTicketsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Student Profile Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPersonaModal}
              title="Switch or customize student profile"
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                {student.name.charAt(0)}
              </div>
              <div className="hidden md:block text-xs">
                <p className="font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                  {student.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                  {student.year} • {student.major}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
