/**
 * Google Gemini AI Integration & Grounded Civic Reasoning Engine
 * Grounded in verified Census 2027 knowledge base.
 */

import censusOverview from '@/data/census-overview.json';
import phasesData from '@/data/phases.json';
import statesData from '@/data/states.json';
import faqsData from '@/data/faqs.json';
import privacyData from '@/data/privacy.json';
import rumoursData from '@/data/rumours.json';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash';

const CIVIC_SYSTEM_INSTRUCTION = `You are Census Saathi (जन गण साथी), an AI-powered multilingual civic companion for India's Census 2027.
YOUR MISSION:
1. Provide accurate, clear, and reassuring guidance to Indian citizens regarding Census 2027.
2. Always respect the user's selected language (e.g. Hindi, Marathi, English) and answer fluently in that language.
3. GROUNDING & SAFETY RULES:
   - Base all answers on official Census of India procedures under the Census Act, 1948.
   - Section 15 of the Census Act guarantees strict confidentiality (individual responses cannot be shared with police, tax authorities, or courts).
   - NEVER invent or hallucinate dates, statutory amendments, or government schedules. If a state schedule is not yet gazetted, state honestly: "The official schedule for this state has not yet been notified by the government."
   - NEVER claim Aadhaar is mandatory for Census participation. It is voluntary.
   - NEVER ask for or record real Aadhaar numbers, bank details, passwords, or personal identity numbers.
   - Participation in Census is free of charge. Warn users against payment scams or OTP requests.
   - Clarify that Census Saathi is an educational/prep companion and that official submission occurs only via official government portals (censusindia.gov.in).
`;

interface AskParams {
  question: string;
  selectedState?: string;
  selectedLanguage?: string;
  currentContext?: string;
}

export async function askCensusSaathi({
  question,
  selectedState = 'Maharashtra',
  selectedLanguage = 'English',
  currentContext = 'general',
}: AskParams): Promise<{ answer: string; source: 'gemini' | 'grounded_rules'; disclaimer: string }> {
  const disclaimer = 'Information provided for civic guidance. Confirm official circulars at censusindia.gov.in.';

  // If Gemini API Key is available, call Gemini API
  if (GEMINI_API_KEY) {
    try {
      const stateObj = statesData.states.find(
        (s) => s.name.toLowerCase() === selectedState.toLowerCase() || s.code === selectedState,
      );

      const promptContext = `
[CURRENT CONTEXT]
- Selected State: ${selectedState} (Status: ${stateObj?.scheduleStatus || 'Pending official notification'})
- Preferred Language: ${selectedLanguage}
- Section: ${currentContext}

[TRUSTED CENSUS KNOWLEDGE]
- Overview: ${censusOverview.whatIsCensus}
- Legal Protection: ${censusOverview.legalFramework.confidentialitySection}
- Phase 1: ${phasesData.phases[0].name} (${phasesData.phases[0].purpose})
- Phase 2: ${phasesData.phases[1].name} (${phasesData.phases[1].purpose})
- Digital Self-Enumeration: ${phasesData.selfEnumerationStep.description}

[CITIZEN QUESTION]
${question}

Please answer clearly and concisely in ${selectedLanguage}. Provide a comforting, authoritative civic tone.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptContext }] }],
            systemInstruction: { parts: [{ text: CIVIC_SYSTEM_INSTRUCTION }] },
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 600,
            },
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return { answer: text.trim(), source: 'gemini', disclaimer };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to grounded knowledge engine:', err);
    }
  }

  // High-precision fallback grounded engine
  const fallbackAnswer = generateFallbackAnswer(question, selectedState, selectedLanguage);
  return { answer: fallbackAnswer, source: 'grounded_rules', disclaimer };
}

function generateFallbackAnswer(question: string, state: string, language: string): string {
  const q = question.toLowerCase();
  const isHindi = language.toLowerCase().includes('hindi') || language.includes('हिन्दी');
  const isMarathi = language.toLowerCase().includes('marathi') || language.includes('मराठी');

  // 1. Aadhaar / ID documents
  if (q.includes('aadhaar') || q.includes('आधार') || q.includes('identity') || q.includes('document')) {
    if (isHindi) {
      return `जनगणना 2027 के लिए आधार कार्ड अनिवार्य (Mandatory) नहीं है। जनगणना एक सांख्यिकीय और जनसांख्यिकीय प्रक्रिया है। प्रगणक (Enumerator) आपसे केवल सामान्य विवरण पूछते हैं और किसी भी मूल दस्तावेज को जमा नहीं करवाते हैं। जनगणना साथी कभी भी आपका आधार नंबर नहीं मांगता।`;
    }
    if (isMarathi) {
      return `जनगणना २०२७ साठी आधार कार्ड सक्तीचे नाही. जनगणना ही केवळ सांख्यिकीय माहिती संकलनासाठी असते. प्रगणक कोणतीही मूळ कागदपत्रे जमा करत नाहीत. जन गण साथी ॲपवरही आधार क्रमांक मागितला जात नाही.`;
    }
    return `Aadhaar is NOT mandatory for Census 2027. The Census of India is a statistical headcount and socio-economic survey. Enumerators record verbal responses and do not confiscate or demand physical identity documents. Census Saathi never asks for Aadhaar.`;
  }

  // 2. Fees / Money / Cost / Payment
  if (q.includes('fee') || q.includes('pay') || q.includes('cost') || q.includes('paisa') || q.includes('रुपये') || q.includes('पैसे') || q.includes('charge')) {
    if (isHindi) {
      return `जनगणना 2027 में भाग लेना 100% निःशुल्क (Free) है। सरकार किसी भी नागरिक से कोई शुल्क या ओटीपी नहीं मांगती है। यदि कोई आपसे पैसे या बैंक विवरण मांगता है, तो वह धोखाधड़ी (Scam) है।`;
    }
    if (isMarathi) {
      return `जनगणनेत सहभागी होणे पूर्णपणे मोफत आहे. सरकार कोणत्याही नागरिकाकडून कोणतेही शुल्क किंवा बँक तपशील मागत नाही. कोणीही पैसे मागितल्यास तो सायबर गुन्हा आहे.`;
    }
    return `Census participation is 100% FREE. The Government of India never charges any citizen for self-enumeration or field visits, and never asks for bank OTPs or processing fees. Any payment demand is fraudulent.`;
  }

  // 3. Phase 1 vs Phase 2
  if (q.includes('phase') || q.includes('चरण') || q.includes('टप्पा') || q.includes('houselisting') || q.includes('population')) {
    if (isHindi) {
      return `जनगणना 2027 दो मुख्य चरणों में आयोजित होगी:\n1. चरण 1 (मकान सूचीकरण): घरों की स्थिति, पेयजल, बिजली, शौचालय और घरेलू सुविधाओं के 31 प्रश्न।\n2. चरण 2 (जनसंख्या गणना): प्रत्येक व्यक्ति की आयु, शिक्षा, भाषा, व्यवसाय और प्रवासन से संबंधित प्रश्न।`;
    }
    if (isMarathi) {
      return `जनगणना २०२७ दोन टप्प्यांत घेतली जाईल:\n१. टप्पा १ (घरयादी व गृहनिर्माण): घराची स्थिती, पाणी, वीज आणि साधनांची माहिती (३१ प्रश्न).\n२. टप्पा २ (लोकसंख्या मोजणी): घरातील व्यक्तींची वय, शिक्षण, भाषा आणि रोजगाराची माहिती.`;
    }
    return `Census 2027 is conducted in two distinct phases:\n• Phase I (Houselisting & Housing): 31 questions assessing dwelling condition, drinking water, lighting, sanitation, cooking fuel, and household assets.\n• Phase II (Population Enumeration): 29 demographic questions on age, education, mother tongue, occupation, and migration.`;
  }

  // 4. Dates / Schedule / When in state
  if (q.includes('date') || q.includes('schedule') || q.includes('when') || q.includes('तारीख') || q.includes('दिनांक') || q.includes('वेळापत्रक') || q.includes('कब')) {
    if (isHindi) {
      return `${state} सहित सभी राज्यों के लिए आधिकारिक समय-सारणी भारत के महापंजीयक (ORGI) द्वारा अधिसूचित होने पर जारी की जाएगी। अभी आधिकारिक तिथियों की प्रतीक्षा है। सत्यापित सूचना के लिए censusindia.gov.in देखें।`;
    }
    if (isMarathi) {
      return `${state} राज्यासाठी अधिकृत वेळापत्रक केंद्र सरकारकडून जाहीर झाल्यानंतर प्रसिद्ध केले जाईल. सध्या अधिकृत तारखांची घोषणा प्रलंबित आहे.`;
    }
    return `The official Census 2027 operational schedule for ${state} will be notified by the Office of the Registrar General of India (ORGI). Official dates are currently awaited in the verified dataset. Always rely on censusindia.gov.in for gazetted dates.`;
  }

  // 5. Self-enumeration / Online portal
  if (q.includes('self') || q.includes('online') || q.includes('portal') || q.includes('app') || q.includes('स्व-गणना') || q.includes('ऑनलाइन')) {
    if (isHindi) {
      return `डिजिटल स्व-गणना (Self-Enumeration) के तहत नागरिक आधिकारिक पोर्टल (censusindia.gov.in) पर मोबाइल नंबर से लॉगिन कर अपने परिवार का विवरण पहले ही भर सकते हैं। फॉर्म जमा करने पर एक पावती संख्या (SEAN) मिलती है, जिसे प्रगणक के आने पर दिखाना होता है।`;
    }
    if (isMarathi) {
      return `डिजिटल स्व-गणनेद्वारे नागरिक अधिकृत संकेतस्थळावर स्वतःच्या कुटुंबाची माहिती आधीच ऑनलाइन नोंदवू शकतात. यामुळे प्रगणक आल्यावर फक्त पोचपावती क्रमांक (SEAN) दाखवून पडताळणी पूर्ण करता येते.`;
    }
    return `Digital Self-Enumeration allows households to complete Census questionnaires online on censusindia.gov.in before field enumerators visit. After submission, a Self-Enumeration Acknowledgment Number (SEAN) is generated, which you share with the visiting enumerator for instant verification.`;
  }

  // 6. Privacy & Section 15 of Census Act
  if (q.includes('privacy') || q.includes('safety') || q.includes('police') || q.includes('court') || q.includes('tax') || q.includes('गोपनीयता') || q.includes('सुरक्षा')) {
    if (isHindi) {
      return `जनगणना अधिनियम, 1948 की धारा 15 के तहत आपके द्वारा दी गई व्यक्तिगत जानकारी पूर्णतः गोपनीय है। इसे किसी भी न्यायालय, पुलिस या आयकर विभाग के साथ साझा नहीं किया जा सकता है। जनगणना डेटा केवल समग्र सांख्यिकी के रूप में प्रकाशित होता है।`;
    }
    if (isMarathi) {
      return `जनगणना कायदा १९४८ मधील कलम १५ नुसार तुमची वैयक्तिक माहिती पूर्णपणे गोपनीय राहते. ती कोणत्याही न्यायालयात किंवा पोलिस खात्याकडे पुरावा म्हणून वापरता येत नाही.`;
    }
    return `Under Section 15 of the Census Act, 1948, your individual census responses are strictly confidential. They cannot be accessed by police, tax authorities, or produced as evidence in court. Census results are published solely as statistical aggregates.`;
  }

  // Match against FAQs
  const matchedFaq = faqsData.faqs.find((f) => q.includes(f.category.toLowerCase()) || f.question.toLowerCase().includes(q));
  if (matchedFaq) {
    return matchedFaq.answer;
  }

  // General helpful response
  if (isHindi) {
    return `नमस्ते! जनगणना 2027 भारत की डिजिटल-प्रथम जनगणना है। मैं आपको इसके दोनों चरणों, राज्य समय-सारणी, स्व-गणना तैयारी और सुरक्षा नियमों को समझने में मदद कर सकता हूँ। कृपया कोई भी गोपनीय व्यक्तिगत डेटा साझा न करें।`;
  }
  if (isMarathi) {
    return `नमस्कार! जनगणना २०२७ बद्दल तुम्हाला पडलेल्या प्रश्नांची उत्तरे देण्यासाठी मी येथे आहे. तुम्ही टप्पे, वेळापत्रक, सुरक्षितता आणि स्व-गणना याबद्दल विचारू शकता.`;
  }
  return `Census 2027 is India's upcoming digital-first national enumeration. I can explain the two phases, digital self-enumeration, historical data trends, privacy protections under the Census Act 1948, and how to stay safe from scams. How can I assist your household today?`;
}

export interface FactCheckResult {
  status: 'verified' | 'misleading' | 'false' | 'unable_to_verify';
  confidence: 'high' | 'medium' | 'low';
  threatLevel?: 'critical' | 'high' | 'medium' | 'low';
  summary: string;
  explanation: string;
  recommendedAction: string;
  sources: string[];
}

export async function factCheckClaim(claim: string, language = 'English'): Promise<FactCheckResult> {
  const c = claim.toLowerCase().trim();

  // Check known curated rumours first for instant high-confidence verification
  for (const r of rumoursData.rumours) {
    const matchCount = r.keywords.filter((kw) => c.includes(kw.toLowerCase())).length;
    if (matchCount >= 2 || c.includes(r.claim.toLowerCase().slice(0, 30))) {
      return {
        status: r.status as FactCheckResult['status'],
        confidence: r.confidence as FactCheckResult['confidence'],
        threatLevel: r.threatLevel as FactCheckResult['threatLevel'],
        summary: r.summary,
        explanation: r.explanation,
        recommendedAction: r.recommendedAction,
        sources: r.sources,
      };
    }
  }

  // If Gemini API Key is available, run Gemini Fact-Check Reasoning
  if (GEMINI_API_KEY) {
    try {
      const factCheckPrompt = `
Analyze the following claim regarding India's Census 2027 against verified statutory rules (Census Act 1948, ORGI guidelines, PIB alerts).
CLAIM TO VERIFY: "${claim}"

Respond with ONLY valid JSON strictly matching this TypeScript structure:
{
  "status": "verified" | "misleading" | "false" | "unable_to_verify",
  "confidence": "high" | "medium" | "low",
  "threatLevel": "critical" | "high" | "medium" | "low",
  "summary": "Short 1-sentence verdict",
  "explanation": "Detailed explanation of why it is true, false, or misleading in simple citizen language",
  "recommendedAction": "What the citizen should do (e.g. Do not share OTP, verify at censusindia.gov.in)",
  "sources": ["List of official sources"]
}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: factCheckPrompt }] }],
            systemInstruction: { parts: [{ text: CIVIC_SYSTEM_INSTRUCTION }] },
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json',
            },
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Gemini fact-check failed, applying rule-based check:', err);
    }
  }

  // Heuristic rule analysis if no direct rumour matched and no LLM available
  if (c.includes('otp') || c.includes('password') || c.includes('cvv') || c.includes('pin') || c.includes('pay') || c.includes('charge') || c.includes('fee')) {
    return {
      status: 'false',
      confidence: 'high',
      threatLevel: 'critical',
      summary: 'HIGH RISK — Dangerous Scam or Phishing Indicator.',
      explanation: 'Census participation is 100% free of charge. No legitimate Census process ever asks for bank passwords, OTPs, UPI PINs, or processing fees.',
      recommendedAction: 'Do not click links, do not share OTPs, and immediately report such incidents to the National Cyber Crime Portal (cybercrime.gov.in).',
      sources: ['Ministry of Home Affairs Public Advisory', 'PIB Fact Check Unit'],
    };
  }

  if (c.includes('aadhaar') && (c.includes('mandatory') || c.includes('compulsory') || c.includes('must'))) {
    return {
      status: 'false',
      confidence: 'high',
      threatLevel: 'medium',
      summary: 'FALSE — Aadhaar is NOT legally mandatory for Census.',
      explanation: 'Providing Aadhaar for Census 2027 is voluntary. Enumerators cannot refuse enumeration or demand physical surrender of documents.',
      recommendedAction: 'You may participate fully without providing Aadhaar.',
      sources: ['The Census Act, 1948', 'ORGI Circular on Identity Verification'],
    };
  }

  // If evidence is insufficient, honestly return unable_to_verify rather than hallucinating
  return {
    status: 'unable_to_verify',
    confidence: 'low',
    threatLevel: 'low',
    summary: 'UNABLE TO VERIFY with current verified government datasets.',
    explanation: 'We could not cross-reference this specific claim with gazetted Census of India notifications or official circulars. Please do not forward unverified claims.',
    recommendedAction: 'Check the official portal at censusindia.gov.in or contact the ORGI helpdesk before acting.',
    sources: ['Office of the Registrar General & Census Commissioner, India (censusindia.gov.in)'],
  };
}

export interface ChartExplainParams {
  metric: string;
  state?: string;
  years?: string[];
  values?: Record<string, unknown>;
  language?: string;
}

export async function explainChartData({
  metric,
  state = 'All India',
  years = ['1951', '2011'],
  values = {},
  language = 'English',
}: ChartExplainParams): Promise<{ explanation: string; keyObservations: string[] }> {
  // If Gemini API Key is available
  if (GEMINI_API_KEY) {
    try {
      const prompt = `
Explain the demographic chart for "${metric}" (${state}) covering years ${years.join(', ')}.
Data values: ${JSON.stringify(values)}
Language: ${language}

Provide:
1. Clear, simple explanation of the trend (separate objective observations from speculative causation).
2. Exactly 3 key bullet points highlighting significant demographic shifts.
Respond in ${language}.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: CIVIC_SYSTEM_INSTRUCTION }] },
            generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            explanation: text.trim(),
            keyObservations: [
              `Long-term progression observed across national Census rounds from ${years[0]} to ${years[years.length - 1]}.`,
              `Rural and urban disparities narrow over time while absolute headcount expanded steadily.`,
              `Official Census data provides essential benchmarks for infrastructure planning and civic resource distribution.`,
            ],
          };
        }
      }
    } catch (err) {
      console.warn('Gemini chart explanation failed, using grounded explanation:', err);
    }
  }

  // Grounded rule-based chart explanation
  const m = metric.toLowerCase();
  if (m.includes('population')) {
    return {
      explanation: `India's population grew from 361.1 million in 1951 to 1,210.9 million (1.21 Billion) in 2011. While the absolute population increased in every decadal Census, the decadal growth rate peaked during 1971–1981 (24.8%) and demonstrated a clear deceleration to 17.7% in the 2001–2011 decade, indicating demographic transition.`,
      keyObservations: [
        'Total population increased by over 3.3x between 1951 and 2011.',
        'Decadal growth rate slowed significantly from 21.5% (1991-2001) to 17.7% (2001-2011).',
        'Population density increased from 117 persons/km² in 1951 to 382 persons/km² in 2011.',
      ],
    };
  }

  if (m.includes('literacy')) {
    return {
      explanation: `National literacy in India rose from 18.3% in 1951 to 74.0% in 2011. Female literacy showed a significant upward acceleration, rising from 8.9% in 1951 to 65.5% in 2011, substantially narrowing the male-female literacy gap from 24.8 percentage points in 1991 to 16.6 percentage points in 2011.`,
      keyObservations: [
        'Overall literacy grew more than fourfold from 18.3% (1951) to 74.0% (2011).',
        'Female literacy climbed from 8.9% in 1951 to 65.5% in 2011.',
        'Urban literacy reached 84.1% compared to 67.8% in rural areas in Census 2011.',
      ],
    };
  }

  return {
    explanation: `This historical Census dataset highlights the demographic and socio-economic evolution of India over six decades. Census aggregates provide the baseline empirical foundation for public policy, electoral representation, and welfare distribution across States and Union Territories.`,
    keyObservations: [
      `Data reflects verified historical figures from the Office of the Registrar General of India.`,
      `Comparisons between completed Census rounds (1951–2011) show steady civic transformation.`,
      `Upcoming Census 2027 will incorporate digital self-enumeration to modernize national data collection.`,
    ],
  };
}
