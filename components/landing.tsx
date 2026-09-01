'use client';

import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Languages,
  MapPin,
  ShieldCheck,
  Sparkles,
  Bot,
  FileCheck2,
  LockKeyhole,
  CheckCircle2,
} from 'lucide-react';
import statesData from '@/data/states.json';
import translationsData from '@/data/translations.json';

export const languageList = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी (Hindi)' },
  { code: 'mr', name: 'Marathi', native: 'मराठी (Marathi)' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা (Bengali)' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు (Telugu)' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ் (Tamil)' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം (Malayalam)' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া (Assamese)' },
  { code: 'ur', name: 'Urdu', native: 'اردو (Urdu)' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम् (Sanskrit)' },
];

export function Landing() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedState, setSelectedState] = useState('Maharashtra');

  // Load saved preferences if available
  useEffect(() => {
    try {
      const savedLang = sessionStorage.getItem('census-saathi-language') || localStorage.getItem('census-saathi-language');
      const savedState = sessionStorage.getItem('census-saathi-state') || localStorage.getItem('census-saathi-state');
      if (savedLang && languageList.some((l) => l.name === savedLang || l.native === savedLang)) {
        setSelectedLanguage(savedLang);
      }
      if (savedState && statesData.states.some((s) => s.name === savedState)) {
        setSelectedState(savedState);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleEnter = () => {
    try {
      sessionStorage.setItem('census-saathi-state', selectedState);
      sessionStorage.setItem('census-saathi-language', selectedLanguage);
      localStorage.setItem('census-saathi-state', selectedState);
      localStorage.setItem('census-saathi-language', selectedLanguage);
    } catch {
      // ignore storage errors
    }
    window.location.assign('/dashboard');
  };

  // Translation helpers
  const langKey = selectedLanguage.toLowerCase().includes('hindi') || selectedLanguage.includes('हिन्दी')
    ? 'hi'
    : selectedLanguage.toLowerCase().includes('marathi') || selectedLanguage.includes('मराठी')
      ? 'mr'
      : 'en';

  const t = translationsData[langKey] || translationsData.en;

  return (
    <main id="top" className="min-h-screen overflow-x-hidden bg-[#f7f7f1] text-[#102a26]">
      {/* Top Civic Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-emerald-900 text-white shadow-md">
            <span className="text-base font-bold tracking-tight">जन</span>
          </div>
          <div>
            <span className="block text-lg font-bold tracking-tight text-emerald-950">
              Census Saathi
            </span>
            <span className="block text-[11px] font-semibold text-orange-700">
              जन गण साथी • Census 2027
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-emerald-950 shadow-sm backdrop-blur-sm">
          <ShieldCheck className="size-4 text-emerald-700" />
          <span>{t.privacyBadge}</span>
        </div>
      </nav>

      {/* Hero Experience */}
      <section className="relative mx-auto grid min-h-[calc(100vh-100px)] max-w-7xl items-center gap-12 px-5 pb-16 pt-4 md:grid-cols-[1.1fr_.9fr] md:px-10 md:pt-0">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-800">
            <Sparkles className="size-3.5 text-orange-600" />
            <span>CENSUS 2027 COMPANION</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl">
            {t.appName}.
            <br />
            <span className="text-orange-600">{t.heroHeading.split('।')[0]}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            {t.heroSubheading}
          </p>

          {/* Harmless Session Pickers */}
          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
            <label className="picker flex flex-col justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Languages className="size-4 text-emerald-700" />
                {t.languageLabel}
              </span>
              <select
                aria-label={t.languageLabel}
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="mt-1 w-full cursor-pointer bg-transparent text-sm font-semibold text-emerald-950 outline-none"
              >
                {languageList.map((lang) => (
                  <option key={lang.code} value={lang.name}>
                    {lang.native}
                  </option>
                ))}
              </select>
            </label>

            <label className="picker flex flex-col justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <MapPin className="size-4 text-emerald-700" />
                {t.stateLabel}
              </span>
              <select
                aria-label={t.stateLabel}
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="mt-1 w-full cursor-pointer bg-transparent text-sm font-semibold text-emerald-950 outline-none"
              >
                {statesData.states.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Primary Enter Action */}
          <div className="mt-6 flex flex-col items-start gap-3">
            <button
              onClick={handleEnter}
              className="primary inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-emerald-900 px-8 text-base font-semibold text-white shadow-xl shadow-emerald-950/15 transition-all hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              <span>{t.enterCta}</span>
              <ArrowRight className="size-5" />
            </button>

            <p className="max-w-lg text-xs leading-5 text-slate-500">
              {t.noAccountNotice}
            </p>
          </div>
        </div>

        {/* Interactive Feature Visual Preview */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="glow" />
          <div className="relative rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-2xl backdrop-blur-xl">
            {/* Top Preview Banner */}
            <div className="rounded-[1.4rem] bg-emerald-950 p-6 text-white shadow-inner">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-200">
                <span className="tracking-wider uppercase">YOUR CENSUS JOURNEY</span>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] text-white">
                  {selectedState}
                </span>
              </div>

              <p className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                Ready for digital Census 2027.
              </p>

              <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-2/5 rounded-full bg-orange-400 transition-all duration-500" />
              </div>

              <div className="mt-3 flex justify-between text-[11px] font-medium text-emerald-200/80">
                <span>01. Prepare</span>
                <span>02. Self-Enumerate</span>
                <span>03. Official Verification</span>
              </div>
            </div>

            {/* Feature Mini Badges */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-2xl border border-orange-200/70 bg-orange-50/80 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-800">
                  <Bot className="size-3.5 text-orange-600" />
                  <span>AI COPILOT</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-800">
                  Multilingual assistance in {selectedLanguage}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <FileCheck2 className="size-3.5 text-emerald-600" />
                  <span>FACT CHECKER</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-800">
                  Detect WhatsApp scams & verify rumours
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
              <span className="flex items-center gap-2 font-medium">
                <LockKeyhole className="size-3.5 text-emerald-700" />
                Zero Aadhaar or document collection
              </span>
              <CheckCircle2 className="size-4 text-emerald-600" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
