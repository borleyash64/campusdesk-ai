export interface FAQItem {
  id: string;
  category: 'courses' | 'internships' | 'deadlines' | 'certificates';
  title: string;
  summary: string;
  keywords: string[];
  content: string;
  steps?: string[];
  department: string;
  contactEmail: string;
  location: string;
  officialLinks?: { label: string; url: string }[];
  relatedCourses?: string[];
}

export interface AcademicDeadline {
  id: string;
  title: string;
  date: string;
  category: 'courses' | 'internships' | 'deadlines' | 'certificates';
  critical: boolean;
  department: string;
  actionRequired: string;
}

export interface CourseDetail {
  code: string;
  title: string;
  credits: number;
  department: string;
  prerequisites: string[];
  corequisites?: string[];
  description: string;
  offeredSemesters: string[];
  instructor: string;
}

export const CAMPUS_COURSES: CourseDetail[] = [
  {
    code: 'CS101',
    title: 'Introduction to Computer Science & Python',
    credits: 3,
    department: 'Computer Science',
    prerequisites: ['None (Open to all students)'],
    description: 'Foundational problem solving, algorithmic thinking, control flow, functions, and introductory data structures using Python.',
    offeredSemesters: ['Fall', 'Spring', 'Summer'],
    instructor: 'Dr. Alan Miller (amiller@university.edu)'
  },
  {
    code: 'CS201',
    title: 'Data Structures and Algorithms',
    credits: 4,
    department: 'Computer Science',
    prerequisites: ['CS101 with grade of C or higher', 'MATH150 (Calculus I)'],
    description: 'Design and analysis of data structures (arrays, linked lists, hash tables, trees, graphs) and core algorithms (sorting, searching, traversal).',
    offeredSemesters: ['Fall', 'Spring'],
    instructor: 'Prof. Karen Zhang (kzhang@university.edu)'
  },
  {
    code: 'CS301',
    title: 'Advanced Algorithm Design & Complexity',
    credits: 3,
    department: 'Computer Science',
    prerequisites: ['CS201 with grade of C or higher', 'MATH220 (Discrete Mathematics)'],
    description: 'Dynamic programming, greedy paradigms, graph flow, NP-completeness, randomized algorithms, and time/space complexity analysis.',
    offeredSemesters: ['Fall', 'Spring'],
    instructor: 'Dr. Robert Hawkins (rhawkins@university.edu)'
  },
  {
    code: 'CS315',
    title: 'Database Management Systems',
    credits: 3,
    department: 'Computer Science',
    prerequisites: ['CS201'],
    description: 'Relational algebra, SQL, normalization (1NF-BCNF), indexing (B-trees), transactions (ACID), and NoSQL architectures.',
    offeredSemesters: ['Fall', 'Spring'],
    instructor: 'Prof. Elena Rostova (erostova@university.edu)'
  },
  {
    code: 'CS420',
    title: 'Machine Learning & Neural Networks',
    credits: 4,
    department: 'Computer Science & AI',
    prerequisites: ['CS301', 'MATH260 (Linear Algebra)', 'STAT310 (Probability & Statistics)'],
    description: 'Supervised and unsupervised learning, gradient descent, deep neural networks, CNNs, transformers, and ethical AI deployment.',
    offeredSemesters: ['Fall', 'Spring'],
    instructor: 'Dr. Devansh Patel (dpatel@university.edu)'
  },
  {
    code: 'CS440',
    title: 'Cloud Computing & Distributed Systems',
    credits: 3,
    department: 'Computer Science',
    prerequisites: ['CS201', 'CS280 (Computer Systems & Networking)'],
    description: 'Distributed consensus (Raft/Paxos), microservice architectures, virtualization, containerization (Docker/K8s), and cloud platforms.',
    offeredSemesters: ['Spring'],
    instructor: 'Prof. Sandra Wu (swu@university.edu)'
  },
  {
    code: 'BUS210',
    title: 'Organizational Behavior & Leadership',
    credits: 3,
    department: 'School of Management',
    prerequisites: ['None (Sophomore standing recommended)'],
    description: 'Group dynamics, motivation theory, cross-cultural leadership, ethics, and organizational change in high-growth companies.',
    offeredSemesters: ['Fall', 'Spring', 'Summer'],
    instructor: 'Dr. Marcus Sterling (msterling@university.edu)'
  },
  {
    code: 'INT399',
    title: 'Academic Internship Practicum',
    credits: 3,
    department: 'Career & Experiential Learning',
    prerequisites: ['Minimum 30 completed credits', 'Cumulative GPA >= 2.5', 'Approved Offer Letter'],
    description: 'Structured internship experience integrated with academic reflection, employer evaluations, and career portfolio defense.',
    offeredSemesters: ['Fall', 'Spring', 'Summer'],
    instructor: 'Dean of Experiential Learning (internships@university.edu)'
  }
];

export const ACADEMIC_DEADLINES: AcademicDeadline[] = [
  {
    id: 'dl-1',
    title: 'Tuition & Fee Payment Due Date (Fall)',
    date: 'August 14, 2026',
    category: 'deadlines',
    critical: true,
    department: 'Bursar & Student Financial Services',
    actionRequired: 'Pay via Student Portal or enroll in the 4-month installment payment plan to avoid a $100 late penalty and course registration holds.'
  },
  {
    id: 'dl-2',
    title: 'First Day of Classes (Fall Term)',
    date: 'August 24, 2026',
    category: 'courses',
    critical: false,
    department: 'Office of the Registrar',
    actionRequired: 'Verify room assignments and Canvas syllabus access.'
  },
  {
    id: 'dl-3',
    title: 'Course Add / Drop Deadline (100% Refund, No W)',
    date: 'September 08, 2026',
    category: 'courses',
    critical: true,
    department: 'Office of the Registrar',
    actionRequired: 'Last day to register for open courses or drop without receiving a "W" on official transcripts. All tuition refunded for dropped units.'
  },
  {
    id: 'dl-4',
    title: 'Fall Internship Agreement Submission Cutoff',
    date: 'September 18, 2026',
    category: 'internships',
    critical: true,
    department: 'Career Center & Experiential Learning',
    actionRequired: 'Submit employer-signed INT-399 Learning Agreement & job description for academic credit approval.'
  },
  {
    id: 'dl-5',
    title: 'International Student CPT Application Deadline',
    date: 'September 22, 2026',
    category: 'internships',
    critical: true,
    department: 'International Students & Scholars Office (ISSO)',
    actionRequired: 'F-1 visa students must receive updated I-20 with CPT authorization before commencing any paid or unpaid off-campus work.'
  },
  {
    id: 'dl-6',
    title: 'Midterm Grading & Academic Standing Check',
    date: 'October 16, 2026',
    category: 'courses',
    critical: false,
    department: 'Academic Advising',
    actionRequired: 'Review midterm grades on Portal; schedule advising if any course is below C-.'
  },
  {
    id: 'dl-7',
    title: 'Final Day to Withdraw from Courses (Grade "W")',
    date: 'November 02, 2026',
    category: 'courses',
    critical: true,
    department: 'Office of the Registrar',
    actionRequired: 'Withdrawal after this date requires Dean of Students medical/extenuating circumstances approval. No tuition refund issued.'
  },
  {
    id: 'dl-8',
    title: 'Spring 2027 Course Registration Opens',
    date: 'November 09, 2026',
    category: 'courses',
    critical: false,
    department: 'Office of the Registrar',
    actionRequired: 'Registration opens by priority: Seniors (Nov 9), Juniors (Nov 11), Sophomores (Nov 13), Freshmen (Nov 16).'
  },
  {
    id: 'dl-9',
    title: 'Graduation Application Deadline for Fall Conferral',
    date: 'November 20, 2026',
    category: 'certificates',
    critical: true,
    department: 'Degree Audit & Registrar',
    actionRequired: 'File online Application for Degree Candidacy on the Portal to ensure diploma printing and transcript conferral notation.'
  },
  {
    id: 'dl-10',
    title: 'Fall Semester Final Exams',
    date: 'December 12 - 18, 2026',
    category: 'deadlines',
    critical: false,
    department: 'Academic Scheduling',
    actionRequired: 'Check published examination matrix; conflict appeals must be filed 2 weeks prior.'
  },
  {
    id: 'dl-11',
    title: 'Official Fall Transcripts & Degree Certification Available',
    date: 'January 05, 2027',
    category: 'certificates',
    critical: false,
    department: 'Registrar Transcript Services',
    actionRequired: 'Electronic e-Transcripts with posted fall grades ready for instant order via Parchment.'
  }
];

export const CAMPUS_FAQS: FAQItem[] = [
  // --- COURSES ---
  {
    id: 'course-reg-process',
    category: 'courses',
    title: 'How do I register for classes and what is my registration window?',
    summary: 'Course registration occurs online via the Student Hub portal during tiered priority windows based on completed credits.',
    keywords: ['register', 'registration', 'classes', 'enroll', 'priority', 'window', 'cart', 'holds'],
    department: 'Office of the Registrar',
    contactEmail: 'registrar@university.edu',
    location: 'Student Services Hall, Room 101',
    officialLinks: [
      { label: 'Student Hub Course Registration', url: '#course-portal' },
      { label: 'Academic Advising Directory', url: '#advising' }
    ],
    content: `Course registration is conducted entirely through the Student Hub Portal. Students are assigned staggered enrollment windows based on completed credit hours:
1. Seniors (90+ credits): Day 1
2. Juniors (60-89 credits): Day 3
3. Sophomores (30-59 credits): Day 5
4. Freshmen (0-29 credits): Day 7

Before registering, make sure there are no holds (Bursar payment hold, immunization hold, or Academic Advising hold) on your profile.`,
    steps: [
      'Log into Student Hub -> Academics -> Course Enrollment.',
      'Check "Holds & To-Do List" to ensure your account is cleared for registration.',
      'Search courses using course codes (e.g., CS201) and add desired lecture and lab sections to your Enrollment Cart.',
      'When your priority registration window opens, click "Validate Prerequisites" and then "Enroll / Submit".',
      'Confirm the confirmation green checkmarks for all registered courses.'
    ]
  },
  {
    id: 'course-prereqs',
    category: 'courses',
    title: 'What should I do if I lack a prerequisite or want a prerequisite waiver?',
    summary: 'Prerequisite waivers require instructor approval and an official Prerequisite Override form signed by the Department Chair.',
    keywords: ['prerequisite', 'prereq', 'waiver', 'override', 'cs301', 'cs201', 'cs420', 'corequisite'],
    department: 'Academic Advising & Department Chairs',
    contactEmail: 'advising@university.edu',
    location: 'Academic Hall, Room 220',
    officialLinks: [
      { label: 'Prerequisite Override Form (PDF)', url: '#forms' },
      { label: 'Course Catalog & Syllabus Archive', url: '#catalog' }
    ],
    content: `Prerequisites ensure you have the foundational knowledge required for rigorous upper-division coursework. For example:
- CS201 requires CS101 and MATH150.
- CS301 requires CS201 and MATH220.
- CS420 requires CS301, MATH260, and STAT310.

If you took an equivalent course at another institution or have demonstrable equivalent industry knowledge:`,
    steps: [
      'Obtain syllabus/transcript evidence from previous coursework or projects.',
      'Email the course instructor requesting permission for an override.',
      'Submit the "Prerequisite Override Electronic Request" with instructor approval attached.',
      'Once approved by the Department Chair, the Registrar clears you to register within 48 hours.'
    ]
  },
  {
    id: 'course-drop-withdrawal',
    category: 'courses',
    title: 'What is the difference between dropping a class and withdrawing?',
    summary: 'Dropping occurs in the first two weeks (full refund, removed from record). Withdrawing occurs before week 10 (results in "W" grade, no refund).',
    keywords: ['drop', 'withdraw', 'withdrawal', 'w grade', 'refund', 'deadline', 'gpa impact'],
    department: 'Office of the Registrar',
    contactEmail: 'registrar@university.edu',
    location: 'Student Services Hall, Room 101',
    content: `Understanding the difference between Course Drop and Course Withdrawal is vital for your transcript and financial aid:
- **Course Drop (Weeks 1-2):** Dropping a class before the Add/Drop deadline (September 8) deletes the course completely from your transcript. You receive a 100% tuition refund or credit adjustment.
- **Course Withdrawal (Weeks 3-10):** Withdrawing after the Add/Drop deadline leaves a neutral "W" grade on your transcript. A "W" does NOT impact your cumulative GPA, but no tuition refund is granted, and it counts toward attempted hours for Financial Aid SAP (Satisfactory Academic Progress).
- **Post-Week 10:** Withdrawal is only permitted under extenuating medical or compassionate grounds via a petition to the Dean of Students.`,
    steps: [
      'Go to Student Hub -> My Classes -> Drop/Withdraw.',
      'Review impact on full-time status (minimum 12 credits required for dorms, athletics, financial aid, and international F-1 visas).',
      'Select reason and confirm submission.',
      'A confirmation email is sent with updated enrollment verification.'
    ]
  },
  {
    id: 'course-credit-overload',
    category: 'courses',
    title: 'Can I take more than 18 credit hours in a single semester?',
    summary: 'Students with a cumulative GPA of 3.3 or higher can request a credit overload up to 21 credits with Dean authorization.',
    keywords: ['overload', 'credits', 'credit limit', '18 credits', '21 credits', 'max credits', 'gpa requirement'],
    department: 'Dean of Undergraduate Studies',
    contactEmail: 'academicdean@university.edu',
    location: 'Founders Hall, Room 310',
    content: `The standard maximum load for full-time undergraduate students is 18 credits per semester (Summer: 12 credits).
To register for 19 to 21 credits:
- You must have completed at least 30 university credits.
- Your cumulative GPA must be 3.30 or higher.
- You must obtain written approval from your primary Academic Advisor and the Academic Dean.
- Additional per-credit tuition fees apply for credits exceeding 18 unless on an approved accelerated degree track.`,
    steps: [
      'Fill out the "Credit Overload Petition" form.',
      'Attach a written justification detailing schedule management.',
      'Submit to advising@university.edu at least 1 week prior to the start of the term.'
    ]
  },

  // --- INTERNSHIPS ---
  {
    id: 'internship-academic-credit',
    category: 'internships',
    title: 'How do I earn academic credit for an internship (INT-399)?',
    summary: 'Enroll in INT-399 before starting your internship. Requires 120 work hours per 3 credit units, learning agreement, and faculty mentor approval.',
    keywords: ['internship', 'academic credit', 'int399', 'int-399', 'hours', 'learning agreement', 'faculty mentor', 'summer internship'],
    department: 'Career & Experiential Learning Center',
    contactEmail: 'internships@university.edu',
    location: 'Student Union, Suite 204',
    officialLinks: [
      { label: 'INT-399 Learning Agreement Portal', url: '#internship-portal' },
      { label: 'Employer Supervisor Handbook', url: '#handbook' }
    ],
    content: `Academic credit cannot be granted retroactively; you MUST register for INT-399 during the semester or summer term in which the internship occurs.
Key Requirements:
- **Work Hours:** Minimum 120 verified work hours for 3 academic credits (240 hours for 6 credits).
- **Eligibility:** Sophomore standing or higher (30+ credits) and minimum 2.5 GPA.
- **Role Alignment:** The internship duties must directly align with your field of study.
- **Grading:** INT-399 is graded based on midterm supervisor review (30%), final project report (50%), and end-of-term evaluation (20%).`,
    steps: [
      'Secure an official written internship offer letter specifying start/end dates, hourly wage/stipend, supervisor contact, and duties.',
      'Submit the INT-399 Learning Agreement online with your faculty advisor.',
      'Career Services reviews and issues a Course Permission Override code within 3 business days.',
      'Register for INT-399 on the Student Hub before the term add/drop cutoff.',
      'Submit weekly activity logs and complete the final reflective paper.'
    ]
  },
  {
    id: 'internship-cpt-opt',
    category: 'internships',
    title: 'What are the CPT and OPT internship rules for international students?',
    summary: 'F-1 students require Curricular Practical Training (CPT) authorization before starting any off-campus internship. Must be enrolled for 1 full academic year.',
    keywords: ['cpt', 'opt', 'international', 'f-1', 'f1', 'visa', 'i-20', 'work authorization', 'isso', 'off campus'],
    department: 'International Students & Scholars Office (ISSO)',
    contactEmail: 'isso@university.edu',
    location: 'Global Center, Room 108',
    officialLinks: [
      { label: 'ISSO CPT Application Guide', url: '#cpt-guide' },
      { label: 'SEVIS Form I-20 Request', url: '#i20-request' }
    ],
    content: `International students on F-1 status CANNOT begin work until CPT authorization is explicitly approved and printed on page 2 of their Form I-20. Working even one day without CPT constitutes a serious SEVIS status violation.
- **Eligibility:** Must have maintained lawful full-time F-1 status for at least one full academic year (two consecutive semesters).
- **Part-Time vs Full-Time:** Up to 20 hours/week during fall and spring semesters; up to 40 hours/week during summer breaks.
- **Duration:** 12 months or more of full-time CPT eliminates post-completion OPT eligibility. Part-time CPT does not impact OPT.`,
    steps: [
      'Obtain an offer letter meeting ISSO specifications (employer EIN, job location, hours/week, duties).',
      'Enroll in the corresponding credit-bearing course (INT-399 or departmental independent study).',
      'Submit the CPT Request in the ISSO Portal at least 2 weeks before your intended start date.',
      'Collect your new Form I-20 with CPT endorsement before your first day of work.'
    ]
  },
  {
    id: 'internship-job-search',
    category: 'internships',
    title: 'Where can students find verified campus internships and resume coaching?',
    summary: 'Access the university Handshake job portal, attend bi-annual Career Fairs, and book 1-on-1 resume reviews at the Career Center.',
    keywords: ['handshake', 'find internship', 'resume review', 'career fair', 'interview prep', 'career center', 'stipend'],
    department: 'University Career Center',
    contactEmail: 'careers@university.edu',
    location: 'Student Union, Suite 204',
    content: `The University Career Center partners with over 850 vetted employers across tech, finance, healthcare, government, and arts.
Resources Available:
- **Handshake Portal:** All campus-approved internships and on-campus work-study positions are listed here.
- **Resume & LinkedIn Clinics:** Walk-in critique hours every Tuesday & Thursday, 1:00 PM - 4:00 PM.
- **Mock Technical & Behavioral Interviews:** 45-minute practice sessions with industry recruiters.
- **Unpaid Internship Stipend Grant:** Need-based university funding up to $2,500 for students taking unpaid public service or non-profit internships.`,
    steps: [
      'Activate your Handshake account using your student email.',
      'Upload your resume to the automated VMock platform for instant scoring.',
      'RSVP for the Fall STEM & Business Career Fair.',
      'Book a 1-on-1 career coach via Handshake -> Appointments.'
    ]
  },

  // --- DEADLINES ---
  {
    id: 'deadline-calendar',
    category: 'deadlines',
    title: 'What are the key academic deadlines for the current semester?',
    summary: 'Critical milestones include tuition payment (Aug 14), Add/Drop (Sep 8), Withdrawal (Nov 2), and Degree Candidacy (Nov 20).',
    keywords: ['deadline', 'deadlines', 'calendar', 'dates', 'tuition due', 'add drop date', 'finals week', 'when is'],
    department: 'Office of Academic Affairs & Registrar',
    contactEmail: 'registrar@university.edu',
    location: 'Student Services Hall, Room 101',
    content: `Never miss a deadline. Missing academic deadlines can result in financial holds, late registration fees ($100), or forfeiture of degree conferral:
- **August 14:** Tuition & Fee Payment Deadline (Bursar Hold applied thereafter).
- **August 24:** Classes Begin.
- **September 08:** Add/Drop Deadline (100% tuition refund, zero record on transcript).
- **September 18:** INT-399 Internship Credit Registration Deadline.
- **November 02:** Course Withdrawal Deadline (Grade "W" recorded).
- **November 09:** Spring Priority Registration begins.
- **November 20:** Graduation Application Deadline for December conferral.
- **December 12 - 18:** Final Examination Period.`,
    steps: [
      'Sync the Official University Academic iCal to your Google or Apple Calendar.',
      'Set automated alert notifications 7 days and 48 hours prior to financial and registration cutoffs.',
      'Check the Deadline Radar tab in CampusDesk AI for real-time countdown days.'
    ]
  },
  {
    id: 'deadline-payment-plans',
    category: 'deadlines',
    title: 'What happens if I miss the tuition deadline? Are there payment plans?',
    summary: 'Missing payment triggers a $100 late fee and course enrollment holds. Students can set up a 4-installment payment plan.',
    keywords: ['tuition', 'payment plan', 'fee', 'late fee', 'bursar', 'financial aid', 'hold', 'installment'],
    department: 'Bursar & Student Accounts',
    contactEmail: 'bursar@university.edu',
    location: 'Administration Tower, 1st Floor',
    content: `If your student account balance is not settled by the published deadline:
1. A $100 late payment penalty is assessed.
2. A "Bursar Accounts Hold" is placed, which prevents adding/dropping classes, accessing official transcripts, or registering for subsequent terms.
3. Your classes are NOT automatically dropped; you remain liable for accrued tuition unless you drop before September 8.

**Flexible Payment Plans:**
Students can enroll in the 4-Month Campus Installment Plan ($45 enrollment fee, 0% interest). Payments are divided into 4 equal installments due on the 15th of August, September, October, and November.`,
    steps: [
      'Log into Student Hub -> Student Finance -> Account Summary.',
      'Select "Enroll in Payment Plan" to divide payments into monthly installments.',
      'If awaiting Financial Aid / Scholarship disbursement, confirm your "Pending Aid" status with Financial Aid.'
    ]
  },

  // --- CERTIFICATES & TRANSCRIPTS ---
  {
    id: 'cert-official-transcript',
    category: 'certificates',
    title: 'How can I order an official academic transcript or e-transcript?',
    summary: 'Order official electronic transcripts ($10) via Parchment for delivery within 15 minutes, or request paper copies from the Registrar.',
    keywords: ['transcript', 'transcripts', 'official transcript', 'electronic transcript', 'parchment', 'grades record', 'gpa record'],
    department: 'Office of the Registrar - Transcript Division',
    contactEmail: 'transcripts@university.edu',
    location: 'Student Services Hall, Room 101',
    officialLinks: [
      { label: 'Parchment Online Transcript Ordering', url: '#parchment' },
      { label: 'Unofficial Transcript Portal (Free)', url: '#unofficial-transcript' }
    ],
    content: `The University provides both official electronic PDF transcripts and official physical hardcopy transcripts:
- **Official Electronic e-Transcript ($10):** Certified PDF with cryptographic signature, accepted by graduate schools, licensing boards, and employers worldwide. Delivered within 15 to 30 minutes via Parchment.
- **Official Paper Transcript ($15 + postage):** Printed on security watermark paper in a sealed tamper-evident envelope. Processed within 2-3 business days.
- **Unofficial Transcript (Free):** Available instantly at any time via Student Hub -> Academics -> View Unofficial Transcript.`,
    steps: [
      'Verify that you have no active financial or administrative holds.',
      'Log into the Student Portal and navigate to "Order Official Transcripts".',
      'Select recipient (Institution, Employer, or Yourself) and format (ePDF or Paper).',
      'Pay the $10 processing fee via credit or debit card.',
      'Receive tracking number and confirmation receipt email.'
    ]
  },
  {
    id: 'cert-enrollment-bonafide',
    category: 'certificates',
    title: 'How do I download an Enrollment Verification Certificate or Bonafide Letter?',
    summary: 'Download an instant, digitally signed Enrollment Verification Certificate free of charge from the Student Hub for insurance, loans, or visas.',
    keywords: ['enrollment verification', 'bonafide', 'certificate of enrollment', 'student status', 'health insurance', 'good student discount'],
    department: 'National Student Clearinghouse & Registrar',
    contactEmail: 'registrar@university.edu',
    location: 'Student Services Hall, Room 101',
    content: `An Enrollment Verification Certificate proves your current student status, credit load (Full-Time / Part-Time / Half-Time), expected graduation date, and academic good standing.
Common uses include:
- Health and auto insurance provider requirements (e.g. Good Student Discount).
- Student loan deferment verification.
- Housing and apartment lease income verification.
- Embassy visa renewals and military identification cards.`,
    steps: [
      'Log into Student Hub -> Records & Documents.',
      'Click "Generate Enrollment Verification Certificate".',
      'Choose between "Current Semester Enrollment" or "Complete Academic History".',
      'Click "Download Official PDF" – this document carries the University seal and cryptographic validation token.'
    ]
  },
  {
    id: 'cert-degree-completion-diploma',
    category: 'certificates',
    title: 'When will I receive my degree certificate / diploma and apostille?',
    summary: 'Diplomas are mailed 6 to 8 weeks following degree conferral. Digital diplomas (CeDiploma) are available within 3 weeks of graduation.',
    keywords: ['diploma', 'degree certificate', 'graduation certificate', 'cediploma', 'apostille', 'degree conferral', 'duplicate diploma'],
    department: 'Degree Audit & Commencement Office',
    contactEmail: 'graduation@university.edu',
    location: 'Founders Hall, Suite 105',
    content: `Following final exam grade posting and completion of your Degree Audit:
- **Degree Conferral Notation:** Transcripts reflect degree conferral within 10 business days of final grades.
- **Certified Electronic Diploma (CeDiploma):** A secure, verifiable digital credential available 3 weeks post-commencement.
- **Physical Diploma:** Mailed via USPS Priority to your designated Diploma Mailing Address approximately 6-8 weeks after term completion.
- **International Apostille / Authentication:** If relocating abroad, request an Apostille Packet ($45 state certification fee). Requires 3-4 weeks processing time through the Secretary of State.`,
    steps: [
      'Submit the Graduation Application by November 20 (Fall) or March 15 (Spring).',
      'Verify that your legal name and Diploma Mailing Address are accurate in the portal.',
      'Settle all library fines, graduation fees, and parking tickets.',
      'Look for the CeDiploma download invitation in your university email inbox.'
    ]
  },
  {
    id: 'cert-microcredentials',
    category: 'certificates',
    title: 'What specialized micro-credentials and certificates can I earn alongside my degree?',
    summary: 'Students can earn stackable certificates in AI & Data Science, Cloud Systems, Ethical Leadership, and Financial Modeling.',
    keywords: ['certificate', 'micro-credential', 'credentials', 'ai certificate', 'cloud certificate', 'specialization', 'badge'],
    department: 'Interdisciplinary Studies & Extended Learning',
    contactEmail: 'credentials@university.edu',
    location: 'Innovation Commons, Room 410',
    content: `Undergraduate and graduate students can complement their major with specialized university-accredited micro-credentials:
1. **Certificate in Applied AI & Machine Learning:** Requires CS420, CS315, and an applied capstone project.
2. **Cloud Systems Architecture:** Requires CS440 and AWS/GCP certification milestone.
3. **Business Analytics & Financial Modeling:** Open to STEM and Management majors.
4. **Ethical Leadership & Global Governance:** Interdisciplinary credential awarded with digital Credly badge.`,
    steps: [
      'Declare certificate intention with your academic advisor before completing 75 credit hours.',
      'Maintain minimum 3.0 GPA across certificate elective courses.',
      'Upon completion of required courses, submit Certificate Audit Form for badge issuance.'
    ]
  }
];

export interface BenchmarkTestCase {
  id: string;
  category: 'courses' | 'internships' | 'deadlines' | 'certificates' | 'edge_cases';
  question: string;
  studentContext?: string;
  expectedKeywords: string[];
  evaluationCriteria: string;
  difficulty: 'Easy' | 'Medium' | 'Complex';
}

export const TEST_BENCHMARK_CASES: BenchmarkTestCase[] = [
  {
    id: 'test-1',
    category: 'courses',
    question: 'What are the exact prerequisites for CS301, and can I take it concurrently with CS201?',
    studentContext: 'Sophomore CS major',
    expectedKeywords: ['CS201', 'MATH220', 'Discrete Mathematics', 'concurrently', 'not permitted', 'override'],
    evaluationCriteria: 'Must state prerequisites CS201 and MATH220, explain that concurrent enrollment requires special override, and provide contact for advising.',
    difficulty: 'Medium'
  },
  {
    id: 'test-2',
    category: 'courses',
    question: 'If I drop a class today, will I get a "W" on my transcript and a tuition refund?',
    studentContext: 'Freshman student in week 2',
    expectedKeywords: ['Add/Drop', 'September 8', '100% refund', '"W"', 'transcript', 'withdraw'],
    evaluationCriteria: 'Must distinguish between Drop (before Sep 8, full refund, no W) versus Withdrawal (after Sep 8, W recorded, no refund).',
    difficulty: 'Easy'
  },
  {
    id: 'test-3',
    category: 'internships',
    question: 'How many work hours are required to receive 3 academic credits for an INT-399 internship?',
    studentContext: 'Junior student with summer offer',
    expectedKeywords: ['120 hours', 'INT-399', 'offer letter', 'Learning Agreement', 'faculty mentor', '3 credits'],
    evaluationCriteria: 'Must accurately cite 120 work hours per 3 units and explain the required steps to register before the deadline.',
    difficulty: 'Easy'
  },
  {
    id: 'test-4',
    category: 'internships',
    question: 'I am on an F-1 international visa. Can I start working at my tech internship while my CPT application is pending?',
    studentContext: 'F-1 Visa Graduate Student',
    expectedKeywords: ['cannot begin work', 'SEVIS', 'I-20', 'CPT authorization', 'violation', 'ISSO'],
    evaluationCriteria: 'Strict compliance check: must warn that working without issued I-20 CPT endorsement is a federal SEVIS violation and outline ISSO steps.',
    difficulty: 'Complex'
  },
  {
    id: 'test-5',
    category: 'deadlines',
    question: 'What happens if I miss the tuition payment deadline, and is there an installment plan available?',
    studentContext: 'Incoming undergraduate student',
    expectedKeywords: ['August 14', '$100 late', 'hold', '4-month', 'installment plan', 'Bursar'],
    evaluationCriteria: 'Must specify the deadline date, $100 late penalty, account holds, and explain the 4-month installment option.',
    difficulty: 'Medium'
  },
  {
    id: 'test-6',
    category: 'certificates',
    question: 'How do I get an official electronic transcript sent to my employer or grad school immediately?',
    studentContext: 'Graduating senior applying to jobs',
    expectedKeywords: ['Parchment', 'e-transcript', '$10', '15 to 30 minutes', 'holds', 'Student Portal'],
    evaluationCriteria: 'Must give clear step-by-step for e-Transcripts via Parchment, specify the $10 fee, delivery timeline, and hold checking.',
    difficulty: 'Medium'
  },
  {
    id: 'test-7',
    category: 'certificates',
    question: 'My auto insurance company needs proof that I am a full-time student for a discount. Where do I get this certificate?',
    studentContext: 'Full-time sophomore',
    expectedKeywords: ['Enrollment Verification', 'Bonafide', 'free', 'Student Hub', 'Records', 'instant PDF'],
    evaluationCriteria: 'Must direct student to free instant Enrollment Verification Certificate in Student Hub without paying for a transcript.',
    difficulty: 'Easy'
  },
  {
    id: 'test-8',
    category: 'edge_cases',
    question: 'I want to take 21 credits next semester while doing a full-time 40-hour internship. Is this allowed?',
    studentContext: 'Ambitious junior student',
    expectedKeywords: ['credit overload', '3.3 GPA', '18 credits', 'Dean approval', 'INT-399', 'academic load', 'feasibility'],
    evaluationCriteria: 'Must address both the 18-credit limit/overload policy (requires 3.3 GPA and Dean sign-off) and policy restrictions on full-time internships during academic terms.',
    difficulty: 'Complex'
  }
];
