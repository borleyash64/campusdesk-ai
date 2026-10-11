import React from 'react';
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  ShieldAlert,
  Plus,
  User,
  Building
} from 'lucide-react';
import { SupportTicket } from '../types.ts';

interface TicketsTabProps {
  tickets: SupportTicket[];
  onOpenCreateTicketModal: () => void;
  onUpdateTicketStatus: (ticketId: string, status: 'Open' | 'In Review' | 'Escalated' | 'Resolved') => void;
}

export const TicketsTab: React.FC<TicketsTabProps> = ({
  tickets,
  onOpenCreateTicketModal,
  onUpdateTicketStatus
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30 mb-2">
            <Ticket className="w-3.5 h-3.5 text-indigo-300" />
            University Human Advisor Escalation Center
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            My Helpdesk Support Tickets
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Track inquiries escalated from CampusDesk AI to the Registrar, ISSO, Academic Advising, and Student Accounts.
          </p>
        </div>

        <button
          onClick={onOpenCreateTicketModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Support Ticket
        </button>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No active support tickets</h3>
            <p className="text-xs text-slate-500">
              When an academic question requires an advisor override or bursar payment appeal, escalate it from the chat or create a ticket directly.
            </p>
            <button
              onClick={onOpenCreateTicketModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
            >
              Open New Ticket
            </button>
          </div>
        ) : (
          tickets.map((ticket) => {
            const isResolved = ticket.status === 'Resolved';
            const isUrgent = ticket.priority === 'Urgent' || ticket.priority === 'High';

            return (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      {ticket.ticketNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        ticket.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ticket.status === 'In Review'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                    {isUrgent && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        {ticket.priority} Priority
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-400">Created: {ticket.createdAt}</span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{ticket.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {ticket.inquiry}
                  </p>
                </div>

                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/70 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
                    <Building className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Assigned Department: {ticket.department}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {ticket.advisorNotes || 'Under active triage by senior academic counselor.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Student: <strong className="text-slate-700">{ticket.studentName}</strong> ({ticket.studentId})
                  </span>

                  <div className="flex items-center gap-2">
                    {ticket.status !== 'Resolved' ? (
                      <button
                        onClick={() => onUpdateTicketStatus(ticket.id, 'Resolved')}
                        className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold text-xs transition-colors"
                      >
                        Mark as Resolved
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateTicketStatus(ticket.id, 'In Review')}
                        className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-xs transition-colors"
                      >
                        Re-open Ticket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
