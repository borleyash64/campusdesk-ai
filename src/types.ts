export interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
  category?: 'courses' | 'internships' | 'deadlines' | 'certificates' | 'general';
  modelUsed?: string;
  sources?: string[];
  isAiGenerated?: boolean;
  feedback?: 'positive' | 'negative';
  feedbackNote?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  studentId: string;
  email: string;
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';
  major: string;
  gpa: number;
  isInternational: boolean;
  visaType?: string;
  earnedCredits: number;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  title: string;
  category: 'courses' | 'internships' | 'deadlines' | 'certificates' | 'financial';
  department: string;
  studentName: string;
  studentId: string;
  inquiry: string;
  status: 'Open' | 'In Review' | 'Escalated' | 'Resolved';
  createdAt: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  advisorNotes?: string;
}

export interface TestResultItem {
  testCaseId: string;
  category: 'courses' | 'internships' | 'deadlines' | 'certificates' | 'edge_cases';
  difficulty: 'Easy' | 'Medium' | 'Complex';
  question: string;
  response: string;
  modelUsed: string;
  durationMs: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordCoveragePct: number;
  totalScore: number;
  passed: boolean;
  criteria: string;
}

export interface TestSuiteSummary {
  totalTests: number;
  passedCount: number;
  passRate: number;
  averageQualityScore: number;
  averageDurationMs: number;
}
