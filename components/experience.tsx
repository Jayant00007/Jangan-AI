'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  CheckCircle2,
  CircleCheck,
  ExternalLink,
  Home as HomeIcon,
  Languages,
  Lightbulb,
  LockKeyhole,
  MapPin,
  Menu,
  RefreshCw,
  Search,
  SearchCheck,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import statesData from '@/data/states.json';
import phasesData from '@/data/phases.json';
import faqsData from '@/data/faqs.json';
import privacyData from '@/data/privacy.json';
import historicalData from '@/data/historical-data.json';
import translationsData from '@/data/translations.json';
import { languageList } from '@/components/landing';

export function Experience({ startEntered = false }: { startEntered?: boolean }) {
  // State and Language preferences
  const [state, setState] = useState('Maharashtra');
  const [language, setLanguage] = useState('English');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Copilot Chat State
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: 'user' | 'assistant'; text: string; source?: string; piiRedacted?: boolean }>
  >([
    {
      role: 'assistant',
      text: 'Namaste! I am Census Saathi, your AI companion for Census 2027. I can explain the two phases, digital self-enumeration, historical data trends, privacy protections under the Census Act 1948, or help verify suspicious messages. How can I help you today?',
      source: 'system',
    },
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Fact Checker State
  const [factClaim, setFactClaim] = useState('');
  const [factLoading, setFactLoading] = useState(false);
  const [factResult, setFactResult] = useState<{
    status: 'verified' | 'misleading' | 'false' | 'unable_to_verify';
    confidence: 'high' | 'medium' | 'low';
    threatLevel?: 'critical' | 'high' | 'medium' | 'low';
    summary: string;
    explanation: string;
    recommendedAction: string;
    sources: string[];
    piiRedacted?: boolean;
  } | null>(null);

  // Data Explorer & AI Chart Explanation State
  const [chartMode, setChartMode] = useState<'population' | 'literacy' | 'rural_urban' | 'state_matrix'>('population');
  const [chartExplaining, setChartExplaining] = useState(false);
  const [chartExplanation, setChartExplanation] = useState<{
    explanation: string;
    keyObservations: string[];
  } | null>(null);

  // Self-Enumeration Simulator State (5 Steps)
  const [simStep, setSimStep] = useState(0);
  const [simData, setSimData] = useState({
    dwellingType: 'Pucca House (Concrete)',
    ownership: 'Owned',
    drinkingWater: 'Piped Tap Water within premises',
    lighting: 'Electricity',
    latrineAccess: 'Flush Latrine connected to sewer',
    cookingFuel: 'LPG / PNG Connection',
    householdMembers: '4 Members (Fictional Patil Family)',
    headName: 'Suresh Patil (DEMO ONLY)',
    headEducation: 'Graduate & Above',
    headOccupation: 'Services / Private Employment',
  });
  const [simAckCode, setSimAckCode] = useState('');
  const [simSubmitted, setSimSubmitted] = useState(false);

  // FAQ Search & Filter State
  const [faqCategory, setFaqCategory] = useState('All');
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq1');

  // Load preferences from session / local storage
  useEffect(() => {
    try {
      const savedState = sessionStorage.getItem('census-saathi-state') || localStorage.getItem('census-saathi-state');
      const savedLang = sessionStorage.getItem('census-saathi-language') || localStorage.getItem('census-saathi-language');
      if (savedState && statesData.states.some((s) => s.name === savedState)) {
        setState(savedState);
      }
      if (savedLang && languageList.some((l) => l.name === savedLang || l.native === savedLang)) {
        setLanguage(savedLang);
      }
    } catch {
      // safe fallback
    }
  }, [startEntered]);

  // Selected State Details
  const currentStateObj = useMemo(() => {
    return statesData.states.find((s) => s.name === state) || statesData.states[0];
  }, [state]);

  // Multilingual localization key
  const langKey = useMemo(() => {
    const l = language.toLowerCase();
    if (l.includes('hindi') || l.includes('हिन्दी')) return 'hi';
    if (l.includes('marathi') || l.includes('मराठी')) return 'mr';
    return 'en';
  }, [language]);

  const t = translationsData[langKey] || translationsData.en;

  // Localized Greetings
  const localizedGreeting = useMemo(() => {
    const l = language.toLowerCase();
    if (l.includes('hindi') || l.includes('हिन्दी')) return 'नमस्ते';
    if (l.includes('marathi') || l.includes('मराठी')) return 'नमस्कार';
    if (l.includes('bengali') || l.includes('বাংলা')) return 'নমস্কার';
    if (l.includes('tamil') || l.includes('தமிழ்')) return 'வணக்கம்';
    if (l.includes('telugu') || l.includes('తెలుగు')) return 'నమస్కారం';
    if (l.includes('gujarati') || l.includes('ગુજરાતી')) return 'નમસ્તે';
    if (l.includes('kannada') || l.includes('ಕನ್ನಡ')) return 'ನಮಸ್ಕಾರ';
    if (l.includes('malayalam') || l.includes('മലയാളം')) return 'നമസ്കാരം';
    if (l.includes('punjabi') || l.includes('ਪੰਜਾਬੀ')) return 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ';
    if (l.includes('odia') || l.includes('ଓଡ଼ିଆ')) return 'ନମସ୍କାର';
    if (l.includes('assamese') || l.includes('অসমীয়া')) return 'নমস্কাৰ';
    if (l.includes('urdu') || l.includes('اردو')) return 'آداب';
    return 'Namaste';
  }, [language]);

  // Save State and Language Changes
  const updateState = (newState: string) => {
    setState(newState);
    try {
      sessionStorage.setItem('census-saathi-state', newState);
      localStorage.setItem('census-saathi-state', newState);
    } catch {
      // safe fallback
    }
  };

  const updateLanguage = (newLang: string) => {
    setLanguage(newLang);
    try {
      sessionStorage.setItem('census-saathi-language', newLang);
      localStorage.setItem('census-saathi-language', newLang);
    } catch {
      // safe fallback
    }
  };

  // AI Copilot Ask Action
  const handleAskAi = async (overrideQuestion?: string) => {
    const query = (overrideQuestion || aiInput).trim();
    if (!query || aiLoading) return;

    setChatMessages((prev) => [...prev, { role: 'user', text: query }]);
    setAiInput('');
    setAiLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          selectedState: state,
          selectedLanguage: language,
          currentContext: 'dashboard',
        }),
      });

      const data = await res.json();
      if (res.ok && data.answer) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.answer,
            source: data.source,
            piiRedacted: data.piiRedacted,
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text:
              data.fallbackAnswer ||
              'Census 2027 is conducted under the Census Act 1948. For official updates, please visit censusindia.gov.in.',
            source: 'fallback',
          },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            'A temporary network issue occurred. Please check your internet connection or verify directly at censusindia.gov.in.',
          source: 'error',
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Fact Checker Action
  const handleFactCheck = async (claimToVerify?: string) => {
    const claim = (claimToVerify || factClaim).trim();
    if (!claim || factLoading) return;

    if (claimToVerify) {
      setFactClaim(claimToVerify);
    }

    setFactLoading(true);
    setFactResult(null);

    try {
      const res = await fetch('/api/fact-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claim,
          selectedLanguage: language,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFactResult(data);
      } else {
        setFactResult({
          status: 'unable_to_verify',
          confidence: 'low',
          threatLevel: 'low',
          summary: 'Unable to verify at this moment.',
          explanation: 'Verification service encountered an error. Please verify notifications at censusindia.gov.in.',
          recommendedAction: 'Do not share unverified messages on social media.',
          sources: ['censusindia.gov.in'],
        });
      }
    } catch {
      setFactResult({
        status: 'unable_to_verify',
        confidence: 'low',
        threatLevel: 'low',
        summary: 'Connection error during fact check.',
        explanation: 'Could not connect to the verification API.',
        recommendedAction: 'Always verify claims on official government domains.',
        sources: ['censusindia.gov.in'],
      });
    } finally {
      setFactLoading(false);
    }
  };

  // AI Chart Explanation Action
  const handleExplainChart = async () => {
    setChartExplaining(true);
    setChartExplanation(null);

    let metricName = 'Population Growth 1951-2011';
    let valuesObj: Record<string, unknown> = {};

    if (chartMode === 'population') {
      metricName = 'National Population & Decadal Growth Trend';
      valuesObj = { trends: historicalData.nationalTrends };
    } else if (chartMode === 'literacy') {
      metricName = 'Literacy Rate by Gender (1951-2011)';
      valuesObj = { literacyData: historicalData.nationalTrends.map((d) => ({ year: d.year, overall: d.literacy, male: d.maleLiteracy, female: d.femaleLiteracy })) };
    } else if (chartMode === 'rural_urban') {
      metricName = 'Rural vs Urban Key Demographic Indicators (2011)';
      valuesObj = { indicators: historicalData.indicators };
    } else {
      metricName = 'Top States by Literacy, Sex Ratio and Urbanization';
      valuesObj = historicalData.topStatesByMetric;
    }

    try {
      const res = await fetch('/api/explain-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: metricName,
          state: state,
          years: ['1951', '1981', '2011'],
          values: valuesObj,
          language: language,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setChartExplanation({
          explanation: data.explanation,
          keyObservations: data.keyObservations || [],
        });
      }
    } catch {
      setChartExplanation({
        explanation: 'Historical Census figures illustrate the demographic transformation of India across six decades from 1951 to 2011.',
        keyObservations: ['Decadal data provides baseline aggregates for national planning.'],
      });
    } finally {
      setChartExplaining(false);
    }
  };

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqsData.faqs.filter((faq) => {
      const matchesCategory = faqCategory === 'All' || faq.category === faqCategory;
      const matchesSearch =
        !faqSearch ||
        faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqCategory, faqSearch]);

  // Simulator Submit Handler
  const handleSimSubmit = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `DEMO-2027-${currentStateObj.code}-${randomSuffix}`;
    setSimAckCode(code);
    setSimSubmitted(true);
  };

  return (
    <div id="top" className="min-h-screen bg-[#f7f7f1] text-[#102a26] antialiased">
      {/* ========================================================
          STICKY CIVIC HEADER & NAVIGATION
      ======================================================== */}
      <header className="sticky top-0 z-40 border-b border-emerald-950/10 bg-[#f7f7f1]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-10">
          {/* Logo & Civic Branding */}
          <div className="flex items-center gap-3">
            <a href="#journey" className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-emerald-900 text-white shadow-md">
                <span className="text-base font-bold tracking-tight">जन</span>
              </div>
              <div>
                <span className="block text-lg font-bold tracking-tight text-emerald-950">
                  Census Saathi
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-orange-700">
                  जन गण साथी • Census 2027
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 xl:flex">
            <a href="#journey" className="transition hover:text-emerald-900">
              {t.navJourney}
            </a>
            <a href="#understand" className="transition hover:text-emerald-900">
              {t.navUnderstand}
            </a>
            <a href="#timeline" className="transition hover:text-emerald-900">
              {t.navTimeline}
            </a>
            <a href="#prepare" className="transition hover:text-emerald-900">
              {t.navPrepare}
            </a>
            <a href="#explore" className="transition hover:text-emerald-900">
              {t.navExplore}
            </a>
            <a href="#factcheck" className="transition hover:text-emerald-900">
              {t.navFactCheck}
            </a>
            <a href="#safety" className="transition hover:text-emerald-900">
              {t.navSafety}
            </a>
            <a href="#faqs" className="transition hover:text-emerald-900">
              {t.navFaqs}
            </a>
          </nav>

          {/* Top Controls: Language + State Switchers + Ask AI */}
          <div className="flex items-center gap-2.5">
            {/* Quick Language Dropdown */}
            <div className="relative hidden items-center sm:flex">
              <label htmlFor="top-lang-select" className="sr-only">
                {t.languageLabel}
              </label>
              <div className="flex items-center gap-1.5 rounded-xl border border-emerald-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-950 shadow-sm">
                <Languages className="size-3.5 text-emerald-700" />
                <select
                  id="top-lang-select"
                  aria-label={t.languageLabel}
                  value={language}
                  onChange={(e) => updateLanguage(e.target.value)}
                  className="cursor-pointer bg-transparent font-semibold outline-none"
                >
                  {languageList.map((l) => (
                    <option key={l.code} value={l.name}>
                      {l.native}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick State Dropdown */}
            <div className="relative hidden items-center md:flex">
              <label htmlFor="top-state-select" className="sr-only">
                {t.stateLabel}
              </label>
              <div className="flex items-center gap-1.5 rounded-xl border border-emerald-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-950 shadow-sm">
                <MapPin className="size-3.5 text-emerald-700" />
                <select
                  id="top-state-select"
                  aria-label={t.stateLabel}
                  value={state}
                  onChange={(e) => updateState(e.target.value)}
                  className="max-w-[130px] cursor-pointer truncate bg-transparent font-semibold outline-none"
                >
                  {statesData.states.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Primary Ask AI Trigger Button */}
            <button
              onClick={() => setAiOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-bold text-emerald-950 shadow-md transition-all hover:bg-orange-400 hover:shadow-lg sm:px-4"
            >
              <Sparkles className="size-4" />
              <span>{t.askAiButton}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              aria-label="Toggle Navigation Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 xl:hidden"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-t bg-white p-5 shadow-xl xl:hidden">
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500">{t.languageLabel}</label>
                <select
                  value={language}
                  onChange={(e) => {
                    updateLanguage(e.target.value);
                  }}
                  className="mt-1 w-full rounded-lg border p-2 text-xs font-semibold"
                >
                  {languageList.map((l) => (
                    <option key={l.code} value={l.name}>
                      {l.native}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500">{t.stateLabel}</label>
                <select
                  value={state}
                  onChange={(e) => {
                    updateState(e.target.value);
                  }}
                  className="mt-1 w-full rounded-lg border p-2 text-xs font-semibold"
                >
                  {statesData.states.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2 border-t pt-3 text-sm font-semibold text-slate-800">
              <a onClick={() => setMobileMenuOpen(false)} href="#journey" className="rounded-lg p-2 hover:bg-emerald-50">
                {t.navJourney}
              </a>
              <a onClick={() => setMobileMenuOpen(false)} href="#understand" className="rounded-lg p-2 hover:bg-emerald-50">
                {t.navUnderstand}
              </a>
              <a onClick={() => setMobileMenuOpen(false)} href="#timeline" className="rounded-lg p-2 hover:bg-emerald-50">
                {t.navTimeline}
              </a>
              <a onClick={() => setMobileMenuOpen(false)} href="#prepare" className="rounded-lg p-2 hover:bg-emerald-50">
                {t.navPrepare}
              </a>
              <a onClick={() => setMobileMenuOpen(false)} href="#explore" className="rounded-lg p-2 hover:bg-emerald-50">
                {t.navExplore}
              </a>
              <a onClick={() => setMobileMenuOpen(false)} href="#factcheck" className="rounded-lg p-2 hover:bg-emerald-50">
                {t.navFactCheck}
              </a>
              <a onClick={() => setMobileMenuOpen(false)} href="#safety" className="rounded-lg p-2 hover:bg-emerald-50">
                {t.navSafety}
              </a>
              <a onClick={() => setMobileMenuOpen(false)} href="#faqs" className="rounded-lg p-2 hover:bg-emerald-50">
                {t.navFaqs}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          SECTION 1: PERSONALIZED CITIZEN JOURNEY & TIMELINE
      ======================================================== */}
      <section id="journey" className="mx-auto max-w-7xl px-5 pb-16 pt-10 md:px-10 md:pt-14">
        {/* Personalized Welcome Banner */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-950/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-900">
              <MapPin className="size-3.5 text-emerald-700" />
              <span>
                {t.navJourney} • {state}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-5xl md:text-6xl">
              {localizedGreeting}, {state}.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Here is everything you need to know about Census 2027 in {state}—personalized, verified, and completely secure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                window.location.assign('/');
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-950 shadow-sm transition hover:bg-emerald-50"
            >
              <Languages className="size-4 text-emerald-700" />
              <span>{t.changeLocation}</span>
            </button>
          </div>
        </div>

        {/* State Demographic Stats Bar */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">2011 Population</span>
            <strong className="mt-1 block text-2xl font-extrabold text-emerald-950">
              {currentStateObj.population2011}
            </strong>
          </div>
          <div className="rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Literacy Rate</span>
            <strong className="mt-1 block text-2xl font-extrabold text-emerald-950">
              {currentStateObj.literacy2011}
            </strong>
          </div>
          <div className="rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sex Ratio (F/1000M)</span>
            <strong className="mt-1 block text-2xl font-extrabold text-orange-600">
              {currentStateObj.sexRatio2011}
            </strong>
          </div>
          <div className="rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Urban Share</span>
            <strong className="mt-1 block text-2xl font-extrabold text-emerald-950">
              {currentStateObj.urbanShare2011}
            </strong>
          </div>
        </div>

        {/* Prominent Journey Timeline Card */}
        <div className="mt-8 rounded-[2rem] bg-emerald-950 p-6 text-white shadow-2xl md:p-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="inline-block size-3 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                YOUR CENSUS 2027 JOURNEY
              </span>
            </div>
            <span className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-emerald-200">
              Honest status: Gazette schedule awaited
            </span>
          </div>

          <h2 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Learn now. Practice calmly. Complete the official count when announced.
          </h2>

          {/* 5-Step Visual Timeline */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {statesData.timelineStages.map((st, idx) => (
              <div
                key={st.id}
                className={
                  'rounded-2xl border p-4 transition-all ' +
                  (idx === 0
                    ? 'border-orange-400 bg-white/15'
                    : 'border-white/10 bg-white/5 opacity-80')
                }
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-orange-400">STAGE {st.stageNumber}</span>
                  {idx === 0 ? (
                    <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] text-emerald-950">
                      CURRENT
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-300/80">UPCOMING</span>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-bold text-white">{st.name}</h3>
                <p className="mt-2 text-xs leading-5 text-emerald-200/90">{st.description}</p>
                <div className="mt-4 border-t border-white/10 pt-3 text-[11px] font-medium text-orange-200">
                  <strong>Action:</strong> {st.action}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="#prepare"
              className="flex items-center justify-between rounded-xl bg-white/10 p-3.5 text-xs font-bold text-white transition hover:bg-orange-500 hover:text-emerald-950"
            >
              <span>1. Prepare for Self-Enumeration</span>
              <ArrowRight className="size-4" />
            </a>
            <button
              onClick={() => setAiOpen(true)}
              className="flex items-center justify-between rounded-xl bg-white/10 p-3.5 text-xs font-bold text-white transition hover:bg-orange-500 hover:text-emerald-950"
            >
              <span>2. Ask Census AI a Question</span>
              <Sparkles className="size-4" />
            </button>
            <a
              href="#factcheck"
              className="flex items-center justify-between rounded-xl bg-white/10 p-3.5 text-xs font-bold text-white transition hover:bg-orange-500 hover:text-emerald-950"
            >
              <span>3. Check a WhatsApp Rumour</span>
              <ShieldAlert className="size-4" />
            </a>
            <a
              href="#explore"
              className="flex items-center justify-between rounded-xl bg-white/10 p-3.5 text-xs font-bold text-white transition hover:bg-orange-500 hover:text-emerald-950"
            >
              <span>4. Explore Historical Data</span>
              <BarChart3 className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: UNDERSTAND CENSUS 2027 & THE TWO PHASES
      ======================================================== */}
      <section id="understand" className="border-y border-emerald-950/10 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="section-heading">
            <div>
              <p className="kicker">CENSUS 2027 SIMPLIFIED</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl md:text-5xl">
                Two Distinct Phases. One Complete Picture of India.
              </h2>
            </div>
            <p className="text-slate-600">
              The Census of India is not just a headcount—it builds a vital portrait of housing conditions, amenities, literacy, languages, and economic livelihood.
            </p>
          </div>

          {/* Detailed Phase 1 vs Phase 2 Comparison Cards */}
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {/* Phase 1 Card */}
            <div className="flex flex-col justify-between rounded-[2rem] border border-emerald-950/10 bg-[#f7f7f1] p-8 shadow-sm">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-emerald-900 text-white">
                    <HomeIcon className="size-6" />
                  </span>
                  <span className="rounded-full bg-emerald-900/10 px-3 py-1 text-xs font-bold text-emerald-900">
                    PHASE 01 • 31 QUESTIONS
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-bold tracking-tight text-emerald-950">
                  {phasesData.phases[0].name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {phasesData.phases[0].purpose}
                </p>

                <div className="mt-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Key Parameters Collected:
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {phasesData.phases[0].keyFocus.map((param) => (
                      <span
                        key={param}
                        className="rounded-xl border border-emerald-950/10 bg-white px-3 py-1.5 text-xs font-medium text-emerald-900"
                      >
                        {param}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-emerald-950/10 pt-5">
                <button
                  onClick={() => {
                    setAiOpen(true);
                    handleAskAi('Explain Phase 1 (Houselisting & Housing Census) in simple terms.');
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-900 transition hover:text-orange-600"
                >
                  <Sparkles className="size-3.5 text-orange-600" />
                  <span>Explain Phase I Simply with AI →</span>
                </button>
              </div>
            </div>

            {/* Phase 2 Card */}
            <div className="flex flex-col justify-between rounded-[2rem] border border-orange-200 bg-orange-50/50 p-8 shadow-sm">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-orange-600 text-white">
                    <Users className="size-6" />
                  </span>
                  <span className="rounded-full bg-orange-200 px-3 py-1 text-xs font-bold text-orange-900">
                    PHASE 02 • 29 QUESTIONS
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-bold tracking-tight text-emerald-950">
                  {phasesData.phases[1].name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {phasesData.phases[1].purpose}
                </p>

                <div className="mt-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Key Parameters Collected:
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {phasesData.phases[1].keyFocus.map((param) => (
                      <span
                        key={param}
                        className="rounded-xl border border-orange-200 bg-white px-3 py-1.5 text-xs font-medium text-orange-950"
                      >
                        {param}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-orange-200/80 pt-5">
                <button
                  onClick={() => {
                    setAiOpen(true);
                    handleAskAi('Explain Phase 2 (Population Enumeration) in simple terms.');
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-900 transition hover:text-orange-600"
                >
                  <Sparkles className="size-3.5 text-orange-600" />
                  <span>Explain Phase II Simply with AI →</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 15 Confidentiality Charter Highlight */}
          <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-start gap-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-800 text-white">
                <LockKeyhole className="size-5" />
              </div>
              <div>
                <strong className="text-sm font-bold text-emerald-950">
                  Statutory Privacy Guarantee (Section 15, The Census Act 1948)
                </strong>
                <p className="mt-1 text-xs leading-5 text-slate-700">
                  {privacyData.censusActProtections.section15}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: MY CENSUS TIMELINE & STATE SCHEDULE
      ======================================================== */}
      <section id="timeline" className="mx-auto max-w-7xl px-5 py-20 md:px-10">
        <div className="section-heading">
          <div>
            <p className="kicker">MY CENSUS TIMELINE</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
              State-Specific Schedule for {state}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Switch State:</label>
            <select
              aria-label="Switch State Schedule"
              value={state}
              onChange={(e) => updateState(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-950 shadow-sm"
            >
              {statesData.states.map((s) => (
                <option key={s.code} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Timeline Stages Grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statesData.timelineStages.map((st, i) => (
            <div key={st.id} className="rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-900/10 px-2.5 py-1 text-xs font-bold text-emerald-900">
                  STAGE {st.stageNumber}
                </span>
                <span
                  className={
                    'rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ' +
                    (i === 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600')
                  }
                >
                  {i === 0 ? 'ACTIVE' : 'SCHEDULE PENDING'}
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-emerald-950">{st.name}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">{st.description}</p>
              <div className="mt-4 rounded-xl bg-[#f7f7f1] p-3 text-xs text-slate-700">
                <strong className="text-orange-700">Citizen Step:</strong> {st.action}
              </div>
            </div>
          ))}
        </div>

        {/* Honest Non-Hallucination Disclaimer */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
          <strong className="text-slate-900">Schedule Notice:</strong> Official state-wise enumeration calendar is published via the Gazette of India by the Office of the Registrar General & Census Commissioner, India (ORGI). Census Saathi strictly presents verified data and never fabricates speculative dates.
        </div>
      </section>

      {/* ========================================================
          SECTION 4: SELF-ENUMERATION PREPARATION GUIDE (5-STEP LAB)
      ======================================================== */}
      <section id="prepare" className="border-y border-emerald-950/10 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="section-heading">
            <div>
              <p className="kicker">INTERACTIVE PREPARATION LAB</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
                {t.simulatorTitle}
              </h2>
            </div>
            <p className="text-slate-600">{t.simulatorSubtitle}</p>
          </div>

          {/* Simulator Box */}
          <div className="mt-10 grid overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-[#f7f7f1] shadow-lg lg:grid-cols-[.35fr_.65fr]">
            {/* Left Step Navigator */}
            <div className="bg-emerald-950 p-6 text-white md:p-8">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                5-STEP PREPARATION FLOW
              </span>

              <div className="mt-6 space-y-4">
                {[
                  '1. Dwelling & Building Type',
                  '2. Household Amenities & Fuel',
                  '3. Member Roster (Mock Demo)',
                  '4. Socioeconomic Questions',
                  '5. Consent & Demo Submission',
                ].map((stepLabel, idx) => (
                  <button
                    key={stepLabel}
                    onClick={() => setSimStep(idx)}
                    className={
                      'flex w-full items-center gap-3 rounded-xl p-3 text-left text-xs font-semibold transition ' +
                      (simStep === idx
                        ? 'bg-orange-500 text-emerald-950 shadow-md'
                        : simStep > idx
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:text-white')
                    }
                  >
                    <span className="grid size-6 place-items-center rounded-full border border-current text-[11px]">
                      {simStep > idx ? <Check className="size-3.5" /> : idx + 1}
                    </span>
                    <span>{stepLabel}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-white/10 p-4 text-xs leading-5 text-emerald-100">
                <LockKeyhole className="mb-1.5 size-4 text-orange-400" />
                <strong>Practice Mode:</strong> All data is fictional. No answers leave your browser. Do not type real Aadhaar or real identity numbers.
              </div>
            </div>

            {/* Right Interactive Form Area */}
            <div className="p-6 md:p-10">
              {/* Step 1: Dwelling & Housing */}
              {simStep === 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
                    STEP 1 OF 5 • HOUSELISTING
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-emerald-950">
                    What is the type and ownership of this fictional dwelling?
                  </h3>
                  <p className="mt-2 text-xs text-slate-600">
                    In Phase I, enumerators ask about house structure material and ownership.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500">Dwelling Structure</label>
                      <select
                        value={simData.dwellingType}
                        onChange={(e) => setSimData({ ...simData, dwellingType: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-800"
                      >
                        <option>Pucca House (Concrete / Brick)</option>
                        <option>Semi-Pucca (Tiles / Asbestos)</option>
                        <option>Kutcha (Thatch / Mud)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500">Ownership Status</label>
                      <select
                        value={simData.ownership}
                        onChange={(e) => setSimData({ ...simData, ownership: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-800"
                      >
                        <option>Owned</option>
                        <option>Rented</option>
                        <option>Any Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between rounded-xl bg-orange-50 p-3 text-xs text-orange-950">
                    <span className="flex items-center gap-2">
                      <Lightbulb className="size-4 text-orange-600" />
                      Tip: Phase I helps calculate housing shortage and electrification metrics.
                    </span>
                    <button
                      onClick={() => {
                        setAiOpen(true);
                        handleAskAi('Why does Census collect dwelling condition and ownership status?');
                      }}
                      className="font-bold underline"
                    >
                      Explain this with AI
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Household Amenities */}
              {simStep === 1 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
                    STEP 2 OF 5 • HOUSEHOLD AMENITIES
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-emerald-950">
                    What facilities does the household have access to?
                  </h3>
                  <p className="mt-2 text-xs text-slate-600">
                    Questions on clean drinking water, sanitation, and cooking fuel help target public schemes.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500">Drinking Water Source</label>
                      <select
                        value={simData.drinkingWater}
                        onChange={(e) => setSimData({ ...simData, drinkingWater: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-800"
                      >
                        <option>Piped Tap Water within premises</option>
                        <option>Covered Well / Tube-well</option>
                        <option>Hand Pump</option>
                        <option>Public Tap / Standpost</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500">Cooking Fuel</label>
                      <select
                        value={simData.cookingFuel}
                        onChange={(e) => setSimData({ ...simData, cookingFuel: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-800"
                      >
                        <option>LPG / PNG Connection</option>
                        <option>Electricity</option>
                        <option>Biogas</option>
                        <option>Firewood / Biomass</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Member Roster (Mock) */}
              {simStep === 2 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
                    STEP 3 OF 5 • POPULATION ROSTER (DEMO ONLY)
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-emerald-950">
                    Sample Member Information
                  </h3>
                  <p className="mt-2 text-xs text-slate-600">
                    In Phase II, basic demographic facts of each usual resident are recorded.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-emerald-900/15 bg-white p-4">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                        <span>Head of Fictional Household</span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800">
                          SAMPLE MEMBER 1
                        </span>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500">Sample Name</label>
                          <input
                            disabled
                            value="Suresh Patil (Fictional Example)"
                            className="mt-1 w-full rounded-lg bg-slate-100 p-2 text-xs font-semibold text-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-500">Identity Verification Note</label>
                          <input
                            disabled
                            value="XXXX XXXX 4281 (DEMO ONLY — NEVER ENTER REAL AADHAAR)"
                            className="mt-1 w-full rounded-lg bg-orange-50 p-2 text-xs font-bold text-orange-800"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-3 text-xs text-slate-600">
                      <strong>Fictional Household Members:</strong> Sunita Patil (Spouse, 42), Rohan Patil (Son, 18), Ananya Patil (Daughter, 14).
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Socioeconomic Questions */}
              {simStep === 3 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
                    STEP 4 OF 5 • SOCIOECONOMIC PARAMETERS
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-emerald-950">
                    Education & Economic Activity
                  </h3>
                  <p className="mt-2 text-xs text-slate-600">
                    Census records literacy level, mother tongue, and worker categorization.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500">Highest Education Attained</label>
                      <select
                        value={simData.headEducation}
                        onChange={(e) => setSimData({ ...simData, headEducation: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-800"
                      >
                        <option>Graduate & Above</option>
                        <option>Higher Secondary (12th)</option>
                        <option>Secondary (10th)</option>
                        <option>Primary / Middle</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500">Economic Activity Category</label>
                      <select
                        value={simData.headOccupation}
                        onChange={(e) => setSimData({ ...simData, headOccupation: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-800"
                      >
                        <option>Services / Private Employment</option>
                        <option>Cultivator / Agriculture</option>
                        <option>Agricultural Labourer</option>
                        <option>Household Industry Worker</option>
                        <option>Other Worker / Business</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Consent */}
              {simStep === 4 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
                    STEP 5 OF 5 • REVIEW & ACKNOWLEDGMENT
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-emerald-950">
                    Review and Test Practice Submission
                  </h3>
                  <p className="mt-2 text-xs text-slate-600">
                    In the official Census self-enumeration, you will review answers before generating your official SEAN code.
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-950">
                      <CircleCheck className="size-4 text-emerald-700" />
                      <span>Dwelling: {simData.dwellingType} ({simData.ownership})</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-950">
                      <CircleCheck className="size-4 text-emerald-700" />
                      <span>Water & Fuel: {simData.drinkingWater} • {simData.cookingFuel}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-950">
                      <CircleCheck className="size-4 text-emerald-700" />
                      <span>Household: Fictional Sample Family • 4 Members</span>
                    </div>
                  </div>

                  {simSubmitted && (
                    <div className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-100/70 p-5">
                      <div className="flex items-center gap-2 font-bold text-emerald-950">
                        <CheckCircle2 className="size-5 text-emerald-700" />
                        <span>Practice Simulation Complete!</span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-emerald-900">
                        Sample Acknowledgment Code: <strong className="font-mono text-sm">{simAckCode}</strong>
                      </p>
                      <p className="mt-1 text-[11px] text-slate-600">
                        Note: This is a practice acknowledgement. Official submission must be performed at censusindia.gov.in.
                      </p>
                      <div className="mt-4">
                        <a
                          href="https://censusindia.gov.in/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-emerald-800"
                        >
                          <span>Proceed to Official Census India Portal</span>
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step Navigation Controls */}
              <div className="mt-8 flex items-center justify-between border-t pt-6">
                <button
                  disabled={simStep === 0}
                  onClick={() => setSimStep(Math.max(0, simStep - 1))}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm disabled:opacity-40"
                >
                  ← Back
                </button>

                {simStep < 4 ? (
                  <button
                    onClick={() => setSimStep(simStep + 1)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-800"
                  >
                    <span>Continue to Step {simStep + 2}</span>
                    <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSimSubmit}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-xs font-bold text-emerald-950 shadow-md transition hover:bg-orange-400"
                  >
                    <span>{simSubmitted ? 'Regenerate Practice Code' : 'Complete Practice Flow'}</span>
                    <Check className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5: AI CENSUS FACT CHECKER & SCAM BUSTER
      ======================================================== */}
      <section id="factcheck" className="mx-auto max-w-7xl px-5 py-20 md:px-10">
        <div className="section-heading">
          <div>
            <p className="kicker">CENSUS MISINFORMATION & SCAM BUSTER</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
              {t.factCheckTitle}
            </h2>
          </div>
          <p className="text-slate-600">{t.factCheckSubtitle}</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          {/* Claim Submission Box */}
          <div className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-md md:p-8">
            <label htmlFor="claim-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Type or Paste a Rumour / Social Media Message
            </label>
            <textarea
              id="claim-input"
              value={factClaim}
              onChange={(e) => setFactClaim(e.target.value.slice(0, 500))}
              placeholder="e.g. Pay ₹500 fee and share your OTP to register for Census 2027 online"
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-300 p-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>{factClaim.length}/500 chars • PII is scrubbed automatically</span>
              <button
                onClick={() => handleFactCheck()}
                disabled={!factClaim.trim() || factLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-800 disabled:opacity-50"
              >
                {factLoading ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>Verifying with Official Guidelines...</span>
                  </>
                ) : (
                  <>
                    <SearchCheck className="size-4" />
                    <span>Verify Claim</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Test Rumour Sample Pills */}
            <div className="mt-6 border-t pt-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Or test with common viral rumours:
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  'Pay ₹500 fee and share OTP to register',
                  'Aadhaar card is mandatory for Census',
                  'Officials asking for bank Net Banking password',
                  'Download Census 2027 APK from WhatsApp',
                  'Fine of ₹10,000 for skipping self-enumeration',
                ].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => handleFactCheck(sample)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-950"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Fact Check Result Card */}
          <div>
            {factResult ? (
              <div
                className={
                  'rounded-[2rem] border p-6 shadow-xl transition-all md:p-8 ' +
                  (factResult.status === 'verified'
                    ? 'border-emerald-300 bg-emerald-50/90'
                    : factResult.status === 'false'
                      ? 'border-red-300 bg-red-50/90'
                      : factResult.status === 'misleading'
                        ? 'border-amber-300 bg-amber-50/90'
                        : 'border-slate-300 bg-slate-50/90')
                }
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      'rounded-full px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider ' +
                      (factResult.status === 'verified'
                        ? 'bg-emerald-800 text-white'
                        : factResult.status === 'false'
                          ? 'bg-red-800 text-white'
                          : factResult.status === 'misleading'
                            ? 'bg-amber-800 text-white'
                            : 'bg-slate-700 text-white')
                    }
                  >
                    STATUS: {factResult.status.replace('_', ' ')}
                  </span>

                  {factResult.threatLevel && (
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Threat: {factResult.threatLevel}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900">
                  {factResult.summary}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {factResult.explanation}
                </p>

                <div className="mt-5 rounded-xl bg-white/80 p-4 text-xs font-medium text-slate-800 shadow-sm">
                  <strong className="block font-bold text-emerald-950">Recommended Citizen Action:</strong>
                  <p className="mt-1 leading-5">{factResult.recommendedAction}</p>
                </div>

                {factResult.sources && factResult.sources.length > 0 && (
                  <div className="mt-4 text-[11px] text-slate-500">
                    <strong>Verification Grounding:</strong> {factResult.sources.join(' • ')}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full min-h-[250px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white/50 p-8 text-center text-slate-500">
                <ShieldCheck className="size-10 text-emerald-700/60" />
                <strong className="mt-3 text-sm font-bold text-slate-800">
                  Ready to verify claims
                </strong>
                <p className="mt-1 max-w-xs text-xs">
                  Paste any WhatsApp forward or select a common rumour to view verified official fact-checks.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: EXPLORE INDIA THROUGH DATA & AI CHARTS
      ======================================================== */}
      <section id="explore" className="border-y border-emerald-950/10 bg-emerald-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="section-heading dark-heading">
            <div>
              <p className="kicker text-orange-300">EXPLORE INDIA THROUGH DATA</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Demographic Evolution of India (1951–2011)
              </h2>
            </div>
            <p className="text-emerald-200">
              Interactive historical visualizations based on official Census of India statistical tables.
            </p>
          </div>

          {/* Metric Filter Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-white/15 pb-4">
            <button
              onClick={() => {
                setChartMode('population');
                setChartExplanation(null);
              }}
              className={
                'rounded-xl px-4 py-2 text-xs font-bold transition ' +
                (chartMode === 'population'
                  ? 'bg-orange-500 text-emerald-950 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20')
              }
            >
              Population Trend (1951–2011)
            </button>
            <button
              onClick={() => {
                setChartMode('literacy');
                setChartExplanation(null);
              }}
              className={
                'rounded-xl px-4 py-2 text-xs font-bold transition ' +
                (chartMode === 'literacy'
                  ? 'bg-orange-500 text-emerald-950 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20')
              }
            >
              Literacy Rates & Gender Gap
            </button>
            <button
              onClick={() => {
                setChartMode('rural_urban');
                setChartExplanation(null);
              }}
              className={
                'rounded-xl px-4 py-2 text-xs font-bold transition ' +
                (chartMode === 'rural_urban'
                  ? 'bg-orange-500 text-emerald-950 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20')
              }
            >
              Rural vs Urban Indicators (2011)
            </button>
            <button
              onClick={() => {
                setChartMode('state_matrix');
                setChartExplanation(null);
              }}
              className={
                'rounded-xl px-4 py-2 text-xs font-bold transition ' +
                (chartMode === 'state_matrix'
                  ? 'bg-orange-500 text-emerald-950 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20')
              }
            >
              Top States by Indicators
            </button>
          </div>

          {/* Interactive Chart Container */}
          <div className="mt-8 rounded-[2rem] bg-white p-6 text-slate-900 md:p-8">
            {chartMode === 'population' && (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      DECENNIAL POPULATION (MILLIONS)
                    </span>
                    <h3 className="mt-1 text-2xl font-bold text-emerald-950">
                      National Population Growth (1951 to 2011)
                    </h3>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                    1.21 Billion in 2011
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-7 items-end gap-2 sm:gap-4 h-64 border-b border-slate-200 pb-4 overflow-x-auto">
                  {historicalData.nationalTrends.map((point) => (
                    <div key={point.year} className="flex flex-col items-center gap-2 text-center h-full justify-end min-w-[36px]">
                      <span className="text-[11px] font-bold text-orange-700">{point.population}M</span>
                      <div
                        className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-orange-600 to-orange-400 transition-all duration-500 hover:from-emerald-700 hover:to-emerald-500"
                        style={{ height: `${(point.population / 1210.9) * 100}%` }}
                      />
                      <span className="text-xs font-bold text-slate-600">{point.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chartMode === 'literacy' && (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      LITERACY PROGRESSION (%)
                    </span>
                    <h3 className="mt-1 text-2xl font-bold text-emerald-950">
                      Overall vs Male vs Female Literacy (1951 to 2011)
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-800">
                      <span className="size-3 rounded-full bg-emerald-800" /> Male
                    </span>
                    <span className="flex items-center gap-1.5 text-orange-600">
                      <span className="size-3 rounded-full bg-orange-600" /> Female
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="size-3 rounded-full bg-slate-600" /> Total
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {historicalData.nationalTrends.map((point) => (
                    <div key={point.year} className="grid grid-cols-[60px_1fr] items-center gap-4">
                      <span className="text-xs font-bold text-slate-700">{point.year}</span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="h-3 rounded-full bg-emerald-800 transition-all" style={{ width: `${point.maleLiteracy}%` }} />
                          <span className="text-[10px] font-bold text-emerald-900">{point.maleLiteracy}% M</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 rounded-full bg-orange-500 transition-all" style={{ width: `${point.femaleLiteracy}%` }} />
                          <span className="text-[10px] font-bold text-orange-700">{point.femaleLiteracy}% F</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chartMode === 'rural_urban' && (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      CENSUS 2011 DEMOGRAPHIC SPLIT
                    </span>
                    <h3 className="mt-1 text-2xl font-bold text-emerald-950">
                      Rural vs Urban Key Indicators
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="flex items-center gap-1 text-emerald-900">■ Rural</span>
                    <span className="flex items-center gap-1 text-orange-600">■ Urban</span>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  {historicalData.indicators.map((ind) => (
                    <div key={ind.metric} className="rounded-xl border border-slate-100 bg-[#f7f7f1] p-4">
                      <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span>{ind.metric}</span>
                        <span className="text-slate-500">National: {ind.total2011}</span>
                      </div>
                      <div className="mt-3 grid gap-2">
                        <div className="flex items-center gap-3">
                          <span className="w-14 text-[11px] font-bold text-emerald-900">Rural</span>
                          <div className="h-4 rounded-r-md bg-emerald-900" style={{ width: `${Math.min(ind.rural2011, 100)}%` }} />
                          <span className="text-xs font-bold text-emerald-950">{ind.rural2011}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-14 text-[11px] font-bold text-orange-700">Urban</span>
                          <div className="h-4 rounded-r-md bg-orange-500" style={{ width: `${Math.min(ind.urban2011, 100)}%` }} />
                          <span className="text-xs font-bold text-orange-950">{ind.urban2011}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chartMode === 'state_matrix' && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  TOP PERFORMING STATES • CENSUS 2011
                </span>
                <h3 className="mt-1 text-2xl font-bold text-emerald-950">
                  State Rankings by Literacy & Sex Ratio
                </h3>

                <div className="mt-6 grid gap-6 sm:grid-cols-3">
                  <div className="rounded-2xl border border-emerald-950/10 bg-[#f7f7f1] p-4">
                    <strong className="text-xs font-bold uppercase text-emerald-950">Highest Literacy Rate</strong>
                    <div className="mt-3 space-y-2">
                      {historicalData.topStatesByMetric.highestLiteracy.map((item, idx) => (
                        <div key={item.state} className="flex justify-between text-xs font-semibold">
                          <span>
                            {idx + 1}. {item.state}
                          </span>
                          <strong className="text-emerald-900">{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-4">
                    <strong className="text-xs font-bold uppercase text-orange-950">Highest Sex Ratio (F/1000M)</strong>
                    <div className="mt-3 space-y-2">
                      {historicalData.topStatesByMetric.highestSexRatio.map((item, idx) => (
                        <div key={item.state} className="flex justify-between text-xs font-semibold">
                          <span>
                            {idx + 1}. {item.state}
                          </span>
                          <strong className="text-orange-700">{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-950/10 bg-[#f7f7f1] p-4">
                    <strong className="text-xs font-bold uppercase text-emerald-950">Highest Urban Share</strong>
                    <div className="mt-3 space-y-2">
                      {historicalData.topStatesByMetric.highestUrbanShare.map((item, idx) => (
                        <div key={item.state} className="flex justify-between text-xs font-semibold">
                          <span>
                            {idx + 1}. {item.state}
                          </span>
                          <strong className="text-emerald-900">{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Chart Explanation Bar */}
            <div className="mt-8 border-t pt-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <span className="text-xs text-slate-500">
                  Source: Census of India Historical Tables (Office of the Registrar General of India)
                </span>

                <button
                  onClick={handleExplainChart}
                  disabled={chartExplaining}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-800 disabled:opacity-50"
                >
                  <Sparkles className="size-4 text-orange-400" />
                  <span>{chartExplaining ? 'Analyzing with AI...' : t.explainChart}</span>
                </button>
              </div>

              {chartExplanation && (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-slate-800">
                  <div className="flex items-center gap-2 font-bold text-emerald-950">
                    <Sparkles className="size-4 text-orange-600" />
                    <span>AI Demographic Insight:</span>
                  </div>
                  <p className="mt-2 text-xs leading-6">{chartExplanation.explanation}</p>
                  <div className="mt-3 space-y-1.5">
                    {chartExplanation.keyObservations.map((obs) => (
                      <div key={obs} className="flex items-start gap-2 text-xs font-medium text-emerald-950">
                        <span className="text-orange-600 font-bold">•</span>
                        <span>{obs}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 7: PRIVACY & SAFETY CENTRE
      ======================================================== */}
      <section id="safety" className="mx-auto max-w-7xl px-5 py-20 md:px-10">
        <div className="section-heading">
          <div>
            <p className="kicker">PRIVACY & CITIZEN TRUST</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
              {t.privacyTitle}
            </h2>
          </div>
          <p className="text-slate-600">
            Learn the statutory privacy protections of the Census Act and our zero-PII commitment.
          </p>
        </div>

        {/* What Census Saathi DOES NOT Collect */}
        <div className="mt-10 rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-md md:p-8">
          <h3 className="text-lg font-bold text-emerald-950">
            What Census Saathi Explicitly DOES NOT Collect:
          </h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {privacyData.whatSaathiDoesNotCollect.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs font-bold text-emerald-950">
                <CircleCheck className="size-5 text-emerald-700 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scam Radar & Warning Signals */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {privacyData.scamWarningSignals.map((scam) => (
            <div key={scam.signal} className="rounded-2xl border border-red-200 bg-red-50/70 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-red-900">
                <ShieldAlert className="size-4 text-red-700" />
                <span>SCAM ALERT: {scam.signal}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-700">{scam.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          SECTION 8: SEARCHABLE CATEGORIZED FAQS
      ======================================================== */}
      <section id="faqs" className="border-y border-emerald-950/10 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="section-heading">
            <div>
              <p className="kicker">FREQUENTLY ASKED QUESTIONS</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
                {t.navFaqs}
              </h2>
            </div>
            <p className="text-slate-600">
              Clear answers to the most common questions regarding Census 2027 rules, dates, and safety.
            </p>
          </div>

          {/* FAQ Category Chips + Search Bar */}
          <div className="mt-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFaqCategory('All')}
                className={
                  'rounded-xl px-3.5 py-1.5 text-xs font-bold transition ' +
                  (faqCategory === 'All'
                    ? 'bg-emerald-900 text-white'
                    : 'border border-slate-200 bg-[#f7f7f1] text-slate-700 hover:bg-slate-200')
                }
              >
                All Categories
              </button>
              {faqsData.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFaqCategory(cat)}
                  className={
                    'rounded-xl px-3.5 py-1.5 text-xs font-bold transition ' +
                    (faqCategory === cat
                      ? 'bg-emerald-900 text-white'
                      : 'border border-slate-200 bg-[#f7f7f1] text-slate-700 hover:bg-slate-200')
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-xs font-medium outline-none focus:border-emerald-700"
              />
            </div>
          </div>

          {/* Accordion FAQ List */}
          <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-[#f7f7f1] px-6">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className="py-5">
                  <button
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className="flex w-full items-center justify-between text-left text-sm font-bold text-emerald-950"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={
                        'size-4 shrink-0 transition-transform duration-200 ' +
                        (openFaqId === faq.id ? 'rotate-180 text-orange-600' : 'text-slate-400')
                      }
                    />
                  </button>
                  {openFaqId === faq.id && (
                    <p className="mt-3 text-xs leading-6 text-slate-600">{faq.answer}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                No FAQs matched your search query. Try searching with different terms or ask Census Saathi AI.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 9: VERIFIED OFFICIAL RESOURCES & HELPLINES
      ======================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10">
        <div className="rounded-[2rem] bg-orange-500 p-8 text-emerald-950 shadow-xl md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="kicker text-emerald-950">OFFICIAL GOVERNMENT OF INDIA PORTALS</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                When It Matters, Go Directly to the Official Source.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-emerald-950/80">
                Always verify dates, official mobile applications, and gazetted notifications through the Office of the Registrar General & Census Commissioner, India.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://censusindia.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-950 px-6 py-4 text-xs font-bold text-white shadow-lg transition hover:bg-emerald-900"
              >
                <span>Visit Census India (ORGI)</span>
                <ExternalLink className="size-4" />
              </a>
              <a
                href="https://cybercrime.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-950/20 bg-white/40 px-6 py-4 text-xs font-bold text-emerald-950 transition hover:bg-white/60"
              >
                <span>Cyber Helpline (1930)</span>
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FOOTER WITH STATUTORY CIVIC DISCLAIMER
      ======================================================== */}
      <footer className="border-t border-emerald-950/10 bg-[#f7f7f1] py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 text-xs text-slate-500 md:flex-row md:items-center md:px-10">
          <div className="flex items-center gap-3">
            <div className="grid size-8 place-items-center rounded-xl bg-emerald-900 text-white">
              <span className="text-xs font-bold">जन</span>
            </div>
            <span className="font-bold text-emerald-950">Census Saathi • Census 2027</span>
          </div>

          <p className="max-w-2xl leading-5">
            {t.disclaimer}
          </p>
        </div>
      </footer>

      {/* ========================================================
          FLOATING CENSUS AI COPILOT MODAL / DRAWER
      ======================================================== */}
      {aiOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end bg-emerald-950/25 p-3 backdrop-blur-sm sm:p-6"
          onClick={(e) => {
            if (e.currentTarget === e.target) setAiOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Census Saathi AI Copilot"
            className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-emerald-950 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-orange-500 text-emerald-950">
                  <Bot className="size-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold">Census Saathi AI</strong>
                  <span className="text-[11px] text-emerald-300">
                    Language: {language} • State: {state}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAiOpen(false)}
                className="grid size-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-[#f7f7f1] p-5">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    'flex flex-col ' + (msg.role === 'user' ? 'items-end' : 'items-start')
                  }
                >
                  <div
                    className={
                      'max-w-[88%] rounded-2xl p-4 text-xs leading-6 shadow-sm ' +
                      (msg.role === 'user'
                        ? 'rounded-tr-sm bg-emerald-900 text-white'
                        : 'rounded-tl-sm bg-white text-slate-800')
                    }
                  >
                    {msg.text}
                    {msg.piiRedacted && (
                      <div className="mt-2 text-[10px] font-bold text-orange-600">
                        [Shield: Sensitive ID pattern was scrubbed before processing]
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {aiLoading && (
                <div className="flex items-center gap-2 rounded-2xl bg-white p-3.5 text-xs text-slate-600 shadow-sm">
                  <Sparkles className="size-4 animate-spin text-orange-600" />
                  <span>Census Saathi is thinking...</span>
                </div>
              )}
            </div>

            {/* Prompt Suggestion Chips */}
            <div className="border-t bg-white px-4 py-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Quick Prompts:</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {[
                  'Is Aadhaar mandatory?',
                  'Explain Phase 1 & 2',
                  'Is there any fee?',
                  'How does self-enumeration work?',
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleAskAi(chip)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskAi();
                }}
                className="flex gap-2"
              >
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask anything about Census 2027..."
                  maxLength={500}
                  className="flex-1 rounded-xl border border-slate-200 px-4 text-xs font-medium outline-none focus:border-emerald-600"
                />
                <button
                  type="submit"
                  disabled={!aiInput.trim() || aiLoading}
                  className="grid size-11 place-items-center rounded-xl bg-orange-500 text-emerald-950 shadow-sm transition hover:bg-orange-400 disabled:opacity-50"
                >
                  <Send className="size-4" />
                </button>
              </form>
              <p className="mt-2 text-[10px] text-slate-400">
                Grounding based on official ORGI circulars and Census Act 1948. Do not share real personal data.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
