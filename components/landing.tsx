'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Languages,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { languages, states } from '@/components/experience';

export function Landing() {
  const [language, setLanguage] = useState('English');
  const [state, setState] = useState('Maharashtra');
  const enter = () => {
    sessionStorage.setItem('jan-gan-state', state);
    sessionStorage.setItem('jan-gan-language', language);
    window.location.assign('/dashboard');
  };

  return (
    <main
      id="top"
      className="min-h-screen overflow-y-auto bg-background text-foreground"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
        <Brand />
        <div className="flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-3 py-2 text-xs font-medium text-emerald-950 shadow-sm">
          <ShieldCheck className="size-4 text-emerald-700" /> Privacy-first
          prototype
        </div>
      </nav>
      <section className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-5 pb-16 pt-8 md:grid-cols-[1.08fr_.92fr] md:px-10 md:pt-0">
        <div className="relative z-10 max-w-2xl">
          <div className="eyebrow">
            <Sparkles />
            Your civic AI companion
          </div>
          <h1 className="display">
            Jan Gan AI.
            <br />
            <span>Every story counts.</span>
          </h1>
          <p className="mt-7 max-w-xl text-balance text-lg leading-8 text-slate-600">
            Understand Census 2027, prepare with confidence, and explore the
            story of India—all in your language.
          </p>
          <div className="mt-9 grid max-w-xl gap-3 sm:grid-cols-2">
            <Picker
              icon={<Languages />}
              label="Language"
              value={language}
              onChange={setLanguage}
              options={languages}
            />
            <Picker
              icon={<MapPin />}
              label="Your state"
              value={state}
              onChange={setState}
              options={states}
            />
          </div>
          <button onClick={enter} className="primary mt-4">
            Enter Jan Gan AI <ArrowRight />
          </button>
          <p className="mt-4 max-w-lg text-xs leading-5 text-slate-500">
            No account needed. Choices are kept only for this session. This demo
            never asks for Aadhaar or real identity documents.
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-lg" aria-hidden="true">
          <div className="glow" />
          <div className="preview-card">
            <div className="rounded-[1.4rem] bg-emerald-950 p-6 text-white">
              <div className="flex justify-between text-xs text-emerald-200">
                <span>YOUR CENSUS JOURNEY</span>
                <span>{state}</span>
              </div>
              <p className="mt-8 text-3xl font-semibold tracking-tight">
                Ready, one step at a time.
              </p>
              <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[42%] rounded-full bg-orange-400" />
              </div>
              <div className="mt-4 flex justify-between text-xs">
                <span>Learn</span>
                <span>Prepare</span>
                <span className="text-white/45">Official portal</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Mini tone="orange" title="NEXT FOR YOU">
                Try the 3-minute preparation check
              </Mini>
              <Mini tone="green" title="SAFETY STATUS">
                No sensitive data requested
              </Mini>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Brand() {
  return (
    <a
      href="#top"
      className="flex items-center gap-3 font-semibold tracking-tight"
    >
      <span className="grid size-10 place-items-center rounded-xl bg-emerald-900 text-sm text-white">
        जन
      </span>
      <span>Jan Gan AI</span>
    </a>
  );
}
function Picker({
  icon,
  label,
  value,
  onChange,
  options,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (s: string) => void;
  options: string[];
}) {
  return (
    <label className="picker">
      <span>
        {icon}
        {label}
      </span>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
function Mini({
  tone,
  title,
  children,
}: {
  tone: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        'rounded-2xl p-4 ' +
        (tone === 'orange' ? 'bg-orange-50' : 'bg-emerald-50')
      }
    >
      <p
        className={
          'text-xs font-semibold ' +
          (tone === 'orange' ? 'text-orange-800' : 'text-emerald-800')
        }
      >
        {title}
      </p>
      <p className="mt-4 font-semibold text-slate-900">{children}</p>
    </div>
  );
}
