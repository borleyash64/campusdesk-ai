import React, { useState } from 'react';
import { X, Send, AlertTriangle, ShieldCheck } from 'lucide-react';
import { StudentProfile, SupportTicket } from '../types.ts';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  initialInquiry?: string;
  initialCategory?: 'courses' | 'internships' | 'deadlines' | 'certificates' | 'financial';
  onTicketCreated: (ticket: SupportTicket) => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  student,
  initialInquiry = '',
  initialCategory = 'courses',
  onTicketCreated
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'courses' | 'internships' | 'deadlines' | 'certificates' | 'financial'>(initialCategory);
  const [department, setDepartment] = useState('Office of the Registrar');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [inquiry, setInquiry] = useState(initialInquiry);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${randomNum}`,
      title: title || `${category.toUpperCase()} Assistance Request`,
      category,
      department,
      studentName: student.name,
      studentId: student.studentId,
      inquiry,
      priority,
      status: 'Open',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      advisorNotes: 'Ticket received and queued for staff review. Standard response time is 24 business hours.'
    };

    onTicketCreated(newTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Escalate to Campus Staff Ticket
            </h2>
            <p className="text-xs text-slate-500">
              Direct routing to Academic Advising, Registrar, Career Center, or Bursar.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ticket Subject / Issue Summary
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Prerequisite Override for CS301 / Payment Extension Request"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as any;
                  setCategory(cat);
                  if (cat === 'courses') setDepartment('Office of the Registrar & Academic Advising');
                  else if (cat === 'internships') setDepartment('Career Center & ISSO');
                  else if (cat === 'deadlines' || cat === 'financial') setDepartment('Bursar & Student Accounts');
                  else if (cat === 'certificates') setDepartment('Registrar - Records & Transcripts');
                }}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="courses">Course / Prerequisites</option>
                <option value="internships">Internship / CPT / Credit</option>
                <option value="deadlines">Deadline Appeal</option>
                <option value="financial">Tuition / Bursar Holds</option>
                <option value="certificates">Transcripts & Diplomas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Routing Department
              </label>
              <input
                type="text"
                readOnly
                value={department}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-700 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Low">Low (Informational)</option>
                <option value="Medium">Medium (Standard 24h SLA)</option>
                <option value="High">High (Impending Deadline)</option>
                <option value="Urgent">Urgent (Holds / SEVIS Status)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Verified ID
              </label>
              <div className="text-xs px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-mono">
                {student.studentId} ({student.name})
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Inquiry or Context for Advisor
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe what assistance you need, course numbers, or extenuating circumstances..."
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Confirmation copy sent to {student.email}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Ticket
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
