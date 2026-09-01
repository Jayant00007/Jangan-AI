'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  CircleCheck,
  ExternalLink,
  FileCheck2,
  Fingerprint,
  Home,
  Languages,
  LockKeyhole,
  MapPin,
  Menu,
  MessageCircle,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

export const states = [
  'Andaman and Nicobar Islands (UT)',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh (UT)',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu (UT)',
  'Delhi (NCT)',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir (UT)',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh (UT)',
  'Lakshadweep (UT)',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry (UT)',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];
export const languages = [
  'English',
  'हिन्दी (Hindi)',
  'অসমীয়া (Assamese)',
  'বাংলা (Bengali)',
  'बोडो (Bodo)',
  'डोगरी (Dogri)',
  'ગુજરાતી (Gujarati)',
  'ಕನ್ನಡ (Kannada)',
  'کٲشُر (Kashmiri)',
  'कोंकणी (Konkani)',
  'मैथिली (Maithili)',
  'മലയാളം (Malayalam)',
  'মণিপুরী (Manipuri)',
  'मराठी (Marathi)',
  'नेपाली (Nepali)',
  'ଓଡ଼ିଆ (Odia)',
  'ਪੰਜਾਬੀ (Punjabi)',
  'संस्कृतम् (Sanskrit)',
  'ᱥᱟᱱᱛᱟᱲᱤ (Santali)',
  'سنڌي (Sindhi)',
  'தமிழ் (Tamil)',
  'తెలుగు (Telugu)',
  'اردو (Urdu)',
  'खासी (Khasi)',
  'मिज़ो (Mizo)',
  'गारो (Garo)',
  'ತುಳು (Tulu)',
];
const trend = [
  { year: '1951', value: 361 },
  { year: '1961', value: 439 },
  { year: '1971', value: 548 },
  { year: '1981', value: 683 },
  { year: '1991', value: 846 },
  { year: '2001', value: 1029 },
  { year: '2011', value: 1211 },
];
const compare = [
  { name: 'Literacy', rural: 68, urban: 85 },
  { name: 'Workers', rural: 42, urban: 36 },
  { name: 'Women / 100 men', rural: 95, urban: 93 },
];
const questions = [
  [
    'Is this the official Census self-enumeration portal?',
    'No. Jan Gan AI is an educational and preparation prototype. It never submits census responses. When official services become available, use links published by the Office of the Registrar General & Census Commissioner, India.',
  ],
  [
    'Will I be asked for Aadhaar here?',
    'Never. This prototype does not request Aadhaar, document uploads, biometrics, or any real identity number. Mock examples are clearly marked and masked.',
  ],
  [
    'What is self-enumeration?',
    'It is an optional way for households to provide census information themselves during an officially announced window. This simulator only helps you understand the kinds of preparation involved.',
  ],
  [
    'How do I spot a Census scam?',
    'Do not share OTPs, banking passwords, or payments. Verify announcements through censusindia.gov.in and use the safety checklist in this prototype before following a link.',
  ],
];

function Logo() {
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

export function Experience({
  startEntered = false,
}: {
  startEntered?: boolean;
}) {
  const [state, setState] = useState('Maharashtra');
  const [language, setLanguage] = useState('English');
  const [mobile, setMobile] = useState(false);
  const [prep, setPrep] = useState(0);
  const [answer, setAnswer] = useState(0);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiText, setAiText] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [fact, setFact] = useState('');
  const [factResult, setFactResult] = useState('');
  const [chartMode, setChartMode] = useState<'trend' | 'compare'>('trend');
  const [demoAddress, setDemoAddress] = useState({
    house: '',
    locality: '',
    pin: '',
  });
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [practiceError, setPracticeError] = useState('');
  useEffect(() => {
    if (!startEntered) return;
    const savedState = sessionStorage.getItem('jan-gan-state');
    const savedLanguage = sessionStorage.getItem('jan-gan-language');
    if (savedState && states.includes(savedState)) setState(savedState);
    if (savedLanguage && languages.includes(savedLanguage))
      setLanguage(savedLanguage);
  }, [startEntered]);
  const greeting = useMemo(
    () =>
      language.includes('Hindi')
        ? 'नमस्ते'
        : language.includes('Marathi')
          ? 'नमस्कार'
          : language.includes('Bengali')
            ? 'নমস্কার'
            : language.includes('Tamil')
              ? 'வணக்கம்'
              : language.includes('Telugu')
                ? 'నమస్కారం'
                : language.includes('Malayalam')
                  ? 'നമസ്കാരം'
                  : language.includes('Punjabi')
                    ? 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ'
                    : language.includes('Gujarati')
                      ? 'નમસ્તે'
                      : 'Namaste',
    [language],
  );
  const safeInput = (v: string) => v.replace(/[<>]/g, '').slice(0, 180);
  const askAi = () => {
    const q = safeInput(aiText.trim());
    if (!q) return;
    setAiText(q);
    setAiReply(
      q.toLowerCase().includes('aadhaar')
        ? 'Jan Gan AI will never ask you to enter Aadhaar here. Please rely on official Census India guidance for accepted processes.'
        : 'Here’s the simple version: Census 2027 is planned as a digital-first national count. This demo helps you learn and prepare; it does not collect or submit your answers.',
    );
  };
  const checkFact = () => {
    const q = safeInput(fact.trim());
    if (!q) return;
    setFact(q);
    setFactResult(
      q.toLowerCase().includes('pay') || q.toLowerCase().includes('otp')
        ? 'High-risk claim. Census participation should never require a payment, bank password, or OTP. Do not proceed; verify through the official Census India website.'
        : 'Unverified in this offline demo. Cross-check the claim on censusindia.gov.in before sharing or acting on it.',
    );
  };

  return (
    <div id="top" className="min-h-screen bg-[#f7f7f1] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-emerald-950/10 bg-[#f7f7f1]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-10">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
            <a href="#journey">My journey</a>
            <a href="#prepare">Prepare</a>
            <a href="#explore">Explore data</a>
            <a href="#safety">Safety</a>
            <a href="#faqs">FAQs</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setAiOpen(true)} className="nav-ai">
              <Sparkles />
              Ask Jan Gan AI
            </button>
            <button
              aria-label="Menu"
              onClick={() => setMobile(!mobile)}
              className="icon-button lg:hidden"
            >
              {mobile ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobile && (
          <nav className="grid gap-1 border-t bg-white p-4 text-sm font-medium lg:hidden">
            {['journey', 'prepare', 'explore', 'safety', 'faqs'].map((x) => (
              <a
                onClick={() => setMobile(false)}
                className="rounded-xl px-3 py-3 capitalize hover:bg-emerald-50"
                key={x}
                href={'#' + x}
              >
                {x}
              </a>
            ))}
          </nav>
        )}
      </header>
      <main>
        <section
          id="journey"
          className="mx-auto max-w-7xl px-5 pb-16 pt-10 md:px-10 md:pt-16"
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="kicker">YOUR PERSONAL GUIDE</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-.04em] text-emerald-950 md:text-6xl">
                {greeting}, {state}.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-600">
                Everything you need to understand and prepare for Census
                2027—without sharing personal information.
              </p>
            </div>
            <button onClick={() => window.location.assign('/')} className="secondary">
              <Languages />
              Change language or state
            </button>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
            <div className="hero-panel">
              <div className="flex items-center justify-between">
                <p className="kicker text-emerald-200">YOUR CENSUS TIMELINE</p>
                <span className="status">Information mode</span>
              </div>
              <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
                Learn now. Prepare calmly. Use only the official portal when
                announced.
              </h2>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                <Step
                  active
                  n="01"
                  title="Understand"
                  text="How Census 2027 works"
                />
                <Step
                  active
                  n="02"
                  title="Prepare"
                  text="Try the safe simulator"
                />
                <Step
                  n="03"
                  title="Participate"
                  text="Official dates awaited"
                />
              </div>
            </div>
            <div className="rounded-[1.6rem] border border-orange-200 bg-orange-50 p-6">
              <div className="grid size-11 place-items-center rounded-xl bg-orange-500 text-white">
                <ShieldCheck />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-orange-800">
                GOOD TO KNOW
              </p>
              <h3 className="mt-2 text-xl font-semibold">
                This is not a submission portal.
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                We do not collect Aadhaar, documents, addresses, or real census
                answers.
              </p>
              <a
                href="#safety"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-900"
              >
                See how we protect you <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="border-y border-emerald-950/10 bg-white py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="section-heading">
              <div>
                <p className="kicker">CENSUS 2027, SIMPLIFIED</p>
                <h2>Two phases. One complete picture.</h2>
              </div>
              <p>
                India’s census counts people and also builds a picture of homes,
                communities, and how the country is changing.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <InfoCard
                icon={<Home />}
                no="PHASE 01"
                title="Houselisting & Housing Census"
                text="Information about houses, household facilities, amenities, and assets—collected during an officially announced period."
                tags={[
                  'Housing condition',
                  'Water & sanitation',
                  'Household amenities',
                ]}
              />
              <InfoCard
                icon={<Users />}
                no="PHASE 02"
                title="Population Enumeration"
                text="Demographic and socioeconomic information about people in each household, gathered in the second phase."
                tags={[
                  'Age & education',
                  'Work & migration',
                  'Household members',
                ]}
              />
            </div>
          </div>
        </section>

        <section id="prepare" className="mx-auto max-w-7xl px-5 py-20 md:px-10">
          <div className="section-heading">
            <div>
              <p className="kicker">SAFE PRACTICE MODE</p>
              <h2>Prepare, without entering real data.</h2>
            </div>
            <p>
              A short simulator to understand the process. All examples are
              fictional and reset when this page closes.
            </p>
          </div>
          <div className="mt-10 grid overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white shadow-sm lg:grid-cols-[.7fr_1.3fr]">
            <div className="bg-emerald-950 p-7 text-white md:p-10">
              <p className="kicker text-emerald-200">
                3-MINUTE READINESS CHECK
              </p>
              <div className="mt-8 space-y-7">
                {['Household basics', 'Address format', 'Review & consent'].map(
                  (x, i) => (
                    <button
                      key={x}
                      onClick={() => setPrep(i)}
                      className={
                        'flex w-full items-center gap-4 text-left ' +
                        (prep === i ? 'opacity-100' : 'opacity-45')
                      }
                    >
                      <span
                        className={
                          'grid size-9 place-items-center rounded-full border text-sm ' +
                          (prep > i
                            ? 'border-orange-400 bg-orange-400 text-emerald-950'
                            : 'border-white/30')
                        }
                      >
                        {prep > i ? <Check /> : i + 1}
                      </span>
                      <span className="font-medium">{x}</span>
                    </button>
                  ),
                )}
              </div>
              <div className="mt-12 rounded-2xl bg-white/10 p-4 text-xs leading-5 text-emerald-100">
                <LockKeyhole className="mb-2 size-5 text-orange-300" />
                No answers leave your browser. Do not type real names,
                addresses, or identity numbers.
              </div>
            </div>
            <div className="p-7 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-700">
                DEMO STEP {prep + 1} OF 3
              </p>
              {prep === 0 && (
                <DemoStep
                  title="Who lives in this fictional household?"
                  text="Use only the sample options below. No real names are needed."
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    {['1 person', '2–4 people', '5+ people'].map((x, i) => (
                      <Choice
                        key={x}
                        active={answer === i}
                        onClick={() => setAnswer(i)}
                      >
                        {x}
                      </Choice>
                    ))}
                  </div>
                  <DemoNote>
                    Demo household: The sample “Patil family” has 4 fictional
                    members.
                  </DemoNote>
                </DemoStep>
              )}
              {prep === 1 && (
                <DemoStep
                  title="Try the demo address form"
                  text="Use fictional information only. These local practice fields are cleared when you close the page."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="demo-input">
                      <span>DEMO HOUSE / FLAT</span>
                      <input
                        value={demoAddress.house}
                        maxLength={40}
                        placeholder="Example: Flat 12-A"
                        onChange={(e) =>
                          setDemoAddress({
                            ...demoAddress,
                            house: safeInput(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label className="demo-input">
                      <span>FICTIONAL LOCALITY</span>
                      <input
                        value={demoAddress.locality}
                        maxLength={50}
                        placeholder="Example: Demo Nagar, Pune"
                        onChange={(e) =>
                          setDemoAddress({
                            ...demoAddress,
                            locality: safeInput(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label className="demo-input sm:col-span-2">
                      <span>DEMO 6-DIGIT PIN</span>
                      <input
                        inputMode="numeric"
                        value={demoAddress.pin}
                        maxLength={6}
                        placeholder="411001"
                        onChange={(e) =>
                          setDemoAddress({
                            ...demoAddress,
                            pin: e.target.value.replace(/\D/g, '').slice(0, 6),
                          })
                        }
                      />
                    </label>
                  </div>
                  {practiceError && (
                    <p
                      role="alert"
                      className="mt-3 text-sm font-semibold text-red-600"
                    >
                      {practiceError}
                    </p>
                  )}
                  <DemoNote>
                    Do not enter your real home address. This is only a format
                    demonstration and is never sent anywhere.
                  </DemoNote>
                </DemoStep>
              )}
              {prep === 2 && (
                <DemoStep
                  title="Review before you consent"
                  text="A trustworthy process tells you what is collected, why, and what happens next."
                >
                  <div className="space-y-3">
                    <CheckRow>Purpose is explained clearly</CheckRow>
                    <CheckRow>
                      No banking password or payment requested
                    </CheckRow>
                    <CheckRow>You can review before continuing</CheckRow>
                  </div>
                  {practiceSubmitted ? (
                    <div
                      role="status"
                      className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
                    >
                      <div className="flex items-center gap-3 font-semibold text-emerald-900">
                        <CircleCheck /> Practice submitted successfully
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        Demo acknowledgement:{' '}
                        <strong>
                          DEMO-2027-{state.slice(0, 2).toUpperCase()}-4821
                        </strong>
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        No census response or address was sent.
                      </p>
                    </div>
                  ) : (
                    <DemoNote>
                      This submits only the local practice exercise. It is not a
                      Census 2027 submission.
                    </DemoNote>
                  )}
                </DemoStep>
              )}
              <div className="mt-8 flex gap-3">
                <button
                  disabled={prep === 0}
                  onClick={() => setPrep(Math.max(0, prep - 1))}
                  className="secondary disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (
                      prep === 1 &&
                      (!demoAddress.house.trim() ||
                        !demoAddress.locality.trim() ||
                        !/^\d{6}$/.test(demoAddress.pin))
                    ) {
                      setPracticeError(
                        'Complete all fictional demo fields and enter a 6-digit demo PIN.',
                      );
                      return;
                    }
                    setPracticeError('');
                    if (prep === 2) {
                      setPracticeSubmitted(true);
                      return;
                    }
                    setPrep(Math.min(2, prep + 1));
                  }}
                  className="primary"
                >
                  {prep === 2
                    ? practiceSubmitted
                      ? 'Submitted'
                      : 'Submit practice'
                    : 'Continue'}{' '}
                  <ArrowRight />
                </button>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-emerald-900 p-6">
                <p className="kicker text-orange-300">SETTLEMENT</p>
                <strong className="mt-3 block text-3xl">68.8% rural</strong>
                <p className="mt-2 text-sm text-emerald-100">
                  31.2% of India’s population lived in urban areas in 2011.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-900 p-6">
                <p className="kicker text-orange-300">LITERACY GAP</p>
                <strong className="mt-3 block text-3xl">16.7 points</strong>
                <p className="mt-2 text-sm text-emerald-100">
                  Difference between male and female literacy rates in Census
                  2011.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-900 p-6">
                <p className="kicker text-orange-300">CHILD POPULATION</p>
                <strong className="mt-3 block text-3xl">158.8 million</strong>
                <p className="mt-2 text-sm text-emerald-100">
                  Children aged 0–6 counted in Census 2011.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="explore" className="bg-emerald-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="section-heading dark-heading">
              <div>
                <p className="kicker text-orange-300">
                  INDIA THROUGH THE NUMBERS
                </p>
                <h2>See how a country changes.</h2>
              </div>
              <p>
                Illustrative historical views based on Census of India series.
                Values are rounded for this educational prototype.
              </p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {[
                ['1.21B', 'Population'],
                ['74.0%', 'Literacy'],
                ['31.2%', 'Urban share'],
                ['943', 'Women / 1,000 men'],
                ['17.7%', 'Decadal growth'],
                ['382', 'People / km²'],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5"
                >
                  <strong className="text-2xl text-orange-300">{value}</strong>
                  <p className="mt-2 text-xs text-emerald-100">{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-emerald-200">
              India snapshot • Census 2011 • Values rounded for quick
              understanding
            </p>
            <div className="mt-10 rounded-[2rem] bg-white p-5 text-slate-900 md:p-8">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <p className="kicker">HISTORICAL EXPLORER</p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    {chartMode === 'trend'
                      ? 'India’s population, 1951–2011'
                      : 'Rural–urban comparison'}
                  </h3>
                </div>
                <div className="segmented">
                  <button
                    onClick={() => setChartMode('trend')}
                    className={chartMode === 'trend' ? 'active' : ''}
                  >
                    Population trend
                  </button>
                  <button
                    onClick={() => setChartMode('compare')}
                    className={chartMode === 'compare' ? 'active' : ''}
                  >
                    Compare
                  </button>
                </div>
              </div>
              <div
                className="mt-8 min-h-80 min-w-0"
                aria-label="Historical census chart"
              >
                {chartMode === 'trend' ? (
                  <div
                    className="chart-bars"
                    role="img"
                    aria-label="India population grew from 361 million in 1951 to 1,211 million in 2011"
                  >
                    {trend.map((point) => (
                      <div className="chart-column" key={point.year}>
                        <span className="chart-value">{point.value}m</span>
                        <span
                          className="chart-bar orange"
                          style={{ height: `${(point.value / 1211) * 100}%` }}
                        />
                        <span className="chart-label">{point.year}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="space-y-7 pt-4"
                    role="img"
                    aria-label="Rural and urban demographic comparison"
                  >
                    {compare.map((point) => (
                      <div key={point.name}>
                        <div className="mb-2 flex justify-between text-sm font-semibold">
                          <span>{point.name}</span>
                          <span className="text-slate-400">Rural / Urban</span>
                        </div>
                        <div className="grid gap-2">
                          <span
                            className="compare-bar rural"
                            style={{ width: `${Math.min(point.rural, 100)}%` }}
                          >
                            {point.rural}
                          </span>
                          <span
                            className="compare-bar urban"
                            style={{ width: `${Math.min(point.urban, 100)}%` }}
                          >
                            {point.urban}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-5 flex flex-col justify-between gap-3 border-t pt-5 md:flex-row md:items-center">
                <p className="text-xs text-slate-500">
                  Source context: Census of India, 2011 and historical
                  population series • Rounded demo values
                </p>
                <button
                  onClick={() => {
                    setAiOpen(true);
                    setAiReply(
                      chartMode === 'trend'
                        ? 'The long curve shows sustained population growth across each census decade. The sharpest absolute gains appear in the later decades, though growth rates and total gains are different measures.'
                        : 'This comparison shows how national averages can hide differences between rural and urban India. Always check definitions and the census year before comparing.',
                    );
                  }}
                  className="secondary"
                >
                  <Sparkles />
                  Explain this chart with AI
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="safety" className="mx-auto max-w-7xl px-5 py-20 md:px-10">
          <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
            <div>
              <p className="kicker">PRIVACY & SAFETY CENTER</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-emerald-950 md:text-5xl">
                Your data should never be the price of understanding.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                This prototype is intentionally useful without identity
                collection. Learn the safety signals before you use any
                census-related service.
              </p>
              <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-5">
                <div className="flex items-start gap-3">
                  <Fingerprint className="mt-1 text-orange-700" />
                  <div>
                    <strong>We never ask for Aadhaar here</strong>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      No identity numbers, OTPs, banking information, document
                      uploads, or biometrics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Safety icon={<LockKeyhole />} title="Minimal by design">
                Only language and state selections are used to personalize this
                session.
              </Safety>
              <Safety icon={<FileCheck2 />} title="Mock means mock">
                Practice fields are labeled and use fictional, masked examples.
              </Safety>
              <Safety icon={<ExternalLink />} title="Safer links">
                Official resources open in a new tab with protective link
                settings.
              </Safety>
              <Safety icon={<SearchCheck />} title="Defensive inputs">
                Demo questions are length-limited and treated only as plain
                text.
              </Safety>
            </div>
          </div>
          <div className="mt-12 rounded-[2rem] border border-emerald-950/10 bg-white p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
              <div>
                <p className="kicker">CLAIM CHECKER</p>
                <h3 className="mt-3 text-2xl font-semibold">
                  Pause before you trust.
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Paste a short claim. This offline demo flags obvious scam
                  signals; it is not an authoritative fact-check.
                </p>
              </div>
              <div>
                <label className="sr-only" htmlFor="fact">
                  Claim to check
                </label>
                <textarea
                  id="fact"
                  value={fact}
                  onChange={(e) => setFact(safeInput(e.target.value))}
                  maxLength={180}
                  placeholder="Example: Pay ₹500 and share your OTP to complete Census 2027"
                  className="input-area"
                />
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {fact.length}/180 • Don’t paste personal data
                  </span>
                  <button onClick={checkFact} className="primary">
                    Check claim <SearchCheck />
                  </button>
                </div>
                {factResult && (
                  <div
                    role="status"
                    className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-slate-700"
                  >
                    <strong className="text-orange-800">Safety result:</strong>{' '}
                    {factResult}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          id="faqs"
          className="border-y border-emerald-950/10 bg-white py-20"
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-10 lg:grid-cols-[.65fr_1.35fr]">
            <div>
              <p className="kicker">CLEAR ANSWERS</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-emerald-950">
                Questions people ask first.
              </h2>
              <p className="mt-4 text-slate-600">
                Need something else? Ask Jan Gan AI for a simple explanation.
              </p>
              <button onClick={() => setAiOpen(true)} className="primary mt-6">
                <MessageCircle />
                Ask a question
              </button>
            </div>
            <div className="divide-y divide-slate-200">
              {questions.map((q, i) => (
                <Faq
                  key={q[0]}
                  q={q[0]}
                  open={answer === i + 10}
                  onClick={() => setAnswer(answer === i + 10 ? 0 : i + 10)}
                >
                  {q[1]}
                </Faq>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-10">
          <div className="rounded-[2rem] bg-orange-500 p-8 text-emerald-950 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="kicker">OFFICIAL RESOURCES</p>
                <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-.04em] md:text-5xl">
                  When it matters, go to the source.
                </h2>
                <p className="mt-4 max-w-2xl text-emerald-950/75">
                  Always confirm dates, eligibility, and participation steps
                  through the Office of the Registrar General & Census
                  Commissioner, India.
                </p>
              </div>
              <a
                href="https://censusindia.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-950 px-6 font-semibold text-white"
              >
                Visit Census India <ExternalLink />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-emerald-950/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 text-sm text-slate-500 md:flex-row md:items-center md:px-10">
          <Logo />
          <p>
            Educational prototype • Not affiliated with or endorsed by the
            Government of India.
          </p>
        </div>
      </footer>

      {aiOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end bg-emerald-950/20 p-3 backdrop-blur-[2px] sm:p-6"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) setAiOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Ask Jan Gan AI"
            className="flex max-h-[82vh] w-full max-w-md flex-col overflow-hidden rounded-[1.6rem] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-emerald-950 p-5 text-white">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-orange-500 text-emerald-950">
                  <Bot />
                </span>
                <div>
                  <strong>Ask Jan Gan AI</strong>
                  <p className="text-xs text-emerald-200">
                    Demo answers • No personal data
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiOpen(false)}
                className="icon-button border-white/20 text-white"
              >
                <X />
              </button>
            </div>
            <div className="min-h-52 flex-1 overflow-y-auto bg-[#f7f7f1] p-5">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-4 text-sm leading-6 shadow-sm">
                Namaste! I can explain Census 2027, preparation, data, or
                safety. Please don’t share names, addresses, Aadhaar, or other
                personal details.
              </div>
              {aiReply && (
                <div className="ml-auto mt-4 max-w-[88%] rounded-2xl rounded-tr-sm bg-emerald-900 p-4 text-sm leading-6 text-white">
                  {aiReply}
                </div>
              )}
            </div>
            <div className="border-t p-4">
              <label className="sr-only" htmlFor="ai">
                Ask a question
              </label>
              <div className="flex gap-2">
                <input
                  id="ai"
                  value={aiText}
                  onChange={(e) => setAiText(safeInput(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') askAi();
                  }}
                  maxLength={180}
                  placeholder="Ask a general question…"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 outline-none focus:border-emerald-600"
                />
                <button
                  onClick={askAi}
                  aria-label="Send question"
                  className="grid size-12 place-items-center rounded-xl bg-orange-500 text-emerald-950"
                >
                  <ArrowRight />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Offline scripted demo. Answers may be incomplete—verify
                important details officially.
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return <Experience />;
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
        {options.map((x) => (
          <option key={x}>{x}</option>
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
function Step({
  active,
  n,
  title,
  text,
}: {
  active?: boolean;
  n: string;
  title: string;
  text: string;
}) {
  return (
    <div className={active ? '' : 'opacity-45'}>
      <span className="text-xs font-semibold text-orange-300">{n}</span>
      <div className="mt-3 h-1 rounded-full bg-white/15">
        <div
          className={
            'h-full rounded-full ' + (active ? 'w-full bg-orange-400' : 'w-0')
          }
        />
      </div>
      <strong className="mt-4 block">{title}</strong>
      <p className="mt-1 text-sm text-emerald-100">{text}</p>
    </div>
  );
}
function InfoCard({
  icon,
  no,
  title,
  text,
  tags,
}: {
  icon: React.ReactNode;
  no: string;
  title: string;
  text: string;
  tags: string[];
}) {
  return (
    <article className="rounded-[1.7rem] border border-emerald-950/10 bg-[#f7f7f1] p-7 md:p-9">
      <div className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-2xl bg-emerald-900 text-white">
          {icon}
        </span>
        <span className="kicker">{no}</span>
      </div>
      <h3 className="mt-8 text-2xl font-semibold tracking-tight text-emerald-950">
        {title}
      </h3>
      <p className="mt-3 leading-7 text-slate-600">{text}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((x) => (
          <span
            key={x}
            className="rounded-full border border-emerald-900/10 bg-white px-3 py-1.5 text-xs font-medium text-emerald-900"
          >
            {x}
          </span>
        ))}
      </div>
    </article>
  );
}
function DemoStep({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950">
        {title}
      </h3>
      <p className="mt-3 text-slate-600">{text}</p>
      <div className="mt-7">{children}</div>
    </>
  );
}
function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        'rounded-xl border p-4 text-left text-sm font-semibold transition ' +
        (active
          ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
          : 'border-slate-200 hover:border-emerald-400')
      }
    >
      {children}
    </button>
  );
}
function DemoNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
      <strong>Practice note:</strong> {children}
    </p>
  );
}
function CheckRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-medium">
      <CircleCheck className="size-5 text-emerald-700" />
      {children}
    </div>
  );
}
function Safety({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-emerald-950/10 bg-white p-5">
      <span className="text-emerald-700">{icon}</span>
      <strong className="mt-4 block">{title}</strong>
      <p className="mt-2 text-sm leading-6 text-slate-600">{children}</p>
    </div>
  );
}
function Faq({
  q,
  open,
  onClick,
  children,
}: {
  q: string;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onClick}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-6 text-left font-semibold"
      >
        <span>{q}</span>
        <ChevronDown
          className={'shrink-0 transition ' + (open ? 'rotate-180' : '')}
        />
      </button>
      {open && (
        <p className="pb-6 pr-10 text-sm leading-7 text-slate-600">
          {children}
        </p>
      )}
    </div>
  );
}
