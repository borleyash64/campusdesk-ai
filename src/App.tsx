/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { ChatTab } from './components/ChatTab.tsx';
import { QualityTestLab } from './components/QualityTestLab.tsx';
import { DeadlinesTab } from './components/DeadlinesTab.tsx';
import { KnowledgeBaseTab } from './components/KnowledgeBaseTab.tsx';
import { TicketsTab } from './components/TicketsTab.tsx';
import { PersonaModal } from './components/PersonaModal.tsx';
import { TicketModal } from './components/TicketModal.tsx';
import {
  Message,
  StudentProfile,
  SupportTicket,
  TestResultItem,
  TestSuiteSummary
} from './types.ts';
import {
  BenchmarkTestCase,
  TEST_BENCHMARK_CASES
} from './data/knowledgeBase.ts';

const DEFAULT_STUDENT: StudentProfile = {
  id: 'student-1',
  name: 'Alex Rivera',
  studentId: 'STU-2024-9841',
  email: 'arivera@university.edu',
  year: 'Sophomore',
  major: 'Computer Science',
  gpa: 3.42,
  isInternational: false,
  earnedCredits: 42
};

const INITIAL_WELCOME_MESSAGE: Message = {
  id: 'msg-welcome',
  sender: 'bot',
  content: `### 👋 Welcome to CampusDesk AI!
I am your 24/7 Academic & Student Life Assistant.

I can help you navigate official university policies, deadlines, and requirements:
• **📚 Courses & Registration:** Prerequisites, Add/Drop dates, withdrawal ("W" grades), credit overload permissions (18+ credits), and syllabi.
• **💼 Internships & Career:** Academic credit (INT-399, 120 work hours = 3 credits), learning agreements, international student CPT/OPT rules, and Handshake jobs.
• **⏰ Deadlines & Calendar:** Tuition payment deadlines ($100 late fee & 4-month payment plans), finals week, and graduation filing.
• **📜 Certificates & Transcripts:** Official electronic e-transcripts ($10 via Parchment), free Enrollment Verification certificates, and diploma/apostille orders.

Select one of the quick topics below or ask any question!`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  category: 'general',
  modelUsed: 'gemini-3.8-flash'
};

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-7412',
    title: 'Prerequisite Override for CS301 (Advanced Algorithms)',
    category: 'courses',
    department: 'Office of the Registrar & Academic Advising',
    studentName: 'Alex Rivera',
    studentId: 'STU-2024-9841',
    inquiry: 'I completed an approved Discrete Mathematics equivalent (MATH-220) at community college with an A- grade. Need override to register for CS301 section 02.',
    status: 'In Review',
    createdAt: 'Oct 09, 2026, 11:20 AM',
    priority: 'High',
    advisorNotes: 'Transcript evaluation received from Admissions. Awaiting Department Chair sign-off.'
  },
  {
    id: 'tkt-2',
    ticketNumber: 'TKT-6194',
    title: 'Summer 2026 INT-399 Academic Internship Approval',
    category: 'internships',
    department: 'Career & Experiential Learning Center',
    studentName: 'Alex Rivera',
    studentId: 'STU-2024-9841',
    inquiry: 'Submitted offer letter from Datadog for 12-week software engineering internship (480 total hours). Requesting 3 academic credits for INT-399.',
    status: 'Resolved',
    createdAt: 'Sep 28, 2026, 02:45 PM',
    priority: 'Medium',
    advisorNotes: 'Approved by Experiential Learning Dean. Override code INT399-PERM issued to student.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'tests' | 'deadlines' | 'knowledge' | 'tickets'>('chat');
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE]);
  const [student, setStudent] = useState<StudentProfile>(DEFAULT_STUDENT);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);

  // Persona & Ticket Modals
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketInitialInquiry, setTicketInitialInquiry] = useState('');
  const [ticketInitialCategory, setTicketInitialCategory] = useState<'courses' | 'internships' | 'deadlines' | 'certificates' | 'financial'>('courses');

  // Quality Lab state
  const [currentTone, setCurrentTone] = useState<string>('balanced');
  const [customInstructions, setCustomInstructions] = useState<string>(
    'Ensure all monetary fees ($10, $100) and critical deadlines are clearly visible in bold. Highlight F-1 visa CPT rules for work requests.'
  );
  const [testResults, setTestResults] = useState<TestResultItem[]>([]);
  const [testSummary, setTestSummary] = useState<TestSuiteSummary | null>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [isAiConnected, setIsAiConnected] = useState<boolean>(true);

  // Initial check & benchmark evaluation
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setIsAiConnected(true);
      })
      .catch((err) => {
        console.warn('Health check note:', err);
      });

    // Run initial benchmark suite
    runTestSuite();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoadingChat) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoadingChat(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          studentProfile: student,
          tone: currentTone,
          customInstructions: customInstructions
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        content: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: data.detectedCategory || 'general',
        modelUsed: data.modelUsed,
        sources: data.sources,
        isAiGenerated: data.isAiGenerated
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        content: `### ⚠️ Connection Notice
I was unable to complete the request right now (${error?.message || 'Network error'}).
Please check your question or escalate directly to the Registrar or Academic Advising using the button below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'general'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const runTestSuite = async (selectedIds?: string[]) => {
    setIsRunningTests(true);
    try {
      const response = await fetch('/api/test-suite/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCaseIds: selectedIds,
          tone: currentTone,
          customInstructions: customInstructions
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTestResults(data.results || []);
        setTestSummary(data.summary || null);
      }
    } catch (err) {
      console.error('Failed to run test suite:', err);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleAddCustomTest = (newTest: BenchmarkTestCase) => {
    // Add custom test to suite and evaluate
    runTestSuite([newTest.id]);
  };

  const handleMessageFeedback = (msgId: string, feedback: 'positive' | 'negative', note?: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, feedback, feedbackNote: note } : m
      )
    );
  };

  const handleOpenTicketModal = (inquiry: string = '', category?: any) => {
    setTicketInitialInquiry(inquiry);
    if (category) setTicketInitialCategory(category);
    setIsTicketModalOpen(true);
  };

  const handleTicketCreated = (newTicket: SupportTicket) => {
    setSupportTickets((prev) => [newTicket, ...prev]);
    // Also notify in chat
    const alertMsg: Message = {
      id: `bot-tkt-conf-${Date.now()}`,
      sender: 'bot',
      content: `### 🎫 Support Ticket Created: ${newTicket.ticketNumber}
Your inquiry **"${newTicket.title}"** has been routed to **${newTicket.department}**.
• **Status:** Open (${newTicket.priority} Priority)  
• **Assigned SLA:** 24 business hours  
• **Tracking:** You can view real-time updates under the **Tickets** tab.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: newTicket.category as any
    };
    setMessages((prev) => [...prev, alertMsg]);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: any) => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  const openTicketsCount = supportTickets.filter((t) => t.status !== 'Resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        student={student}
        onOpenPersonaModal={() => setIsPersonaModalOpen(true)}
        openTicketsCount={openTicketsCount}
        isAiConnected={isAiConnected}
      />

      <main className="flex-1">
        {activeTab === 'chat' && (
          <ChatTab
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoadingChat}
            student={student}
            onOpenTicketModalWithInquiry={(inq, cat) => handleOpenTicketModal(inq, cat)}
            onClearChat={() => setMessages([])}
            onMessageFeedback={handleMessageFeedback}
          />
        )}

        {activeTab === 'tests' && (
          <QualityTestLab
            currentTone={currentTone}
            setCurrentTone={setCurrentTone}
            customInstructions={customInstructions}
            setCustomInstructions={setCustomInstructions}
            testResults={testResults}
            testSummary={testSummary}
            isRunningTests={isRunningTests}
            onRunTestSuite={runTestSuite}
            onAddCustomTest={handleAddCustomTest}
          />
        )}

        {activeTab === 'deadlines' && (
          <DeadlinesTab
            onAskAboutDeadline={(q) => {
              setActiveTab('chat');
              handleSendMessage(q);
            }}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeBaseTab
            onAskQuestion={(q) => {
              setActiveTab('chat');
              handleSendMessage(q);
            }}
          />
        )}

        {activeTab === 'tickets' && (
          <TicketsTab
            tickets={supportTickets}
            onOpenCreateTicketModal={() => handleOpenTicketModal()}
            onUpdateTicketStatus={handleUpdateTicketStatus}
          />
        )}
      </main>

      {/* Student Persona Switcher Modal */}
      <PersonaModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
        currentStudent={student}
        onSelectStudent={(s) => {
          setStudent(s);
          // Post student switch notice to chat
          const switchMsg: Message = {
            id: `sys-${Date.now()}`,
            sender: 'bot',
            content: `*Switched active student profile to **${s.name}** (${s.year}, ${s.major}${s.isInternational ? ' • F-1 International' : ''}). Subsequent recommendations and prerequisite checks will now align with your standing.*`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            category: 'general'
          };
          setMessages((prev) => [...prev, switchMsg]);
        }}
      />

      {/* Advisor Ticket Escalation Modal */}
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        student={student}
        initialInquiry={ticketInitialInquiry}
        initialCategory={ticketInitialCategory}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  );
}
