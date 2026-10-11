import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  CheckCircle2,
  XCircle,
  Sliders,
  Sparkles,
  RefreshCw,
  Plus,
  BookOpen,
  Briefcase,
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
  Clock,
  Gauge,
  TrendingUp,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { BenchmarkTestCase, TEST_BENCHMARK_CASES } from '../data/knowledgeBase.ts';
import { TestResultItem, TestSuiteSummary } from '../types.ts';
import { formatChatMessage } from '../utils/formatMarkdown.tsx';

interface QualityTestLabProps {
  currentTone: string;
  setCurrentTone: (tone: string) => void;
  customInstructions: string;
  setCustomInstructions: (inst: string) => void;
  testResults: TestResultItem[];
  testSummary: TestSuiteSummary | null;
  isRunningTests: boolean;
  onRunTestSuite: (selectedIds?: string[]) => Promise<void>;
  onAddCustomTest: (test: BenchmarkTestCase) => void;
}

export const QualityTestLab: React.FC<QualityTestLabProps> = ({
  currentTone,
  setCurrentTone,
  customInstructions,
  setCustomInstructions,
  testResults,
  testSummary,
  isRunningTests,
  onRunTestSuite,
  onAddCustomTest
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed'>('all');

  // Custom test form state
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState<'courses' | 'internships' | 'deadlines' | 'certificates' | 'edge_cases'>('courses');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Complex'>('Medium');
  const [newKeywords, setNewKeywords] = useState('');
  const [newCriteria, setNewCriteria] = useState('');

  const filteredResults = testResults.filter((r) => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    if (filterStatus === 'passed' && !r.passed) return false;
    if (filterStatus === 'failed' && r.passed) return false;
    return true;
  });

  const handleCreateCustomTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const keywordsArray = newKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const customTest: BenchmarkTestCase = {
      id: `custom-${Date.now()}`,
      category: newCategory,
      question: newQuestion,
      difficulty: newDifficulty,
      expectedKeywords: keywordsArray.length > 0 ? keywordsArray : ['advising', 'policy'],
      evaluationCriteria: newCriteria || 'Clear, accurate response answering the user question with appropriate campus contacts.'
    };

    onAddCustomTest(customTest);
    setShowAddModal(false);
    setNewQuestion('');
    setNewKeywords('');
    setNewCriteria('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
            <FlaskConical className="w-3.5 h-3.5 text-indigo-300" />
            AI Helpdesk Quality & Prompt Benchmarking Lab
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Test Chatbot Answers & Improve Response Quality
          </h1>
          <p className="text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
            Run automated evaluation suites across courses, internships, deadlines, and certificates.
            Fine-tune system prompts, adjust tone style, and inspect keyword coverage in real time.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onRunTestSuite()}
            disabled={isRunningTests}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunningTests ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Evaluating Responses...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Run Benchmark Suite
              </>
            )}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Test Case
          </button>
        </div>

        {/* Decorative blur */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Quality Scorecard Grid */}
      {testSummary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Pass Rate</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900">{testSummary.passRate}%</span>
                <span className="text-xs text-slate-400">({testSummary.passedCount}/{testSummary.totalTests})</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Quality Score</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900">{testSummary.averageQualityScore}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Avg Response Time</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900">{testSummary.averageDurationMs}</span>
                <span className="text-xs text-slate-400">ms</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Scenarios</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900">{testSummary.totalTests}</span>
                <span className="text-xs text-slate-400">Cases</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Prompt Tuning & Quality Improvement Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              Prompt Directives & Response Quality Tuning
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Tweak settings to improve accuracy and structure
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Chatbot Persona Tone
            </label>
            <select
              value={currentTone}
              onChange={(e) => setCurrentTone(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="balanced">Balanced & Helpful (Steps, Links, Contacts)</option>
              <option value="concise">Ultra-Concise Bullet Points (Fast Summaries)</option>
              <option value="academic">Formal Academic (Bylaws & Official Policy)</option>
              <option value="mentoring">Peer Mentoring & Advising (Empathetic & Tips)</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Controls structural formatting, verbosity, and guidance style.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Admin Custom Directives & Quality Rules</span>
              <span className="text-[11px] text-indigo-600 font-normal">
                Injected into Gemini system prompt
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. Always remind international F-1 students about SEVIS CPT rules; highlight tuition fees in bold..."
                className="flex-1 text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => onRunTestSuite()}
                disabled={isRunningTests}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Re-Test Quality
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Tip: Add instructions like "Mention $100 late penalty on tuition" to raise keyword coverage score!
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          <button
            onClick={() => setSelectedCategory('courses')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'courses'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Courses
          </button>
          <button
            onClick={() => setSelectedCategory('internships')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'internships'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Internships
          </button>
          <button
            onClick={() => setSelectedCategory('deadlines')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'deadlines'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Deadlines
          </button>
          <button
            onClick={() => setSelectedCategory('certificates')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'certificates'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Certificates
          </button>
          <button
            onClick={() => setSelectedCategory('edge_cases')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'edge_cases'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Edge Cases
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none"
          >
            <option value="all">All ({testResults.length})</option>
            <option value="passed">Passed ({testResults.filter((r) => r.passed).length})</option>
            <option value="failed">Failed ({testResults.filter((r) => !r.passed).length})</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filteredResults.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <FlaskConical className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No test cases match filter.</p>
            <p className="text-xs text-slate-500 mt-1">Click "Run Benchmark Suite" to evaluate responses.</p>
          </div>
        ) : (
          filteredResults.map((result) => {
            const isExpanded = expandedTestId === result.testCaseId;
            return (
              <div
                key={result.testCaseId}
                className={`bg-white rounded-xl border transition-all overflow-hidden ${
                  result.passed ? 'border-slate-200 hover:border-slate-300' : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedTestId(isExpanded ? null : result.testCaseId)}
                  className="p-4 flex items-center justify-between cursor-pointer gap-3 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        result.passed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {result.passed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {result.category}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {result.difficulty}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                        {result.question}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-xs font-bold text-slate-900">
                          Score: {result.totalScore}
                        </span>
                        <span className="text-[11px] text-slate-400">/100</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {result.keywordCoveragePct}% Coverage • {result.durationMs}ms
                      </span>
                    </div>

                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">
                        Evaluation Criteria:
                      </span>
                      <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                        {result.criteria}
                      </p>
                    </div>

                    {/* Keywords pills */}
                    <div>
                      <span className="font-bold text-slate-700 block mb-1.5">
                        Keyword Coverage Verification:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {result.matchedKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-medium border border-emerald-200"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {kw}
                          </span>
                        ))}
                        {result.missingKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-medium border border-rose-200"
                          >
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Missing: {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Generated AI Answer Preview */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-700">
                          Chatbot Response ({result.modelUsed}):
                        </span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 max-h-64 overflow-y-auto">
                        {formatChatMessage(result.response)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Test Case Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                Add Custom Test Benchmark
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomTest} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Question
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Can I take CS440 if I only took CS101 and BUS210?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="courses">Courses</option>
                    <option value="internships">Internships</option>
                    <option value="deadlines">Deadlines</option>
                    <option value="certificates">Certificates</option>
                    <option value="edge_cases">Edge Cases</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Complex">Complex</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS201, CS280, prerequisite, override, not eligible"
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  These words must appear in the AI response for a passing grade.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Evaluation Criteria Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Must explain missing CS201 & CS280 prerequisites and deny direct entry."
                  value={newCriteria}
                  onChange={(e) => setNewCriteria(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Save & Add Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
