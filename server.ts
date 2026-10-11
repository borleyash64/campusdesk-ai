import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  CAMPUS_COURSES,
  ACADEMIC_DEADLINES,
  CAMPUS_FAQS,
  TEST_BENCHMARK_CASES
} from './src/data/knowledgeBase.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = express();
app.use(express.json());

// Initialize Gemini SDK if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Build consolidated knowledge context for system instruction
function getSystemPromptContext(tone: string = 'balanced', studentProfile?: any, customInstructions?: string) {
  const coursesContext = CAMPUS_COURSES.map(c => 
    `• ${c.code}: ${c.title} (${c.credits} cr, Dept: ${c.department}). Prereqs: ${c.prerequisites.join(', ')}. Instructor: ${c.instructor}. Description: ${c.description}`
  ).join('\n');

  const deadlinesContext = ACADEMIC_DEADLINES.map(d =>
    `• [${d.category.toUpperCase()}] ${d.title}: Due ${d.date} (${d.critical ? 'CRITICAL' : 'Standard'}). Dept: ${d.department}. Details: ${d.actionRequired}`
  ).join('\n');

  const faqsContext = CAMPUS_FAQS.map(f =>
    `• FAQ (${f.category.toUpperCase()}): "${f.title}"\n  Summary: ${f.summary}\n  Details: ${f.content}\n  Key Steps: ${f.steps?.join(' -> ') || 'N/A'}\n  Contact: ${f.department} (${f.contactEmail}, ${f.location})`
  ).join('\n\n');

  let toneGuidance = 'Helpful, empathetic, professional, and clear. Format answers with clear headings, bullet points, and actionable next steps.';
  if (tone === 'concise') {
    toneGuidance = 'Direct, concise, and bulleted. Provide essential facts, dates, and links in under 4 bullet points without unnecessary filler.';
  } else if (tone === 'academic') {
    toneGuidance = 'Authoritative, precise, referencing official University Code of Regulations, bylaws, and exact office locations.';
  } else if (tone === 'mentoring') {
    toneGuidance = 'Encouraging, supportive peer mentor tone with practical campus tips, proactive advice, and stress reduction.';
  }

  let profileContext = 'General University Student';
  if (studentProfile) {
    profileContext = `Name: ${studentProfile.name || 'Student'}, Year: ${studentProfile.year || 'Undergraduate'}, Major: ${studentProfile.major || 'Undeclared'}, International/Visa: ${studentProfile.isInternational ? 'Yes (F-1 Visa - SEVIS compliance required)' : 'Domestic'}, GPA: ${studentProfile.gpa || '3.2'}`;
  }

  return `You are "CampusDesk AI", the premier 24/7 AI Student Helpdesk Chatbot for University Students.
Your role is to answer all questions regarding:
1. COURSES: Registration windows, prerequisites, corequisites, drop/add policies, credit overloads, syllabi, grading.
2. INTERNSHIPS: Academic credit (INT-399, 120 work hours for 3 credits), learning agreements, international student CPT/OPT rules, Handshake job portal, faculty approvals.
3. DEADLINES: Tuition payment deadlines ($100 late penalty, Bursar holds, 4-month payment plans), add/drop dates, withdrawal dates ("W" on transcript), graduation application deadlines, exam schedules.
4. CERTIFICATES: Official electronic e-transcripts ($10 via Parchment), free instant Enrollment Verification certificates, degree diplomas, CeDiploma, notarized apostilles, micro-credentials.

STUDENT PROFILE CONTEXT:
${profileContext}

TONE & STYLE:
${toneGuidance}

${customInstructions ? `ADMIN CUSTOM DIRECTIVES:\n${customInstructions}\n` : ''}

OFFICIAL UNIVERSITY KNOWLEDGE BASE:

[COURSES CATALOG]
${coursesContext}

[ACADEMIC CALENDAR & DEADLINES]
${deadlinesContext}

[OFFICIAL POLICIES & PROCEDURES]
${faqsContext}

RESPONSE GUIDELINES:
- Always give accurate, actionable facts grounded strictly in the University Knowledge Base.
- If a question touches on International students (F-1 visa) and internships, always warn that off-campus employment without approved CPT printed on their Form I-20 is a SEVIS violation.
- Always include relevant department contacts (Registrar, Bursar, ISSO, Career Center) when human intervention or forms are required.
- Provide clear step-by-step instructions and highlight critical dates.
- Use clean Markdown with bold headings and bullet points.`;
}

// Enhanced intelligent knowledge engine for accurate retrieval and high quality responses
function generateFallbackKnowledgeResponse(query: string, studentProfile?: any, tone: string = 'balanced') {
  const lower = query.toLowerCase();

  // 1. Identify specific course mention with priority for subject course
  const foundCourses = CAMPUS_COURSES.filter(c => lower.includes(c.code.toLowerCase()));
  if (foundCourses.length > 0) {
    // If multiple courses mentioned (e.g. CS301 and CS201 in "prereqs for CS301"), find the main subject
    let targetCourse = foundCourses[0];
    if (foundCourses.length > 1) {
      const targetMatch = foundCourses.find(c => {
        const regex = new RegExp(`(for|about|prerequisites for|syllabus of|taking)\\s+${c.code}`, 'i');
        return regex.test(lower) || lower.indexOf(c.code.toLowerCase()) < lower.indexOf(foundCourses.find(o => o.code !== c.code)!.code.toLowerCase());
      });
      if (targetMatch) targetCourse = targetMatch;
    }

    // Check if query is asking about concurrent enrollment or prerequisites
    const isConcurrentQuestion = lower.includes('concurrent') || lower.includes('same time') || lower.includes('together');

    return {
      text: `### 📚 Course Information: ${targetCourse.code} - ${targetCourse.title}

**Credits:** ${targetCourse.credits} credit units  
**Department:** ${targetCourse.department}  
**Primary Instructor:** ${targetCourse.instructor}  
**Offered Semesters:** ${targetCourse.offeredSemesters.join(', ')}

#### 📋 Prerequisites & Requirements:
${targetCourse.prerequisites.map(p => `• **${p}**`).join('\n')}

${isConcurrentQuestion ? `#### ⚠️ Concurrent Enrollment Policy:
• Concurrent registration with prerequisite courses (e.g., taking ${targetCourse.code} simultaneously with its prerequisites) is **not permitted** by the university curriculum committee.
• Prerequisites must be fully completed with a grade of **C or higher** prior to the start of the semester.
• Under rare circumstances (e.g., graduating senior standing), a student may petition for a **Prerequisite Override** with explicit written approval from the instructor and Department Chair.` : ''}

#### 📖 Course Description:
${targetCourse.description}

#### 💡 Registration Next Steps:
1. Log into the **Student Hub** -> Course Enrollment.
2. If you have transfer credit equivalencies for ${targetCourse.prerequisites[0]}, file a **Prerequisite Override Electronic Form** with **Academic Advising** (advising@university.edu) at Academic Hall Room 220.
3. Registration windows open based on your earned credits (Seniors -> Juniors -> Sophomores -> Freshmen).`,
      detectedCategory: 'courses',
      confidence: 0.98,
      sources: [`Course Catalog: ${targetCourse.code}`, 'Academic Advising Handbook']
    };
  }

  // 2. Score all FAQs with multi-keyword relevance
  const scoredFaqs = CAMPUS_FAQS.map(faq => {
    let score = 0;
    // Title similarity
    const titleWords = faq.title.toLowerCase().split(/\s+/);
    titleWords.forEach(w => {
      if (w.length > 3 && lower.includes(w)) score += 3;
    });

    // Keyword match
    faq.keywords.forEach(kw => {
      if (lower.includes(kw.toLowerCase())) score += 5;
    });

    // Category match
    if (lower.includes(faq.category)) score += 2;

    return { faq, score };
  });

  scoredFaqs.sort((a, b) => b.score - a.score);
  const bestFaqMatch = scoredFaqs[0]?.score >= 4 ? scoredFaqs[0].faq : null;

  // 3. Score Deadlines
  const scoredDeadlines = ACADEMIC_DEADLINES.map(d => {
    let score = 0;
    const titleWords = d.title.toLowerCase().split(/\s+/);
    titleWords.forEach(w => {
      if (w.length > 3 && lower.includes(w)) score += 3;
    });
    if (lower.includes('tuition') && (d.id === 'dl-1' || d.id === 'dl-2')) score += 8;
    if ((lower.includes('drop') || lower.includes('add')) && d.id === 'dl-3') score += 6;
    if (lower.includes('withdraw') && d.id === 'dl-7') score += 6;
    if (lower.includes('graduat') && d.id === 'dl-9') score += 7;
    return { deadline: d, score };
  });
  scoredDeadlines.sort((a, b) => b.score - a.score);
  const bestDeadlineMatch = scoredDeadlines[0]?.score >= 6 ? scoredDeadlines[0].deadline : null;

  // If FAQ has higher relevance than Deadline, prefer FAQ (especially for Drop vs Withdraw or CPT)
  if (bestFaqMatch && (!bestDeadlineMatch || scoredFaqs[0].score >= scoredDeadlines[0].score)) {
    const stepsMarkdown = bestFaqMatch.steps && bestFaqMatch.steps.length > 0
      ? `\n\n#### 📝 Step-by-Step Instructions:\n${bestFaqMatch.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
      : '';

    return {
      text: `### 🎓 ${bestFaqMatch.title}

${bestFaqMatch.content}${stepsMarkdown}

---
#### 🏢 Official Department Contact & Support:
• **Managing Office:** ${bestFaqMatch.department}  
• **Email Inquiry:** [${bestFaqMatch.contactEmail}](mailto:${bestFaqMatch.contactEmail})  
• **Campus Location:** ${bestFaqMatch.location}  
• **Drop-in Office Hours:** Monday – Friday, 8:30 AM – 4:30 PM`,
      detectedCategory: bestFaqMatch.category,
      confidence: 0.94,
      sources: [`University Policy Repository: ${bestFaqMatch.title}`, bestFaqMatch.department]
    };
  }

  if (bestDeadlineMatch) {
    return {
      text: `### 🗓️ Important Academic Deadline: ${bestDeadlineMatch.title}

• **Official Date:** **${bestDeadlineMatch.date}**  
• **Urgency:** ${bestDeadlineMatch.critical ? '⚠️ **CRITICAL DEADLINE**' : 'ℹ️ Standard Milestone'}  
• **Managing Department:** ${bestDeadlineMatch.department}  

#### 📌 Action Required:
${bestDeadlineMatch.actionRequired}

#### ⚠️ Consequences & Regulations:
${bestDeadlineMatch.category === 'deadlines' ? 'Missing payment results in a $100 late penalty fee and a Bursar hold blocking course add/drop, diploma conferral, and transcript requests.' : 'Post-deadline changes require formal petition to the Dean of Students with documented extenuating circumstances.'}

#### 🔗 Next Steps:
1. Access your **Student Hub** -> Financials / Academics.
2. Enroll in the **4-Month Campus Installment Plan** ($45 enrollment fee, 0% interest) if you need payment flexibility.
3. Reach out to **${bestDeadlineMatch.department}** for extension requests.`,
      detectedCategory: bestDeadlineMatch.category,
      confidence: 0.95,
      sources: ['University Academic Calendar 2026-2027', bestDeadlineMatch.department]
    };
  }

  // General helpful overview fallback
  return {
    text: `### 🏛️ University Student Helpdesk

Thank you for reaching out! I can assist you immediately with questions across four core campus areas:

1. **📚 Courses & Enrollment:** Course prerequisites (e.g., CS101, CS201, CS301, CS420), registration priority windows, credit overloads, drop/add rules, and syllabus details.
2. **💼 Internships & Career:** Academic internship credits (INT-399, 120 work hours = 3 credits), international student CPT/OPT regulations, employer offer approvals, and Handshake jobs.
3. **⏰ Deadlines & Calendar:** Tuition due dates ($100 late fee & 4-month installment plans), add/drop cutoffs, withdrawal ("W" grade) timelines, and graduation filing.
4. **📜 Certificates & Transcripts:** Official electronic e-transcripts ($10 via Parchment), free instant Enrollment Verification certificates, CeDiploma, and apostille services.

**How can I assist you with your academics or campus life today?** You can click any quick question above or ask a specific question.`,
    detectedCategory: 'general',
    confidence: 0.85,
    sources: ['University Academic Guide', 'Registrar Help Center']
  };
}

// API: Student Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, studentProfile, tone = 'balanced', customInstructions } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content || '';

    // Check if Gemini AI is available
    if (aiClient && process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = getSystemPromptContext(tone, studentProfile, customInstructions);

        // Format conversational history for Gemini
        const contents = messages.map((m: any) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: tone === 'academic' ? 0.2 : (tone === 'concise' ? 0.3 : 0.6),
          }
        });

        const replyText = response.text || '';

        // Detect category from query
        let detectedCategory: 'courses' | 'internships' | 'deadlines' | 'certificates' = 'courses';
        const qLower = userQuery.toLowerCase();
        if (qLower.includes('intern') || qLower.includes('cpt') || qLower.includes('opt') || qLower.includes('job') || qLower.includes('handshake')) {
          detectedCategory = 'internships';
        } else if (qLower.includes('deadline') || qLower.includes('date') || qLower.includes('due') || qLower.includes('calendar') || qLower.includes('tuition')) {
          detectedCategory = 'deadlines';
        } else if (qLower.includes('certificate') || qLower.includes('transcript') || qLower.includes('diploma') || qLower.includes('bonafide') || qLower.includes('parchment')) {
          detectedCategory = 'certificates';
        }

        return res.json({
          reply: replyText,
          modelUsed: 'gemini-3.8-flash',
          isAiGenerated: true,
          detectedCategory,
          timestamp: new Date().toISOString()
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, gracefully using verified knowledge fallback:', geminiError?.message);
        // Fallback to verified local knowledge base
        const fallback = generateFallbackKnowledgeResponse(userQuery, studentProfile, tone);
        return res.json({
          reply: fallback.text,
          modelUsed: 'campus-knowledge-engine (fallback)',
          isAiGenerated: false,
          fallbackReason: geminiError?.message || 'API quota/network fallback',
          detectedCategory: fallback.detectedCategory,
          sources: fallback.sources,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Default to verified campus knowledge base if no API key configured
    const fallback = generateFallbackKnowledgeResponse(userQuery, studentProfile, tone);
    return res.json({
      reply: fallback.text,
      modelUsed: 'campus-knowledge-engine',
      isAiGenerated: false,
      detectedCategory: fallback.detectedCategory,
      sources: fallback.sources,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// API: Benchmark & Response Quality Testing Endpoint
app.post('/api/test-suite/run', async (req: Request, res: Response) => {
  try {
    const { testCaseIds, tone = 'balanced', customInstructions } = req.body;
    const testCasesToRun = testCaseIds && Array.isArray(testCaseIds) && testCaseIds.length > 0
      ? TEST_BENCHMARK_CASES.filter(t => testCaseIds.includes(t.id))
      : TEST_BENCHMARK_CASES;

    const runSingleTest = async (testCase: any) => {
      const startTime = Date.now();
      let responseText = '';
      let modelUsed = 'campus-knowledge-engine';

      if (aiClient && process.env.GEMINI_API_KEY) {
        try {
          const systemPrompt = getSystemPromptContext(tone, { name: 'Test Student', major: 'Computer Science' }, customInstructions);
          // Set a 6s timeout promise for the AI call to avoid long hangs
          const aiPromise = aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [{ role: 'user', parts: [{ text: testCase.question }] }],
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.3
            }
          });

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('AI generation timeout')), 6000)
          );

          const response: any = await Promise.race([aiPromise, timeoutPromise]);
          responseText = response.text || '';
          modelUsed = 'gemini-3.8-flash';
        } catch (e) {
          const fallback = generateFallbackKnowledgeResponse(testCase.question, undefined, tone);
          responseText = fallback.text;
          modelUsed = 'campus-knowledge-engine (fallback)';
        }
      } else {
        const fallback = generateFallbackKnowledgeResponse(testCase.question, undefined, tone);
        responseText = fallback.text;
      }

      const durationMs = Date.now() - startTime;
      const lowerResp = responseText.toLowerCase();

      // Evaluate expected keywords
      const matchedKeywords = testCase.expectedKeywords.filter((k: string) => 
        lowerResp.includes(k.toLowerCase())
      );
      const missingKeywords = testCase.expectedKeywords.filter((k: string) => 
        !lowerResp.includes(k.toLowerCase())
      );

      const keywordCoverage = (matchedKeywords.length / testCase.expectedKeywords.length);
      const isActionable = lowerResp.includes('step') || lowerResp.includes('contact') || lowerResp.includes('http') || lowerResp.includes('email') || lowerResp.includes('office') || lowerResp.includes('portal') || lowerResp.includes('1.') || lowerResp.includes('•');
      const hasClarity = responseText.length >= 100 && responseText.includes('\n');

      // Quality score computation (0 - 100)
      const accuracyScore = Math.round(keywordCoverage * 60);
      const actionabilityScore = isActionable ? 20 : 5;
      const clarityScore = hasClarity ? 20 : 10;
      const totalScore = Math.min(100, accuracyScore + actionabilityScore + clarityScore);

      return {
        testCaseId: testCase.id,
        category: testCase.category,
        difficulty: testCase.difficulty,
        question: testCase.question,
        response: responseText,
        modelUsed,
        durationMs,
        matchedKeywords,
        missingKeywords,
        keywordCoveragePct: Math.round(keywordCoverage * 100),
        totalScore,
        passed: totalScore >= 70,
        criteria: testCase.evaluationCriteria
      };
    };

    const results = await Promise.all(testCasesToRun.map(runSingleTest));

    const overallAverageScore = Math.round(
      results.reduce((acc, r) => acc + r.totalScore, 0) / results.length
    );
    const passRate = Math.round(
      (results.filter(r => r.passed).length / results.length) * 100
    );

    res.json({
      summary: {
        totalTests: results.length,
        passedCount: results.filter(r => r.passed).length,
        passRate,
        averageQualityScore: overallAverageScore,
        averageDurationMs: Math.round(results.reduce((acc, r) => acc + r.durationMs, 0) / results.length)
      },
      results
    });
  } catch (error: any) {
    console.error('Test suite runner error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Health & Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
    knowledgeBaseStats: {
      coursesCount: CAMPUS_COURSES.length,
      deadlinesCount: ACADEMIC_DEADLINES.length,
      faqsCount: CAMPUS_FAQS.length,
      testCasesCount: TEST_BENCHMARK_CASES.length
    }
  });
});

// Mount Vite or serve static assets
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampusDesk AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
