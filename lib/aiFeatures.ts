// AI Features - Real Gemini API Engine for HRMS with Local Mock Fallbacks

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  try {
    // Try Gemini 1.5 Flash first
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Gemini API error ${response.status}:`, errText);
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (replyText) {
      return replyText.trim();
    }
    throw new Error("Empty response from Gemini API");
  } catch (error) {
    console.error("Gemini API failed:", error);
    throw error;
  }
}

// ===== AI Resume Screener =====
export interface ResumeData {
  candidateName: string;
  skills: string[];
  experience: number;
  education: string;
  jobTitle: string;
  requiredSkills: string[];
}

export interface ResumeScore {
  overallScore: number;
  skillMatch: number;
  experienceScore: number;
  educationScore: number;
  recommendation: "Strong Hire" | "Hire" | "Maybe" | "Reject";
  strengths: string[];
  gaps: string[];
  summary: string;
}

export async function screenResume(data: ResumeData): Promise<ResumeScore> {
  const systemInstruction = "You are a professional HR talent acquisition screening engine. Respond with raw JSON format only matching the requested schema. No markdown fences.";
  const prompt = `Evaluate candidate resume:
  Name: ${data.candidateName}
  Skills: ${data.skills.join(", ")}
  Experience: ${data.experience} years
  Education: ${data.education}
  Applied for Job: ${data.jobTitle}
  Job Requirements: ${data.requiredSkills.join(", ")}

  Provide your evaluation in this JSON format strictly (do not output any markdown formatting or backticks, just raw JSON text):
  {
    "overallScore": number (0-100),
    "skillMatch": number (0-100),
    "experienceScore": number (0-100),
    "educationScore": number (0-100),
    "recommendation": "Strong Hire" | "Hire" | "Maybe" | "Reject",
    "strengths": ["string", "string"],
    "gaps": ["string", "string"],
    "summary": "Short 2-3 sentence overview"
  }`;

  try {
    const rawRes = await callGemini(prompt, systemInstruction);
    const cleanJson = rawRes.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson) as ResumeScore;
  } catch (err) {
    // Fallback Mock Engine
    await new Promise(r => setTimeout(r, 1200));
    const matchedSkills = data.skills.filter(s =>
      data.requiredSkills.some(r => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
    );
    const skillMatch = Math.round((matchedSkills.length / Math.max(data.requiredSkills.length, 1)) * 100);
    const experienceScore = Math.min(100, data.experience * 15);
    const educationScore = data.education.includes("IIT") || data.education.includes("IIM") ? 95
      : data.education.includes("BITS") || data.education.includes("NIT") ? 88 : 80;

    const overallScore = Math.round((skillMatch * 0.5) + (experienceScore * 0.3) + (educationScore * 0.2));
    const recommendation = overallScore >= 85 ? "Strong Hire" : overallScore >= 70 ? "Hire" : overallScore >= 55 ? "Maybe" : "Reject";
    
    return {
      overallScore,
      skillMatch,
      experienceScore,
      educationScore,
      recommendation,
      strengths: [`Good match for target role: ${data.jobTitle}`, `Found experience of ${data.experience} years`],
      gaps: data.skills.length < 3 ? ["Very few skills listed on candidate resume"] : ["Potential skill gaps compared to job requirements"],
      summary: `AI screening complete for candidate ${data.candidateName}. Overall alignment score of ${overallScore}%.`
    };
  }
}

// ===== AI Chatbot =====
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const HR_KNOWLEDGE_BASE: Record<string, string> = {
  "leave policy": "FWC IT Services offers 18 days of casual/sick leave, 15 days of annual leave, and 2 days of mental health leave per year. Leaves must be applied 3 days in advance (except sick leave).",
  "salary": "Salaries are processed on the last working day of each month. Payslips are available in the Employee Portal under Payroll section.",
  "appraisal": "Performance appraisals are conducted quarterly (Q1: April, Q2: July, Q3: October, Q4: January). Ratings are on a scale of 1-5.",
  "wfh": "Work from Home (WFH) is allowed up to 2 days per week with manager approval. Apply through the Leave Management section.",
  "holidays": "FWC follows 10 public holidays + 1 optional holiday. The holiday calendar is published every January on the company portal.",
  "provident fund": "PF contribution is 12% of basic salary from both employee and employer as per EPFO regulations. You can check your PF balance on the EPFO portal.",
  "health insurance": "All employees are covered under group health insurance of ₹3 Lakhs. Family coverage can be added at a nominal premium.",
  "resignation": "Notice period is 30 days for employees with < 2 years tenure, and 60 days for > 2 years. Submit resignation through the HR portal.",
  "promotion": "Promotions are considered annually during Q1 appraisals based on performance ratings, tenure, and role availability.",
  "training": "FWC provides ₹15,000 annual learning budget per employee for certifications and online courses. Submit requests to your manager.",
};

export async function chatWithAI(message: string, history: ChatMessage[]): Promise<string> {
  const historyText = history.slice(-5).map(h => `${h.role === "user" ? "Employee" : "HR Assistant"}: ${h.content}`).join("\n");
  const systemInstruction = "You are FWC HR AI, a helpful AI assistant for FWC IT Services (Pvt. Ltd. based in India). " +
    "You can answer ANY question — HR policies, general knowledge, tech questions, coding help, math, science, current events, etc. " +
    "For HR topics: 18 casual/sick leaves, 15 annual leaves, 2 mental health leaves per year. WFH up to 2 days/week with manager approval. " +
    "Notice period: 30 days (< 2yr), 60 days (> 2yr). Salary processed last working day. PF: 12% both sides. Health insurance: ₹3 Lakhs. " +
    "Be helpful, conversational, accurate, and concise. Never say you cannot answer general questions.";

  const prompt = `${historyText}\nUser: ${message}\nAI:`;

  try {
    return await callGemini(prompt, systemInstruction);
  } catch (err) {
    // Smart contextual fallback engine
    await new Promise(r => setTimeout(r, 400));
    return smartFallbackResponse(message, history);
  }
}

function smartFallbackResponse(message: string, history: ChatMessage[]): string {
  const lower = message.toLowerCase().trim();

  // ---- Greetings ----
  if (/^(hi|hello|hey|howdy|sup|good morning|good afternoon|good evening|namaste|hii+|helo)/.test(lower)) {
    const greets = [
      "Hello! 👋 I'm FWC's AI Assistant. I can help you with HR policies, general knowledge, tech questions, and much more. What would you like to know?",
      "Hey there! 😊 I'm your AI assistant. Ask me anything — HR policies, general questions, coding help, you name it!",
      "Namaste! 🙏 How can I assist you today? I'm here to help with HR queries or any other questions you have.",
    ];
    return greets[Math.floor(Math.random() * greets.length)];
  }

  // ---- How are you ----
  if (/how are you|how r u|how do you do|what's up|wassup/.test(lower)) {
    return "I'm doing great, thank you for asking! 😊 Ready to help you with anything — HR policies, general knowledge, or any questions you have. What can I do for you?";
  }

  // ---- What can you do ----
  if (/what can you do|what do you know|your capabilities|help me|what are you/.test(lower)) {
    return "I'm FWC's AI Assistant and I can help you with:\n\n• **HR Policies** — leaves, salary, appraisals, WFH, insurance\n• **General Knowledge** — science, history, geography, current events\n• **Tech Questions** — programming, software, IT concepts\n• **Math & Logic** — calculations, problem solving\n• **Company Info** — FWC IT Services policies and procedures\n\nJust ask me anything! 🚀";
  }

  // ---- Leave Policy ----
  if (/leave|vacation|time off|sick day|casual leave|annual leave|pto/.test(lower)) {
    if (/sick|medical|health/.test(lower)) {
      return "🏥 **Sick Leave Policy at FWC IT Services:**\n\nEmployees get **18 days** of combined casual/sick leave per year. Sick leave can be applied same-day or retroactively with a medical certificate for absences over 3 days. No prior notice needed for sick leave. Unused sick leave does not carry forward to next year.";
    }
    if (/mental|wellness|burnout/.test(lower)) {
      return "🧘 **Mental Health Leave:**\n\nFWC offers **2 dedicated mental health days** per year, separate from your regular leave quota. These can be taken without providing a specific reason. We prioritize employee wellbeing — please don't hesitate to use them when needed.";
    }
    return "📅 **Leave Policy Summary:**\n\n• **Casual/Sick Leave:** 18 days/year\n• **Annual/Earned Leave:** 15 days/year\n• **Mental Health Leave:** 2 days/year\n• **Public Holidays:** 10 fixed + 1 optional\n\n**Rules:** Apply 3 days in advance (except sick leave). Submit via the Leave Management portal. Manager approval required for planned leaves.";
  }

  // ---- Salary / Payroll ----
  if (/salary|pay|payroll|paycheck|payslip|ctc|compensation|wages|hike|increment/.test(lower)) {
    if (/hike|increment|raise|increase/.test(lower)) {
      return "💰 **Salary Hike Policy:**\n\nSalary increments at FWC are processed annually, typically in April (Q1 appraisal cycle). Average increments range from 8-20% based on performance ratings. Exceptional performers (rating 4.5+) may receive spot bonuses. Promotion-linked increments are processed separately.";
    }
    return "💵 **Payroll at FWC IT Services:**\n\n• Salaries are credited on the **last working day** of each month\n• Payslips are available in the **Employee Portal → Payroll** section\n• CTC includes base salary, HRA, conveyance, and other allowances\n• **PF:** 12% of basic salary deducted + employer contribution\n• **TDS:** Deducted as per Income Tax slab\n\nFor any payroll discrepancies, contact payroll@fwcit.com";
  }

  // ---- WFH / Remote ----
  if (/wfh|work from home|remote|hybrid|work remotely/.test(lower)) {
    return "🏠 **Work From Home Policy:**\n\n• WFH is allowed up to **2 days per week**\n• Requires **manager approval** (submit via Leave portal)\n• Core hours (10 AM – 4 PM IST) must be maintained remotely\n• WFH requests must be submitted at least **1 day in advance**\n• Team leads may restrict WFH during sprint deadlines or client visits";
  }

  // ---- Appraisal / Performance ----
  if (/appraisal|performance review|rating|evaluation|feedback|kpi/.test(lower)) {
    return "📊 **Performance Appraisal Cycle at FWC:**\n\n• **Q1 (April)** — Annual appraisal + salary revision\n• **Q2 (July)** — Mid-year review\n• **Q3 (October)** — Quarterly check-in\n• **Q4 (January)** — Year-end assessment\n\n**Rating Scale:** 1–5 (1 = Below Expectations, 5 = Exceptional)\n\nSelf-assessments must be submitted **2 weeks before** the review date. Results are shared within 30 days of the review period.";
  }

  // ---- Insurance ----
  if (/insurance|mediclaim|health cover|medical|hospitalization/.test(lower)) {
    return "🏥 **Health Insurance at FWC IT Services:**\n\n• **Coverage:** ₹3 Lakhs per employee per year\n• **Family Coverage:** Spouse + 2 children can be added at nominal premium (~₹2,500/year)\n• **Network Hospitals:** 5,000+ cashless hospitals across India\n• **Claim Process:** Cashless at network hospitals | Reimbursement within 15 working days\n\nFor insurance cards or claims, contact insurance@fwcit.com";
  }

  // ---- Resignation / Notice ----
  if (/resign|notice period|quit|leaving|exit|offboard/.test(lower)) {
    return "📝 **Resignation & Notice Period:**\n\n• **< 2 years tenure:** 30 days notice\n• **> 2 years tenure:** 60 days notice\n\n**Process:**\n1. Submit resignation via HR Portal\n2. Manager acknowledgment within 3 days\n3. Handover document submission\n4. Exit interview with HR\n5. Full & Final settlement within 45 days\n\nFor early relieving requests, discuss with your manager and HR team.";
  }

  // ---- PF / Provident Fund ----
  if (/pf|provident fund|epfo|gratuity|pension/.test(lower)) {
    return "💼 **Provident Fund (PF) Details:**\n\n• **Employee Contribution:** 12% of basic salary\n• **Employer Contribution:** 12% of basic salary (8.33% to EPS, 3.67% to EPF)\n• PF is deducted monthly and reflected in your payslip\n• Check balance on **EPFO portal** (epfindia.gov.in) using your UAN\n• Withdrawal allowed after resignation + 2 months waiting period";
  }

  // ---- Training / Learning ----
  if (/training|course|certification|learn|upskill|udemy|coursera|budget/.test(lower)) {
    return "📚 **Learning & Development at FWC:**\n\n• Annual learning budget: **₹15,000 per employee**\n• Covers certifications, online courses (Udemy, Coursera, Pluralsight)\n• **Process:** Get manager approval → Share invoice → HR reimburses within 30 days\n• Internal training programs are conducted monthly on key tech & soft skills\n• Certifications listed on employee profile boost appraisal ratings!";
  }

  // ---- Office hours ----
  if (/office hour|work hour|timing|shift|working day/.test(lower)) {
    return "🕐 **Office Hours at FWC IT Services:**\n\n• **Standard Hours:** 9:30 AM – 6:30 PM IST (Mon–Fri)\n• **Flexible Timing:** 8 AM – 11 AM start window (core hours 11 AM – 4 PM)\n• **Saturday:** Generally off (project-based exceptions apply)\n• **Overtime:** Pre-approved by manager; compensated as comp-off or pay\n• Remote employees must be available during core hours";
  }

  // ---- General Knowledge: What is X ----
  if (/what is|what are|explain|define|meaning of|tell me about/.test(lower)) {
    const topic = message.replace(/what is|what are|explain|define|meaning of|tell me about/gi, "").trim();

    // Tech topics
    if (/react|javascript|typescript|python|java|node|angular|vue|next\.?js/.test(lower)) {
      const techMap: Record<string, string> = {
        "react": "⚛️ **React** is a JavaScript library by Meta for building user interfaces. It uses a component-based architecture and a virtual DOM for efficient rendering. React is widely used for single-page applications and is one of the most popular frontend frameworks.\n\n**Key concepts:** Components, JSX, State, Props, Hooks, Context API.",
        "javascript": "🌐 **JavaScript** is a high-level, interpreted programming language used primarily for web development. It runs in browsers and on servers (via Node.js). It's the only language natively supported by all web browsers.\n\n**Key features:** Dynamic typing, first-class functions, event-driven programming, async/await.",
        "typescript": "📘 **TypeScript** is a strongly-typed superset of JavaScript developed by Microsoft. It adds static type checking, interfaces, and enhanced tooling. TypeScript code compiles down to plain JavaScript.\n\n**Benefits:** Catch errors at compile time, better IDE support, cleaner large-scale code.",
        "python": "🐍 **Python** is a high-level, general-purpose programming language known for its clean syntax and readability. It's widely used in data science, AI/ML, web development, automation, and scripting.\n\n**Popular libraries:** NumPy, Pandas, TensorFlow, Django, Flask.",
        "node": "🟢 **Node.js** is a JavaScript runtime built on Chrome's V8 engine. It allows running JavaScript on the server side. It uses an event-driven, non-blocking I/O model perfect for scalable network applications.",
      };
      for (const [key, val] of Object.entries(techMap)) {
        if (lower.includes(key)) return val;
      }
    }

    // Apple
    if (/apple/.test(lower)) {
      return "🍎 **Apple Inc.** is an American multinational technology company headquartered in Cupertino, California. Founded in 1976 by Steve Jobs, Steve Wozniak, and Ronald Wayne.\n\n**Key Products:** iPhone, iPad, Mac, Apple Watch, AirPods\n**Key Services:** App Store, iCloud, Apple Music, Apple TV+\n**Market Cap:** One of the most valuable companies in the world (~$3 trillion)\n\n*Fun fact: Apple was the first US company to reach a $1 trillion market cap!*";
    }

    // Science
    if (/gravity|quantum|relativity|physics|chemistry|biology|dna|atom/.test(lower)) {
      if (/gravity/.test(lower)) return "🌍 **Gravity** is one of the four fundamental forces of nature. It is the attractive force between objects with mass. Isaac Newton described gravity with his law of universal gravitation, and Einstein later explained it through General Relativity as a curvature in spacetime caused by mass and energy.";
      if (/dna/.test(lower)) return "🧬 **DNA (Deoxyribonucleic Acid)** is the molecule that carries genetic information in all living organisms. It's structured as a double helix made of nucleotide base pairs (A-T and G-C). DNA contains the instructions for making proteins and is passed from parent to offspring.";
    }

    // Math
    if (/pi|fibonacci|prime|calculus|algebra|geometry/.test(lower)) {
      if (/pi/.test(lower)) return "🔢 **Pi (π)** is the mathematical constant representing the ratio of a circle's circumference to its diameter. Its value is approximately **3.14159265...** and it continues infinitely without repeating. Pi is used in geometry, trigonometry, physics, and engineering.";
    }

    // Generic intelligent response for unknown topics
    return `🤖 **About "${topic}":**\n\nGreat question! I have knowledge about a wide range of topics. Here's what I can tell you:\n\n${topic} is a topic I can discuss in detail. Based on general knowledge:\n\n• It's a subject that encompasses various concepts and applications\n• To get the most accurate and detailed information, I'd recommend checking Wikipedia, Google, or specialized sources\n\nIs there a specific aspect of **${topic}** you'd like me to focus on? I'm happy to help with more targeted questions! 💡`;
  }

  // ---- Math calculations ----
  if (/calculate|compute|\d+\s*[\+\-\*\/]\s*\d+|how much is|what is \d/.test(lower)) {
    try {
      const expr = message.match(/[\d\s\+\-\*\/\.\(\)]+/)?.[0]?.trim();
      if (expr) {
        // Safe eval for simple math
        const result = Function(`"use strict"; return (${expr})`)();
        return `🔢 The answer is: **${result}**\n\nCalculation: ${expr} = ${result}`;
      }
    } catch (e) {
      // fall through
    }
  }

  // ---- Thanks ----
  if (/thank|thanks|thx|appreciate|great|awesome|perfect|helpful/.test(lower)) {
    return "You're welcome! 😊 Happy to help. Is there anything else you'd like to know? I'm here for HR queries, general knowledge, tech questions, and much more!";
  }

  // ---- Bye ----
  if (/bye|goodbye|see you|take care|ttyl|cya/.test(lower)) {
    return "Goodbye! 👋 Have a great day! Feel free to come back anytime you have questions. Take care! 😊";
  }

  // ---- Smart generic response for anything else ----
  const words = message.trim().split(/\s+/);
  const topic = words.slice(0, 5).join(" ");
  return `🤖 I understand you're asking about **"${topic}"**.\n\nI'm FWC's AI Assistant and I can help with a wide range of questions — HR policies, general knowledge, tech topics, math, and more.\n\nCould you rephrase or give me more details about what you'd like to know? I'll do my best to give you a thorough answer! 💡\n\n*Quick HR topics I can instantly answer: leave policy, salary, appraisals, WFH, insurance, PF, resignation*`;
}


// ===== AI Performance Predictor =====
export interface PerformancePrediction {
  predictedRating: number;
  trend: "Improving" | "Stable" | "Declining";
  riskLevel: "Low" | "Medium" | "High";
  keyFactors: string[];
  recommendations: string[];
  nextQuarterScore: number;
}

export async function predictPerformance(employeeData: {
  name: string;
  currentScore: number;
  attendance: number;
  leaves: number;
  recentRatings: number[];
}): Promise<PerformancePrediction> {
  const systemInstruction = "You are an HR talent analytics engine forecasting employee performance trends. Respond in raw JSON matching the schema. No markdown fences.";
  const prompt = `Predict performance for employee:
  Name: ${employeeData.name}
  Current Rating: ${employeeData.currentScore}/100
  Attendance Rate: ${employeeData.attendance}%
  Leaves Taken: ${employeeData.leaves} days
  Recent Quarterly Scores: ${employeeData.recentRatings.join(", ")}

  Provide a JSON object strictly matching this schema:
  {
    "predictedRating": number (1.0 to 5.0 scale),
    "trend": "Improving" | "Stable" | "Declining",
    "riskLevel": "Low" | "Medium" | "High",
    "keyFactors": ["string", "string"],
    "recommendations": ["string", "string"],
    "nextQuarterScore": number (0-100)
  }`;

  try {
    const rawRes = await callGemini(prompt, systemInstruction);
    const cleanJson = rawRes.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson) as PerformancePrediction;
  } catch (err) {
    // Fallback
    await new Promise(r => setTimeout(r, 1000));
    const avgRating = employeeData.recentRatings.reduce((a, b) => a + b, 0) / employeeData.recentRatings.length;
    const trend = employeeData.currentScore > avgRating ? "Improving" : employeeData.currentScore < avgRating - 5 ? "Declining" : "Stable";
    const nextQuarterScore = Math.min(100, Math.round(employeeData.currentScore * 0.7 + (employeeData.attendance * 0.2) + (10 - employeeData.leaves)));
    const riskLevel = nextQuarterScore >= 80 ? "Low" : nextQuarterScore >= 65 ? "Medium" : "High";

    return {
      predictedRating: nextQuarterScore / 20,
      trend,
      riskLevel,
      keyFactors: ["Attendance patterns", "Quarterly scores analysis"],
      recommendations: ["Ensure regular checkins", "Establish clear goals"],
      nextQuarterScore
    };
  }
}

// ===== AI Interview Question Generator =====
export interface InterviewQuestions {
  technical: string[];
  behavioral: string[];
  situational: string[];
  roleSpecific: string[];
}

export async function generateInterviewQuestions(role: string, skills: string[], experience: number): Promise<InterviewQuestions> {
  const systemInstruction = "You are an expert technical interviewer. Respond in raw JSON matching the schema. No markdown fences.";
  const prompt = `Generate interview questions for:
  Position: ${role}
  Candidate Skills: ${skills.join(", ")}
  Experience: ${experience} years

  Return a JSON object in this format strictly:
  {
    "technical": ["string", "string", "string"],
    "behavioral": ["string", "string", "string"],
    "situational": ["string", "string", "string"],
    "roleSpecific": ["string", "string", "string"]
  }`;

  try {
    const rawRes = await callGemini(prompt, systemInstruction);
    const cleanJson = rawRes.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson) as InterviewQuestions;
  } catch (err) {
    // Fallback
    await new Promise(r => setTimeout(r, 1000));
    return {
      technical: [
        `Explain how you implement core principles in ${skills[0] || "coding"}.`,
        `How do you optimize system performance in a ${role} architecture?`,
        `What are standard debugging practices in ${skills[1] || "development"}?`
      ],
      behavioral: [
        "Tell me about a time you handled a critical task under tight pressure.",
        "How do you deal with complex requirements that change mid-sprint?"
      ],
      situational: [
        `If your manager made a technical decision that you knew was flawed, how would you approach them?`,
        `How do you prioritize deliverables when three managers ask for tasks at the same time?`
      ],
      roleSpecific: [
        `What is the most challenging feature you delivered as a ${role}?`,
        `How do you mentor juniors or delegate features to align project delivery?`
      ]
    };
  }
}

// ===== AI Sentiment Analyzer =====
export interface SentimentResult {
  sentiment: "Positive" | "Neutral" | "Negative";
  score: number;
  emotions: { joy: number; frustration: number; engagement: number; stress: number };
  insights: string[];
  actionItems: string[];
}

export async function analyzeSentiment(feedback: string): Promise<SentimentResult> {
  const systemInstruction = "You are a workplace psychology AI feedback assessment assistant. Respond in raw JSON matching the schema. No markdown fences.";
  const prompt = `Analyze employee feedback:
  "${feedback}"

  Return a JSON object strictly in this format:
  {
    "sentiment": "Positive" | "Neutral" | "Negative",
    "score": number (0-100, where 100 is positive),
    "emotions": { "joy": number, "frustration": number, "engagement": number, "stress": number },
    "insights": ["string", "string"],
    "actionItems": ["string", "string"]
  }`;

  try {
    const rawRes = await callGemini(prompt, systemInstruction);
    const cleanJson = rawRes.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson) as SentimentResult;
  } catch (err) {
    // Fallback
    await new Promise(r => setTimeout(r, 800));
    const positiveWords = ["great", "excellent", "love", "good", "happy", "supportive"];
    const negativeWords = ["bad", "terrible", "frustrated", "stressed", "overworked"];

    const lower = feedback.toLowerCase();
    const pos = positiveWords.filter(w => lower.includes(w)).length;
    const neg = negativeWords.filter(w => lower.includes(w)).length;
    const score = Math.max(0, Math.min(100, 50 + (pos - neg) * 15));
    const sentiment = score >= 65 ? "Positive" : score >= 40 ? "Neutral" : "Negative";

    return {
      sentiment,
      score,
      emotions: {
        joy: score,
        frustration: 100 - score,
        engagement: score,
        stress: Math.max(10, 90 - score),
      },
      insights: [`Employee sentiment evaluated as ${sentiment}.`, "Reflects current work atmosphere perception."],
      actionItems: sentiment === "Negative" ? ["Arrange a 1:1 meeting with leadership.", "Review work assignments."] : ["Recognize employee contribution."]
    };
  }
}
