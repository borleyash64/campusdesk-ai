import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Copy,
  Check,
  LifeBuoy,
  RotateCcw,
  Download,
  BookOpen,
  Briefcase,
  Calendar,
  Award,
  AlertCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { Message, StudentProfile, SupportTicket } from '../types.ts';
import { formatChatMessage } from '../utils/formatMarkdown.tsx';

interface ChatTabProps {
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  student: StudentProfile;
  onOpenTicketModalWithInquiry: (inquiry: string, category?: any) => void;
  onClearChat: () => void;
  onMessageFeedback: (msgId: string, feedback: 'positive' | 'negative', note?: string) => void;
}

const CATEGORY_CHIPS = [
  {
    category: 'courses',
    label: 'Courses & Prereqs',
    icon: BookOpen,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
    questions: [
      'What are the prerequisites for CS301?',
      'What is the difference between dropping a class and withdrawing?',
      'Can I take more than 18 credit hours next semester?'
    ]
  },
  {
    category: 'internships',
    label: 'Internships & CPT',
    icon: Briefcase,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    questions: [
      'How do I earn academic credit for an internship (INT-399)?',
      'What are the CPT rules for international students?',
      'Where can I find verified tech internships on Handshake?'
    ]
  },
  {
    category: 'deadlines',
    label: 'Deadlines & Calendar',
    icon: Calendar,
    color: 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100',
    questions: [
      'When is the tuition fee payment deadline?',
      'What is the cutoff date for Add/Drop with full refund?',
      'When is the graduation application deadline?'
    ]
  },
  {
    category: 'certificates',
    label: 'Certificates & Records',
    icon: Award,
    color: 'text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100',
    questions: [
      'How can I order an official electronic transcript?',
      'How do I download a free Enrollment Verification certificate?',
      'When will I receive my degree diploma or CeDiploma?'
    ]
  }
];

export const ChatTab: React.FC<ChatTabProps> = ({
  messages,
  onSendMessage,
  isLoading,
  student,
  onOpenTicketModalWithInquiry,
  onClearChat,
  onMessageFeedback
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [feedbackPromptId, setFeedbackPromptId] = useState<string | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    await onSendMessage(text);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text
      .replace(/###/g, '')
      .replace(/####/g, '')
      .replace(/\*\*/g, '')
      .replace(/•/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '$1');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleExportChat = () => {
    const transcript = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.sender === 'user' ? student.name : 'CampusDesk AI'}:\n${m.content}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusDesk_Helpdesk_Transcript_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto px-3 sm:px-6 py-4">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium">
            Active Student: <strong className="text-slate-800">{student.name}</strong> ({student.year}, {student.major})
          </span>
          {student.isInternational && (
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[10px]">
              F-1 SEVIS
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <button
                onClick={handleExportChat}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                title="Download transcript"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={onClearChat}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                title="Clear conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.length === 0 ? (
          <div className="py-6 px-2 text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 ring-8 ring-indigo-50/50 shadow-inner">
              <Bot className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome to CampusDesk AI Helpdesk
              </h2>
              <p className="text-sm text-slate-600 mt-1.5 max-w-lg mx-auto">
                Get instant, verified answers about courses & prerequisites, internship credit, upcoming deadlines, and official certificates.
              </p>
            </div>

            {/* Category Quick Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {CATEGORY_CHIPS.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <div
                    key={cat.category}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-indigo-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg ${cat.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs uppercase tracking-wide text-slate-800">
                        {cat.label}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {cat.questions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSendMessage(q)}
                          className="w-full text-left text-xs p-1.5 rounded-lg text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/70 transition-colors flex items-center justify-between group"
                        >
                          <span className="truncate pr-1">{q}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 shadow-xs ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-none'
                  }`}
                >
                  {/* Category & Model Badge for Bot messages */}
                  {!isUser && (
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/50">
                          {msg.category ? msg.category.toUpperCase() : 'HELPDESK'}
                        </span>
                        {msg.modelUsed && (
                          <span className="text-[10px] text-slate-400">
                            • {msg.modelUsed}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className={isUser ? 'text-sm font-medium leading-relaxed' : 'text-sm'}>
                    {isUser ? msg.content : formatChatMessage(msg.content)}
                  </div>

                  {/* Interactive Bot Action Footer */}
                  {!isUser && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      {/* Left: Escalate to advisor */}
                      <button
                        onClick={() =>
                          onOpenTicketModalWithInquiry(
                            msg.content.slice(0, 300),
                            msg.category || 'courses'
                          )
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60 font-semibold transition-colors text-[11px]"
                      >
                        <LifeBuoy className="w-3.5 h-3.5 text-amber-600" />
                        Escalate to Campus Staff
                      </button>

                      {/* Right: Audio, Copy, Thumbs */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSpeak(msg.id, msg.content)}
                          title="Read aloud"
                          className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                            speakingId === msg.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'
                          }`}
                        >
                          {speakingId === msg.id ? (
                            <VolumeX className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          title="Copy response"
                          className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        <div className="h-3 w-px bg-slate-200 mx-0.5"></div>

                        <button
                          onClick={() => onMessageFeedback(msg.id, 'positive')}
                          title="Helpful response"
                          className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                            msg.feedback === 'positive'
                              ? 'text-emerald-600 bg-emerald-50'
                              : 'text-slate-400'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            onMessageFeedback(msg.id, 'negative');
                            setFeedbackPromptId(msg.id);
                          }}
                          title="Inaccurate or incomplete"
                          className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                            msg.feedback === 'negative'
                              ? 'text-rose-600 bg-rose-50'
                              : 'text-slate-400'
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Feedback feedback note modal/inline */}
                  {feedbackPromptId === msg.id && (
                    <div className="mt-2.5 p-2 bg-rose-50/70 border border-rose-200 rounded-lg text-xs">
                      <p className="font-semibold text-rose-800 mb-1">
                        How can we improve this answer in the Quality Lab?
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Missing prerequisite MATH220, or deadline date was unclear..."
                          value={feedbackNote}
                          onChange={(e) => setFeedbackNote(e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs rounded border border-rose-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <button
                          onClick={() => {
                            if (feedbackNote) {
                              onMessageFeedback(msg.id, 'negative', feedbackNote);
                            }
                            setFeedbackPromptId(null);
                            setFeedbackNote('');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-rose-600 text-white rounded hover:bg-rose-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setFeedbackPromptId(null)}
                          className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-xs">
                    {student.name.charAt(0)}
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Searching Campus Knowledge Base & Formulating Answer...</span>
              </div>
              <div className="flex items-center space-x-1.5 pt-1">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips Bar if there are messages */}
      {messages.length > 0 && (
        <div className="py-2 overflow-x-auto flex gap-1.5 scrollbar-none">
          <button
            onClick={() => onSendMessage('What are the prerequisites for CS301?')}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition-colors whitespace-nowrap"
          >
            Prerequisites for CS301?
          </button>
          <button
            onClick={() => onSendMessage('How do I get academic credit for my internship?')}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 transition-colors whitespace-nowrap"
          >
            Internship INT-399 Credit?
          </button>
          <button
            onClick={() => onSendMessage('When is the tuition fee payment deadline?')}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 transition-colors whitespace-nowrap"
          >
            Tuition Payment Due Date?
          </button>
          <button
            onClick={() => onSendMessage('How can I order an official electronic transcript?')}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 transition-colors whitespace-nowrap"
          >
            Official e-Transcript Order?
          </button>
        </div>
      )}

      {/* Message Input Box */}
      <form onSubmit={handleSubmit} className="pt-2">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Ask about courses, prerequisites, internships, deadlines, transcripts..."
            className="w-full text-sm pl-4 pr-12 py-3.5 rounded-2xl border border-slate-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-slate-400 text-slate-900"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white shadow-sm transition-all flex items-center justify-center disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-slate-400 text-center mt-2">
          CampusDesk AI provides verified university policy guidance. For official exceptions, use the "Escalate to Campus Staff" button.
        </p>
      </form>
    </div>
  );
};
