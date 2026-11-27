/**
 * ==============================================================================
 * The Hype Social - Production Front-End Application
 * Surat (HQ), Gujarat, India
 *
 * 100% Live Data via Supabase (Auth, PostgreSQL, Row-Level Security)
 * Zero fake/demo placeholder records.
 * ==============================================================================
 */

const CO = [
  ['#FF3B30', '#0E0A09'],
  ['#0E0A09', '#FF4E42'],
  ['#FF3B30', '#FF8E85'],
  ['#181312', '#FF3B30']
];

const AGENCY_USPS = [
  {
    tag: '01 · Direct Access',
    title: 'Founder-Led Execution',
    desc: 'You collaborate directly with our creative and performance team—no layers of account managers slowing down your launch.'
  },
  {
    tag: '02 · Focused Sprints',
    title: '2–6 Week Delivery',
    desc: 'Every engagement is structured as a clear sprint with defined deliverables, weekly check-ins, and predictable launch timelines.'
  },
  {
    tag: '03 · Clear Pricing',
    title: 'Transparent INR & USD Rates',
    desc: 'Upfront package rates and scoped custom proposals with zero hidden retainers or surprise agency markups.'
  },
  {
    tag: '04 · Client Portal',
    title: 'Live Brief Tracking',
    desc: 'Submit your brief, update deliverables, and see status updates and creative director feedback in one clean dashboard.'
  }
];

const AGENCY_FAQS = [
  {
    q: 'How do we start a project with The Hype Social?',
    a: 'You can either send a quick inquiry on the Contact page or create a free Client Account to submit a structured project brief. We review every request within one business day.'
  },
  {
    q: 'Are paid ad budgets (Meta / Google) included in package pricing?',
    a: 'No. Package rates cover creative production, strategy, campaign setup, and management. Your ad spend goes directly to your Meta, Google, or quick-commerce ad accounts.'
  },
  {
    q: 'Do you work with brands outside Surat or outside India?',
    a: 'Yes. While our studio is based in Surat, Gujarat, we work remotely with D2C, retail, and service brands across India as well as international clients in USD.'
  },
  {
    q: 'What if we need a custom scope instead of a fixed package?',
    a: 'Use the Contact page and choose "General Inquiry / Custom Retainer" (or "Custom Quote" on any service). Share your goals and timeline, and we will prepare a tailored scope.'
  },
  {
    q: 'How do revisions and creative approvals work?',
    a: 'Every sprint includes structured review checkpoints. Once you submit a brief in your Client Dashboard, our directors share notes and approval statuses directly inside your workspace.'
  },
  {
    q: 'Can we sign up and test the client portal before committing?',
    a: 'Yes. Creating an account is free—you can explore the Client Dashboard, draft a brief, or update deliverables before kicking off production.'
  }
];

const CORE_SERVICES = [
  {
    id: 1,
    title: 'Social Media Management',
    price_inr: '₹7,500/month',
    price_usd: '',
    duration: 'Monthly',
    description: 'End-to-end daily management, content calendars, community engagement, and growth tracking across Instagram, LinkedIn, and Facebook.',
    features: [
      'Monthly content & posting calendar',
      'Captions, hashtags & trend alignment',
      'Community & DM/comment management',
      'Monthly performance insights report'
    ],
    is_featured: true
  },
  {
    id: 2,
    title: 'Content Creation',
    price_inr: '₹6,000/month',
    price_usd: '',
    duration: 'Monthly',
    description: 'Reels, short-form video hooks, product storytelling, and platform-native shoots built to drive organic reach and saves.',
    features: [
      'Reels & short-form video scripting',
      'Hooks, editing & motion graphics',
      'Product & lifestyle visual storytelling',
      'Platform-native repurposing'
    ],
    is_featured: false
  },
  {
    id: 3,
    title: 'Creative Designing',
    price_inr: '₹4,000/month',
    price_usd: '',
    duration: 'Monthly',
    description: 'Scroll-stopping visual design for social feeds, carousels, ad creatives, campaign banners, and brand collaterals.',
    features: [
      'Static posts & multi-slide carousels',
      'High-converting Meta ad creatives',
      'Story templates & highlight covers',
      'Print & digital launch collaterals'
    ],
    is_featured: false
  },
  {
    id: 4,
    title: 'Paid Advertising (Meta Ads)',
    price_inr: '₹4,000/month',
    price_usd: '',
    duration: 'Monthly',
    description: 'ROI-focused Meta Ads campaigns engineered for qualified leads, store traffic, and D2C conversions.',
    features: [
      'Meta Ads Manager campaign setup',
      'Audience research & funnel targeting',
      'Creative A/B testing & bid optimization',
      'Weekly ROAS & CPL tracking'
    ],
    is_featured: false
  },
  {
    id: 5,
    title: 'Branding & Brand Identity',
    price_inr: '₹7,500/project',
    price_usd: '',
    duration: 'Per Project',
    description: 'Complete brand identity systems—logos, color palettes, typography, visual direction, and cohesive brand guidelines.',
    features: [
      'Logo suite & visual identity system',
      'Color palette & typography hierarchy',
      'Tone of voice & brand positioning',
      'Ready-to-use brand stylebook'
    ],
    is_featured: false
  },
  {
    id: 6,
    title: 'SEO & Digital Strategy',
    price_inr: '₹6,000/month',
    price_usd: '',
    duration: 'Monthly',
    description: 'Search engine optimization, technical audits, keyword roadmaps, and full-funnel digital growth strategy.',
    features: [
      'On-page & technical SEO optimization',
      'Keyword & competitor gap research',
      'Full-funnel growth & content roadmap',
      'Analytics & conversion tracking setup'
    ],
    is_featured: false
  }
];

const state = {
  supabase: null,
  supabaseConfigured: false,
  supabaseUrl: '',
  supabaseAnonKey: '',
  oauthProviders: { google: null, facebook: null },
  loadingData: true,
  currentUser: null,
  services: [...CORE_SERVICES],
  works: [],
  userBriefs: [],
  allBriefs: [],
  inquiries: [],
  clients: [],
  currencyMode: 'both',
  adminTab: 'briefs',
  authTab: 'login',
  authNotice: '',
  contactSubmitted: false,
  contactCooldownUntil: 0,
  preselectedService: ''
};

const $ = (selector) => document.querySelector(selector);
const app = $('#app');
const toastEl = $('#toast');
const modalEl = $('#modal');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.hidden = false;
  requestAnimationFrame(() => {
    toastEl.classList.add('show');
  });
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toastEl.classList.remove('show');
    setTimeout(() => {
      if (!toastEl.classList.contains('show')) toastEl.hidden = true;
    }, 350);
  }, 2800);
}

// ==============================================================================
// 1. THEME SWITCHER (GLITCH-FREE LIGHT & DARK MODE)
// ==============================================================================
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';

  document.documentElement.classList.add('theme-switching');

  const btn = $('#theme-btn');
  if (btn) {
    btn.classList.remove('is-animating');
    void btn.offsetWidth;
    btn.classList.add('is-animating');
  }

  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('hype_theme', next);
  updateThemeIcon();

  showToast(`Switched to ${next === 'dark' ? 'Dark Mode' : 'Light Mode'}`);

  setTimeout(() => {
    document.documentElement.classList.remove('theme-switching');
    if (btn) btn.classList.remove('is-animating');
  }, 500);
}

function updateThemeIcon() {
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const icon = $('#theme-icon');
  if (!icon) return;

  if (theme === 'dark') {
    icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  } else {
    icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  }
}

// ==============================================================================
// 2. SUPABASE CLIENT INITIALIZATION & LIVE DATA LOADING
// ==============================================================================
async function fetchSupabaseConfig() {
  if (window.HYPE_CONFIG?.supabaseUrl && window.HYPE_CONFIG?.supabaseAnonKey) {
    return window.HYPE_CONFIG;
  }
  try {
    const res = await fetch('/api/config', { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Config endpoint unavailable:', err);
    return null;
  }
}

async function syncUserProfile(sessionUser) {
  if (!sessionUser || !state.supabase) {
    state.currentUser = null;
    return;
  }

  const { data: profile, error } = await state.supabase
    .from('profiles')
    .select('id, name, company, business_description, email, role')
    .eq('id', sessionUser.id)
    .maybeSingle();

  if (error) {
    console.warn('Profile fetch error:', error.message);
  }

  const meta = sessionUser.user_metadata || {};
  state.currentUser = {
    id: sessionUser.id,
    name: profile?.name || meta.name || sessionUser.email.split('@')[0],
    company: profile?.company || meta.company || '',
    businessDescription: profile?.business_description || meta.business_description || '',
    email: profile?.email || sessionUser.email,
    role: profile?.role || 'user'
  };
}

async function loadPublicData() {
  if (!state.supabaseConfigured || !state.supabase) {
    state.services = [...CORE_SERVICES];
    state.works = [];
    return;
  }

  const [srvRes, wrkRes] = await Promise.all([
    state.supabase.from('services').select('*').order('sort_order', { ascending: true }).order('id', { ascending: true }),
    state.supabase.from('works').select('*').order('sort_order', { ascending: true }).order('id', { ascending: true })
  ]);

  if (!srvRes.error && Array.isArray(srvRes.data) && srvRes.data.length > 0) {
    state.services = srvRes.data;
  } else {
    state.services = [...CORE_SERVICES];
  }
  if (!wrkRes.error && Array.isArray(wrkRes.data)) {
    state.works = wrkRes.data;
  }
}

async function loadProtectedData() {
  if (!state.supabaseConfigured || !state.supabase || !state.currentUser) {
    state.userBriefs = [];
    state.allBriefs = [];
    state.inquiries = [];
    state.clients = [];
    return;
  }

  if (state.currentUser.role === 'admin') {
    const [briefsRes, inqRes, clientsRes] = await Promise.all([
      state.supabase.from('briefs').select('*').order('id', { ascending: false }),
      state.supabase.from('contact_messages').select('*').order('id', { ascending: false }),
      state.supabase.from('profiles').select('id, name, company, business_description, email, role, created_at').order('created_at', { ascending: false })
    ]);
    if (!briefsRes.error && briefsRes.data) state.allBriefs = briefsRes.data;
    if (!inqRes.error && inqRes.data) state.inquiries = inqRes.data;
    if (!clientsRes.error && clientsRes.data) state.clients = clientsRes.data;
  } else {
    const briefsRes = await state.supabase
      .from('briefs')
      .select('*')
      .eq('user_id', state.currentUser.id)
      .order('id', { ascending: false });
    if (!briefsRes.error && briefsRes.data) state.userBriefs = briefsRes.data;
  }
}

async function refreshAllData() {
  state.loadingData = true;
  render();
  await Promise.all([loadPublicData(), loadProtectedData()]);
  state.loadingData = false;
  render();
}

async function initApp() {
  const cfg = await fetchSupabaseConfig();
  const hasKeys = Boolean(
    cfg?.supabaseUrl &&
    cfg?.supabaseAnonKey &&
    !cfg.supabaseUrl.includes('your-project-id') &&
    window.supabase?.createClient
  );

  if (hasKeys) {
    state.supabase = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    state.supabaseConfigured = true;
    state.supabaseUrl = cfg.supabaseUrl.replace(/\/+$/, '');
    state.supabaseAnonKey = cfg.supabaseAnonKey;

    try {
      const settingsRes = await fetch(`${state.supabaseUrl}/auth/v1/settings`, {
        headers: { apikey: state.supabaseAnonKey }
      });
      if (settingsRes.ok) {
        const settingsJson = await settingsRes.json();
        if (settingsJson?.external) {
          state.oauthProviders.google = Boolean(settingsJson.external.google);
          state.oauthProviders.facebook = Boolean(settingsJson.external.facebook);
        }
      }
    } catch (err) {
      console.warn('Auth settings check skipped:', err);
    }

    const { data: sessionData } = await state.supabase.auth.getSession();
    if (sessionData?.session?.user) {
      await syncUserProfile(sessionData.session.user);
    }

    state.supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await syncUserProfile(session.user);
        await loadProtectedData();
        if (event === 'SIGNED_IN' && (!location.hash || location.hash === '#/login' || location.hash.includes('access_token='))) {
          location.hash = state.currentUser.role === 'admin' ? '#/admin' : '#/user';
        }
      } else {
        state.currentUser = null;
        state.userBriefs = [];
        state.allBriefs = [];
        state.inquiries = [];
        state.clients = [];
      }
      render();
    });

    await Promise.all([loadPublicData(), loadProtectedData()]);
  }

  state.loadingData = false;
  render();
}

// ==============================================================================
// 3. HELPERS FOR PRICING & ROUTE PARAMS
// ==============================================================================
function getHashInfo() {
  const raw = location.hash.slice(2) || 'home';
  const [route, queryStr] = raw.split('?');
  const params = new URLSearchParams(queryStr || '');
  return { route, params };
}

function hasUsdPricing() {
  return state.services.some(s => s.price_usd && s.price_usd !== s.price_inr && !s.price_usd.toLowerCase().includes('custom'));
}

function renderPriceHtml(service) {
  const inr = escapeHtml(service.price_inr || '');
  const usd = escapeHtml(service.price_usd || '');
  const showUsd = Boolean(usd) && usd !== inr && !usd.toLowerCase().includes('custom');

  if (!showUsd) {
    return `<div class="price-row"><span class="price-inr" style="font-size:30px;">${inr}</span></div>`;
  }
  if (state.currencyMode === 'inr') {
    return `<div class="price-row"><span class="price-inr">${inr}</span><span class="price-usd">INR</span></div>`;
  }
  if (state.currencyMode === 'usd') {
    return `<div class="price-row"><span class="price-inr">${usd}</span><span class="price-usd">USD</span></div>`;
  }
  return `
    <div class="price-row">
      <span class="price-inr">${inr}</span>
      <span class="price-usd">/ ${usd}</span>
    </div>
  `;
}

function getServiceBudgetLabel(service) {
  if (!service) return '';
  if (!service.price_usd || service.price_inr === service.price_usd || service.price_usd.toLowerCase().includes('custom')) {
    return service.price_inr;
  }
  return `${service.price_inr} / ${service.price_usd}`;
}

// ==============================================================================
// 4. VIEWS (HOME, SERVICES, CONTACT, LOGIN, USER PANEL, ADMIN PANEL)
// ==============================================================================
const Views = {
  home: () => `
    <!-- High-Impact Editorial Hero -->
    <section class="hero">
      <div class="wrap hero-in">
        <div>
          <span class="hero-pill">Surat (HQ), Gujarat &middot; Global Reach &middot; Digital Growth Studio</span>
          <h1 class="tilt">Marketing People Talk About.</h1>
          <p class="lead">
            The Hype Social is a creative and performance marketing agency based in Surat, Gujarat. We build high-impact campaigns, brand identities, and digital launches for growing Indian and global brands.
          </p>
          <div style="display:flex; gap:14px; margin-top:28px; flex-wrap:wrap;">
            <a class="btn w" href="#/services">Explore Services &amp; Pricing</a>
            <a class="btn" href="#/contact">Start a Project &rarr;</a>
          </div>
        </div>

        <!-- Glass Hero Card -->
        <div class="hero-glass-card">
          <div style="background:#FFFFFF; border-radius:8px; padding:22px 18px; box-shadow:0 4px 16px rgba(0,0,0,0.06);">
            <img src="images/logo-cropped.png" alt="The Hype Social" style="max-height:115px; width:auto; max-width:100%; display:block; margin:0 auto; object-fit:contain;">
          </div>
          <div class="hubs-tag">VIP Road, Vesu, Surat (HQ) &middot; Pan-India &amp; Global</div>
        </div>
      </div>
    </section>

    <!-- How It Works (3 Steps) -->
    <section>
      <div class="wrap">
        <h2>How We Work</h2>
        <div class="three-col">
          <div class="card step-card">
            <div class="headline" style="font-size:42px; color:var(--red);">01</div>
            <h3>Pick A Service</h3>
            <p>Explore our agency services and transparent monthly and project packages tailored to your stage of growth.</p>
          </div>
          <div class="card step-card">
            <div class="headline" style="font-size:42px; color:var(--red);">02</div>
            <h3>Share Your Brief</h3>
            <p>Send a quick inquiry or sign into your client portal to share campaign goals, timelines, and deliverables with our team.</p>
          </div>
          <div class="card step-card">
            <div class="headline" style="font-size:42px; color:var(--red);">03</div>
            <h3>Launch &amp; Track</h3>
            <p>Collaborate with our creative directors, review campaign milestones, and track approvals directly from your dashboard.</p>
          </div>
        </div>
      </div>
    </section>

    ${state.works.length ? `
      <!-- Live Case Studies Showcase (Only renders real published records) -->
      <section style="border-top:1px solid var(--line);">
        <div class="wrap">
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:28px; flex-wrap:wrap; gap:12px;">
            <div>
              <h2 style="margin:0;">Featured Campaigns</h2>
              <p style="margin:0; opacity:0.8;">Selected brand launches, growth sprints, and creative work by our team.</p>
            </div>
            <a class="btn sm w" href="#/services">All Services &rarr;</a>
          </div>

          <div class="grid">
            ${state.works.map((w, idx) => `
              <div class="card">
                <div class="art" style="background:linear-gradient(135deg, ${CO[idx % 4][0]}, ${CO[idx % 4][1]})">
                  <span class="region-pill">${escapeHtml(w.region || 'India')}</span>
                  <b>${escapeHtml((w.title || 'H')[0])}</b>
                  <i></i>
                </div>
                <div class="cb">
                  <small>${escapeHtml(w.category)} &middot; ${escapeHtml(w.year)}</small>
                  <h3>${escapeHtml(w.title)}</h3>
                  <p style="font-size:13px; opacity:0.8; margin-bottom:8px;"><b>Client:</b> ${escapeHtml(w.client)}</p>
                  <p style="font-size:14px; opacity:0.9;">${escapeHtml(w.description)}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    ` : ''}

    <!-- Why The Hype Social (Authentic Startup Strengths) -->
    <section style="background:var(--spec-bg); border-top:1px solid var(--line); border-bottom:1px solid var(--line);">
      <div class="wrap">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:28px; flex-wrap:wrap; gap:12px;">
          <div>
            <h2 style="margin:0;">Why The Hype Social</h2>
            <p style="margin:0; opacity:0.8;">Built as a nimble creative and growth partner—no agency bloat, just focused execution.</p>
          </div>
          <a class="btn sm w" href="#/about">About &amp; FAQ &rarr;</a>
        </div>
        <div class="four-col">
          ${AGENCY_USPS.map(u => `
            <div class="card usp-card">
              <span class="usp-label">${escapeHtml(u.tag)}</span>
              <h3>${escapeHtml(u.title)}</h3>
              <p style="font-size:14px; opacity:0.88; margin:0;">${escapeHtml(u.desc)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Quick FAQ Preview -->
    <section>
      <div class="wrap">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
          <div>
            <h2 style="margin:0;">Common Questions</h2>
            <p style="margin:0; opacity:0.8;">Clear answers on pricing, timelines, and how we collaborate.</p>
          </div>
          <a class="btn sm w" href="#/about">All FAQs &rarr;</a>
        </div>
        <div class="faq-list">
          ${AGENCY_FAQS.slice(0, 4).map(f => `
            <details class="faq-item">
              <summary>${escapeHtml(f.q)}</summary>
              <div class="faq-body">${escapeHtml(f.a)}</div>
            </details>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Ready to Launch CTA -->
    <section style="padding-top:16px;">
      <div class="wrap">
        <div class="cta-banner">
          <div>
            <h2>Ready To Launch Your Next Campaign?</h2>
            <p style="margin-top:8px; opacity:0.85;">Tell us about your brand and goals. Our Surat &amp; global team replies within 24 hours.</p>
          </div>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <a class="btn c" href="#/contact">Contact Us &rarr;</a>
            <a class="btn w" href="#/services">View Services</a>
          </div>
        </div>
      </div>
    </section>
  `,

  about: () => `
    <section>
      <div class="wrap">
        <div style="margin-bottom:34px;">
          <h1>About The Hype Social</h1>
          <p class="lead" style="margin-top:10px;">A Surat-based creative &amp; performance marketing studio built for ambitious Indian and global brands.</p>
        </div>

        <div class="two-col" style="margin-bottom:48px;">
          <div class="glass-panel accent-left">
            <h2>Our Mission</h2>
            <p style="margin-top:10px; opacity:0.9;">
              We started The Hype Social with a simple goal: give emerging and growing brands senior-level creative direction, high-converting ad campaigns, and transparent pricing—without bloated agency retainers.
            </p>
            <p style="margin:0; opacity:0.85;">
              From brand identity and launch films to Meta, Google, and quick-commerce performance sprints, we keep every deliverable clear and measurable inside your Client Dashboard.
            </p>
          </div>

          <div class="glass-panel">
            <h2>How Onboarding Works</h2>
            <div class="contact-info-list" style="margin-top:14px;">
              <div class="contact-info-card">
                <small>Step 1 &middot; Discovery</small>
                <div>Share your project inquiry on the Contact page or submit a brief inside your Client Account.</div>
              </div>
              <div class="contact-info-card">
                <small>Step 2 &middot; Scope &amp; Kickoff</small>
                <div>We align on deliverables, sprint duration (2&ndash;6 weeks), and INR/USD budget before production begins.</div>
              </div>
              <div class="contact-info-card">
                <small>Step 3 &middot; Production &amp; Launch</small>
                <div>Track milestones, creative feedback, and approval status in real time until launch.</div>
              </div>
            </div>
          </div>
        </div>

        <h2 style="margin-bottom:20px;">Why Brands Work With Us</h2>
        <div class="four-col" style="margin-bottom:56px;">
          ${AGENCY_USPS.map(u => `
            <div class="card usp-card">
              <span class="usp-label">${escapeHtml(u.tag)}</span>
              <h3>${escapeHtml(u.title)}</h3>
              <p style="font-size:14px; opacity:0.88; margin:0;">${escapeHtml(u.desc)}</p>
            </div>
          `).join('')}
        </div>

        <div style="margin-bottom:24px;">
          <h2 style="margin-bottom:8px;">Frequently Asked Questions</h2>
          <p style="margin:0; opacity:0.8;">Everything you need to know before starting a sprint with us.</p>
        </div>
        <div class="faq-list" style="margin-bottom:48px;">
          ${AGENCY_FAQS.map(f => `
            <details class="faq-item">
              <summary>${escapeHtml(f.q)}</summary>
              <div class="faq-body">${escapeHtml(f.a)}</div>
            </details>
          `).join('')}
        </div>

        <div class="cta-banner">
          <div>
            <h2>Have A Question Not Listed Here?</h2>
            <p style="margin-top:8px; opacity:0.85;">Send us a message and our Surat studio team will reply within one business day.</p>
          </div>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <a class="btn c" href="#/contact">Ask Us Directly &rarr;</a>
            <a class="btn w" href="#/services">Explore Services</a>
          </div>
        </div>
      </div>
    </section>
  `,

  services: () => `
    <section>
      <div class="wrap">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:18px; margin-bottom:34px;">
          <div>
            <h1>Services &amp; Pricing</h1>
            <p class="lead" style="margin-top:10px;">Focused creative and performance marketing packages for Indian and global brands.</p>
          </div>

          ${hasUsdPricing() ? `
            <div class="currency-switch" role="group" aria-label="Currency display">
              <button class="currency-btn ${state.currencyMode === 'both' ? 'active' : ''}" onclick="setCurrencyMode('both')">INR + USD</button>
              <button class="currency-btn ${state.currencyMode === 'inr' ? 'active' : ''}" onclick="setCurrencyMode('inr')">INR (&#8377;)</button>
              <button class="currency-btn ${state.currencyMode === 'usd' ? 'active' : ''}" onclick="setCurrencyMode('usd')">USD ($)</button>
            </div>
          ` : ''}
        </div>

        ${state.loadingData ? `
          <div class="glass-panel" style="text-align:center; padding:40px;">
            <p style="margin:0;">Loading live service packages...</p>
          </div>
        ` : state.services.length ? `
          <div class="grid">
            ${state.services.map(s => {
              const features = Array.isArray(s.features) ? s.features : [];
              const targetHref = state.currentUser
                ? (state.currentUser.role === 'admin' ? '#/admin' : '#/user')
                : '#/login';
              return `
                <div class="card service-card">
                  <div>
                    <span class="tag">Duration: ${escapeHtml(s.duration)}</span>
                    <h3 style="margin-top:12px;">${escapeHtml(s.title)}</h3>
                    ${renderPriceHtml(s)}
                    <p style="font-size:14px; opacity:0.85;">${escapeHtml(s.description)}</p>
                    ${features.length ? `
                      <ul class="service-features">
                        ${features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
                      </ul>
                    ` : ''}
                  </div>
                  <div class="service-actions">
                    <a class="btn sm c" href="${targetHref}" data-service-title="${escapeHtml(s.title)}" data-service-budget="${escapeHtml(getServiceBudgetLabel(s))}" onclick="selectServiceFromButton(this)">
                      Start This Project &rarr;
                    </a>
                    <a class="btn sm w" href="#/contact?service=${encodeURIComponent(s.title)}">
                      Custom Quote
                    </a>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="glass-panel" style="max-width:720px;">
            <h3>Custom Brand &amp; Performance Retainers</h3>
            <p style="opacity:0.88;">
              Every brand has different launch goals, channels, and timelines. Request a tailored proposal and our team will send a scoped package with transparent INR or USD pricing.
            </p>
            <div style="display:flex; gap:12px; margin-top:18px; flex-wrap:wrap;">
              <a class="btn c" href="#/contact">Request A Custom Proposal &rarr;</a>
              ${state.currentUser?.role === 'admin' ? '<a class="btn w" href="#/admin">Manage Services in Admin Panel</a>' : ''}
            </div>
          </div>
        `}
      </div>
    </section>
  `,

  contact: (params) => {
    const preService = params?.get('service') || state.preselectedService || '';
    return `
      <section>
        <div class="wrap">
          <div style="margin-bottom:34px;">
            <h1>Contact &amp; Project Inquiry</h1>
            <p class="lead" style="margin-top:10px;">Have a product launch, retainer, or custom campaign in mind? Reach out to our team directly.</p>
          </div>

          <div class="two-col">
            <!-- Left Studio Details Panel -->
            <div class="glass-panel accent-left">
              <h2>Get In Touch</h2>
              <p style="margin-top:8px; opacity:0.9;">
                Share your campaign timeline and requirements. We review every inquiry and respond within one business day.
              </p>

              <div class="contact-info-list">
                <div class="contact-info-card">
                  <small>Studio Headquarters</small>
                  <div>VIP Road, Vesu, Surat, Gujarat 395007, India</div>
                </div>
                <div class="contact-info-card">
                  <small>Direct Email</small>
                  <a href="mailto:hello@hypesocial.in" style="color:var(--text); font-weight:700; text-decoration:none;">hello@hypesocial.in</a>
                </div>
                <div class="contact-info-card">
                  <small>Phone / WhatsApp</small>
                  <a href="tel:+912614008822" style="color:var(--text); font-weight:700; text-decoration:none;">+91 (0261) 400-8822</a>
                </div>
                <div class="contact-info-card">
                  <small>Studio Hours</small>
                  <div>Monday &ndash; Saturday, 10:00 AM &ndash; 7:00 PM IST</div>
                </div>
              </div>
            </div>

            <!-- Right Inquiry Form Panel -->
            <div class="glass-panel">
              <h3>Send Us A Message</h3>
              <p style="font-size:13px; opacity:0.8;">All inquiries are stored securely and reviewed directly by our team.</p>

              ${state.contactSubmitted ? `
                <div class="alert-banner success">
                  Thank you! Your inquiry has been received by The Hype Social team. We will reply shortly.
                </div>
              ` : ''}

              <form id="contact-form" onsubmit="handleContactSubmit(event)">
                <label>Full Name</label>
                <input id="ct-name" required maxlength="120" placeholder="Your full name">

                <label>Email Address</label>
                <input id="ct-email" type="email" required maxlength="160" placeholder="you@company.com">

                <label>Phone / WhatsApp (Optional)</label>
                <input id="ct-phone" type="tel" maxlength="30" placeholder="+91 98765 43210">

                <label>Service Interested In</label>
                <select id="ct-service">
                  <option value="General Inquiry">General Inquiry / Custom Retainer</option>
                  ${state.services.map(s => `
                    <option value="${escapeHtml(s.title)}" ${preService === s.title ? 'selected' : ''}>
                      ${escapeHtml(s.title)} (${escapeHtml(getServiceBudgetLabel(s))})
                    </option>
                  `).join('')}
                </select>

                <label>Subject</label>
                <input id="ct-subject" required maxlength="180" placeholder="Project subject or campaign goal" value="${preService ? escapeHtml(`Inquiry: ${preService}`) : ''}">

                <label>Message &amp; Project Details</label>
                <textarea id="ct-message" rows="4" required maxlength="3000" placeholder="Tell us about your brand, target audience, timeline, and goals..."></textarea>

                <button id="ct-submit-btn" class="btn c" style="width:100%; margin-top:20px;" type="submit">Send Inquiry</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  login: (notice = '') => {
    const activeNotice = (typeof notice === 'string' ? notice.trim() : '') || state.authNotice;
    const isLogin = state.authTab === 'login';
    return `
      <section>
        <div class="wrap" style="max-width:520px;">
          <div class="glass-panel accent-top">
            <div style="text-align:center; margin-bottom:24px;">
              <h1 style="font-size:clamp(34px, 5vw, 48px); margin-bottom:8px;">${isLogin ? 'Welcome Back' : 'Create Account'}</h1>
              <p style="margin:0; font-size:14px; opacity:0.8;">
                ${isLogin ? 'Sign in to access your Hype Social dashboard.' : 'Register your brand account to submit and track campaign briefs.'}
              </p>
            </div>

            ${activeNotice ? `<div class="alert-banner info">${escapeHtml(activeNotice)}</div>` : ''}

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:22px;">
              <button id="tab-login" class="btn sm ${isLogin ? 'c' : 'w'}" style="width:100%;" onclick="toggleAuthTab('login')">Sign In</button>
              <button id="tab-reg" class="btn sm ${isLogin ? 'w' : 'c'}" style="width:100%;" onclick="toggleAuthTab('reg')">Sign Up</button>
            </div>

            <!-- Sign In Form -->
            <form id="login-form" style="display:${isLogin ? 'block' : 'none'};" onsubmit="handleLogin(event)">
              <label>Email Address</label>
              <input id="auth-email" type="email" required maxlength="160" autocomplete="email" placeholder="you@company.com">
              <label>Password</label>
              <input id="auth-pass" type="password" required maxlength="128" autocomplete="current-password" placeholder="Enter your password">
              <button id="login-btn" class="btn c" style="width:100%; margin-top:22px;" type="submit">Sign In</button>
            </form>

            <!-- Sign Up Form -->
            <form id="reg-form" style="display:${isLogin ? 'none' : 'block'};" onsubmit="handleRegister(event)">
              <label>Full Name</label>
              <input id="reg-name" required maxlength="120" autocomplete="name" placeholder="Your full name">
              <label>Business / Brand Name</label>
              <input id="reg-co" required maxlength="150" autocomplete="organization" placeholder="Your business or brand name">
              <label>Business Description</label>
              <textarea id="reg-biz-desc" rows="2" required maxlength="600" placeholder="Briefly describe your business, products, or target audience"></textarea>
              <label>Email Address</label>
              <input id="reg-email" type="email" required maxlength="160" autocomplete="email" placeholder="you@company.com">
              <label>Password (min 6 characters)</label>
              <input id="reg-pass" type="password" required minlength="6" maxlength="128" autocomplete="new-password" placeholder="Create a password">
              <button id="reg-btn" class="btn c" style="width:100%; margin-top:22px;" type="submit">Create Account</button>
            </form>

            <div class="auth-divider">or continue with</div>
            <div class="oauth-grid">
              <button type="button" class="oauth-btn" onclick="handleOAuthLogin('google')">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.9 1.5l2.6-2.5C16.8 3.1 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12S6.6 21.8 12 21.8c6.9 0 9.6-4.8 9.6-7.3 0-.5-.1-.9-.1-1.3H12z"/>
                </svg>
                <span>Google</span>
              </button>
              <button type="button" class="oauth-btn" onclick="handleOAuthLogin('facebook')">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#1877F2" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99C18.34 21.12 22 16.99 22 12z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  user: () => {
    if (!state.currentUser) {
      return Views.login('Please sign in with your Client account to access your dashboard.');
    }
    if (state.currentUser.role === 'admin') {
      return `
        <section>
          <div class="wrap" style="max-width:620px;">
            <div class="glass-panel accent-top" style="text-align:center;">
              <h2>Signed In As Administrator</h2>
              <p style="opacity:0.85;">You are currently signed in with an agency admin account.</p>
              <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:18px;">
                <a class="btn c" href="#/admin">Open Admin Dashboard &rarr;</a>
                <button class="btn w" onclick="logout()">Sign Out</button>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    const defaultService = state.services.find(s => s.title === state.preselectedService) || state.services[0];
    const approvedCount = state.userBriefs.filter(b => b.status === 'Approved').length;
    const activeCount = state.userBriefs.filter(b => b.status === 'Submitted' || b.status === 'In Progress').length;

    return `
      <section>
        <div class="wrap">
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:24px; flex-wrap:wrap; gap:14px;">
            <div>
              <h1>Client Dashboard</h1>
              <p style="margin:0;">Signed in as <b>${escapeHtml(state.currentUser.name)}</b>${state.currentUser.company ? ` (${escapeHtml(state.currentUser.company)})` : ''}.</p>
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <button class="btn sm w" onclick="openEditProfileModal()">Edit Business Info</button>
              <button class="btn sm w" onclick="logout()">Sign Out</button>
            </div>
          </div>

          <!-- Brand Profile Summary -->
          <div class="glass-panel accent-left" style="padding:22px 26px; margin-bottom:24px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap:wrap;">
              <div>
                <small style="color:var(--red); font-weight:700; text-transform:uppercase; letter-spacing:0.5px; opacity:1;">Your Brand Profile</small>
                <h3 style="margin:4px 0 6px;">${escapeHtml(state.currentUser.company || 'Add Your Business Name')}</h3>
                <p style="margin:0; font-size:14px; opacity:0.88;">
                  ${state.currentUser.businessDescription
                    ? escapeHtml(state.currentUser.businessDescription)
                    : 'No business description added yet. Click "Edit Business Info" so our creative team understands your brand.'}
                </p>
              </div>
              <div style="font-size:13px; opacity:0.75;">${escapeHtml(state.currentUser.email)}</div>
            </div>
          </div>

          <!-- Client Metrics -->
          <div class="metrics-row">
            <div class="metric-card">
              <small>YOUR BRIEFS</small>
              <div class="val">${state.userBriefs.length}</div>
            </div>
            <div class="metric-card">
              <small>IN REVIEW / PROGRESS</small>
              <div class="val red">${activeCount}</div>
            </div>
            <div class="metric-card">
              <small>APPROVED</small>
              <div class="val green">${approvedCount}</div>
            </div>
          </div>

          <div class="two-col">
            <!-- CREATE: Submit New Brief -->
            <div class="glass-panel">
              <h3>Submit New Brief</h3>
              <p style="font-size:13px; opacity:0.8;">Send a campaign brief directly to our creative directors.</p>

              <form onsubmit="handleCreateBrief(event)">
                <label>Campaign Title</label>
                <input id="bf-title" required maxlength="200" placeholder="Campaign name or launch title">

                <label>Service / Package</label>
                ${state.services.length ? `
                  <select id="bf-service" onchange="handleServiceSelectChange(this)">
                    ${state.services.map(s => `
                      <option value="${escapeHtml(s.title)}" data-budget="${escapeHtml(getServiceBudgetLabel(s))}" ${state.preselectedService === s.title ? 'selected' : ''}>
                        ${escapeHtml(s.title)} &mdash; ${escapeHtml(getServiceBudgetLabel(s))}
                      </option>
                    `).join('')}
                    <option value="Custom Scope" data-budget="">Custom Scope</option>
                  </select>
                ` : `
                  <input id="bf-service" required maxlength="180" placeholder="e.g. Social Media Management or Custom Retainer" value="${escapeHtml(state.preselectedService || '')}">
                `}

                <label>Estimated Budget</label>
                <input id="bf-budget" required maxlength="100" placeholder="e.g. ₹7,500/month" value="${escapeHtml(getServiceBudgetLabel(defaultService))}">

                <label>Deliverables &amp; Requirements</label>
                <textarea id="bf-deliv" rows="3" required maxlength="3000" placeholder="Describe the deliverables, channels, and timeline you need"></textarea>

                <button class="btn c" style="width:100%; margin-top:18px;" type="submit">Send Brief To Agency</button>
              </form>
            </div>

            <!-- READ, UPDATE, DELETE: My Submitted Briefs -->
            <div>
              <h3>Your Submitted Briefs (${state.userBriefs.length})</h3>
              ${state.userBriefs.length ? state.userBriefs.map(b => `
                <div class="brief-card">
                  <div class="brief-top">
                    <div>
                      <h3 style="margin:0 0 4px;">${escapeHtml(b.title)}</h3>
                      <small>Service: <b>${escapeHtml(b.service)}</b> &middot; Ref: <b>#${escapeHtml(b.id)}</b> &middot; Date: ${escapeHtml(b.date_formatted || '')}</small>
                    </div>
                    <span class="status-pill ${escapeHtml((b.status || 'Submitted').replace(/\s+/g, '-'))}">${escapeHtml(b.status)}</span>
                  </div>

                  <div class="brief-specs">
                    <div><b>Budget:</b> ${escapeHtml(b.budget)}</div>
                    <div><b>Company:</b> ${escapeHtml(b.company)}</div>
                  </div>

                  <p style="font-size:14px; margin:8px 0;"><b>Requested Deliverables:</b> ${escapeHtml(b.deliverables)}</p>

                  <div class="feedback-note">
                    <b>Agency Director Feedback:</b> ${escapeHtml(b.admin_note || 'Brief received. Assigned to director for review.')}
                  </div>

                  <div style="display:flex; gap:8px; margin-top:14px;">
                    <button class="btn sm w" onclick="openEditModal(${Number(b.id)})">Edit Brief</button>
                    <button class="btn sm danger" onclick="handleDeleteBrief(${Number(b.id)})">Cancel Brief</button>
                  </div>
                </div>
              `).join('') : `
                <div class="glass-panel" style="text-align:center; padding:36px;">
                  <p>No briefs submitted yet.</p>
                  <small>Use the form on the left to send your campaign brief.</small>
                </div>
              `}
            </div>
          </div>
        </div>
      </section>
    `;
  },

  adminLogin: () => `
    <section>
      <div class="wrap" style="max-width:480px;">
        <div class="glass-panel accent-top">
          <div style="text-align:center; margin-bottom:22px;">
            <span class="tag" style="margin-bottom:10px;">Agency Access Only</span>
            <h1 style="font-size:clamp(32px, 5vw, 44px); margin-bottom:8px;">Admin Sign In</h1>
            <p style="margin:0; font-size:14px; opacity:0.8;">Sign in with an authorized administrator email.</p>
          </div>
          ${state.authNotice ? `<div class="alert-banner info">${escapeHtml(state.authNotice)}</div>` : ''}
          <form onsubmit="handleLogin(event)">
            <label>Admin Email</label>
            <input id="auth-email" type="email" required maxlength="160" autocomplete="email" placeholder="admin@company.com">
            <label>Password</label>
            <input id="auth-pass" type="password" required maxlength="128" autocomplete="current-password" placeholder="Enter your password">
            <button id="login-btn" class="btn c" style="width:100%; margin-top:22px;" type="submit">Sign In To Admin Panel</button>
          </form>
        </div>
      </div>
    </section>
  `,

  admin: () => {
    if (!state.currentUser) {
      return Views.adminLogin();
    }
    if (state.currentUser.role !== 'admin') {
      return `
        <section>
          <div class="wrap" style="max-width:560px;">
            <div class="glass-panel accent-top" style="text-align:center;">
              <h2>Access Restricted</h2>
              <p style="opacity:0.85;">This area is restricted to authorized agency administrators.</p>
              <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:18px;">
                <a class="btn c" href="#/user">Go To Client Dashboard &rarr;</a>
                <button class="btn w" onclick="logout()">Sign Out</button>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    return `
      <section>
        <div class="wrap">
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:28px; flex-wrap:wrap; gap:14px;">
            <div>
              <h1>Agency Admin Panel</h1>
              <p style="margin:0;">Logged in as <b>${escapeHtml(state.currentUser.name)}</b> &middot; Live Workspace</p>
            </div>
            <button class="btn sm w" onclick="logout()">Sign Out</button>
          </div>

          <div class="pg-status-bar">
            <div style="display:flex; align-items:center; gap:12px;">
              <span class="pg-badge">
                <span class="pg-dot"></span>
                <span>Supabase Cloud Connected</span>
              </span>
              <span style="font-size:13px; opacity:0.85;">Live Auth &amp; Row-Level Security Active</span>
            </div>
            <button class="btn sm w" onclick="refreshAllData(); showToast('Workspace data refreshed.');">Refresh Data</button>
          </div>

          <div class="metrics-row">
            <div class="metric-card">
              <small>CLIENT BRIEFS</small>
              <div class="val red">${state.allBriefs.length}</div>
            </div>
            <div class="metric-card">
              <small>CONTACT INQUIRIES</small>
              <div class="val">${state.inquiries.length}</div>
            </div>
            <div class="metric-card">
              <small>REGISTERED CLIENTS</small>
              <div class="val green">${state.clients.filter(c => c.role !== 'admin').length}</div>
            </div>
            <div class="metric-card">
              <small>ACTIVE SERVICES</small>
              <div class="val">${state.services.length}</div>
            </div>
          </div>

          <div class="db-tabs">
            <button class="db-tab-btn ${state.adminTab === 'briefs' ? 'active' : ''}" onclick="switchAdminTab('briefs')">Client Briefs (${state.allBriefs.length})</button>
            <button class="db-tab-btn ${state.adminTab === 'inquiries' ? 'active' : ''}" onclick="switchAdminTab('inquiries')">Contact Inquiries (${state.inquiries.length})</button>
            <button class="db-tab-btn ${state.adminTab === 'clients' ? 'active' : ''}" onclick="switchAdminTab('clients')">Clients (${state.clients.filter(c => c.role !== 'admin').length})</button>
            <button class="db-tab-btn ${state.adminTab === 'services' ? 'active' : ''}" onclick="switchAdminTab('services')">Services (${state.services.length})</button>
            <button class="db-tab-btn ${state.adminTab === 'works' ? 'active' : ''}" onclick="switchAdminTab('works')">Case Studies (${state.works.length})</button>
          </div>

          ${state.adminTab === 'briefs' ? Views.adminBriefs() : ''}
          ${state.adminTab === 'inquiries' ? Views.adminInquiries() : ''}
          ${state.adminTab === 'clients' ? Views.adminClients() : ''}
          ${state.adminTab === 'services' ? Views.adminServices() : ''}
          ${state.adminTab === 'works' ? Views.adminWorks() : ''}
        </div>
      </section>
    `;
  },

  adminClients: () => {
    const clientAccounts = state.clients.filter(c => c.role !== 'admin');
    return `
      <div>
        <h2>Registered Clients</h2>
        ${clientAccounts.length ? clientAccounts.map(c => `
          <div class="brief-card">
            <div class="brief-top">
              <div>
                <h3 style="margin:0 0 4px;">${escapeHtml(c.company || c.name)}</h3>
                <small>Contact: <b>${escapeHtml(c.name)}</b> &middot; ${escapeHtml(c.email)}</small>
              </div>
              <span class="tag">${escapeHtml(new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }))}</span>
            </div>
            <p style="font-size:14px; margin:8px 0 0;">
              <b>Business Description:</b> ${c.business_description ? escapeHtml(c.business_description) : '<span style="opacity:0.6;">No description provided yet.</span>'}
            </p>
          </div>
        `).join('') : '<div class="glass-panel"><p style="margin:0;">No client accounts registered yet.</p></div>'}
      </div>
    `;
  },

  adminBriefs: () => `
    <div>
      <h2>Review Client Briefs</h2>
      ${state.allBriefs.length ? state.allBriefs.map(b => `
        <div class="brief-card">
          <div class="brief-top">
            <div>
              <h3 style="margin:0 0 4px;">${escapeHtml(b.title)}</h3>
              <small>Client: <b>${escapeHtml(b.user_name)}</b> (${escapeHtml(b.company)}) &middot; Email: ${escapeHtml(b.user_email)} &middot; Ref: <b>#${escapeHtml(b.id)}</b> &middot; ${escapeHtml(b.date_formatted || '')}</small>
            </div>
            <span class="status-pill ${escapeHtml((b.status || 'Submitted').replace(/\s+/g, '-'))}">${escapeHtml(b.status)}</span>
          </div>

          <div class="brief-specs">
            <div><b>Service:</b> ${escapeHtml(b.service)}</div>
            <div><b>Budget:</b> ${escapeHtml(b.budget)}</div>
          </div>

          <p style="font-size:14px; margin:8px 0;"><b>Deliverables Scope:</b> ${escapeHtml(b.deliverables)}</p>

          <div style="margin-top:16px; border-top:1px solid var(--line); padding-top:14px;">
            <label style="margin-top:0;">Director Feedback Note to Client:</label>
            <input id="note-${Number(b.id)}" value="${escapeHtml(b.admin_note || '')}" placeholder="Write feedback note for client...">

            <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
              <button class="btn sm c" onclick="handleAdminStatus(${Number(b.id)}, 'Approved')">Approve Brief</button>
              <button class="btn sm w" onclick="handleAdminStatus(${Number(b.id)}, 'In Progress')">Set In Progress</button>
              <button class="btn sm w" onclick="handleAdminStatus(${Number(b.id)}, 'Rejected')">Reject Brief</button>
              <button class="btn sm danger" onclick="handleAdminDeleteBrief(${Number(b.id)})">Delete Brief</button>
            </div>
          </div>
        </div>
      `).join('') : '<div class="glass-panel"><p style="margin:0;">No client briefs submitted yet.</p></div>'}
    </div>
  `,

  adminInquiries: () => `
    <div>
      <h2>Contact Form Inquiries</h2>
      ${state.inquiries.length ? state.inquiries.map(inq => `
        <div class="brief-card">
          <div class="brief-top">
            <div>
              <h3 style="margin:0 0 4px;">${escapeHtml(inq.subject || 'Project Inquiry')}</h3>
              <small>From: <b>${escapeHtml(inq.name)}</b> &middot; ${escapeHtml(inq.email)} ${inq.phone ? `&middot; ${escapeHtml(inq.phone)}` : ''}</small>
            </div>
            <span class="status-pill ${escapeHtml(inq.status || 'New')}">${escapeHtml(inq.status || 'New')}</span>
          </div>

          <div class="brief-specs">
            <div><b>Service Interest:</b> ${escapeHtml(inq.service_interest || 'General Inquiry')}</div>
            <div><b>Received:</b> ${escapeHtml(new Date(inq.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }))}</div>
          </div>

          <p style="font-size:14px; margin:8px 0;">${escapeHtml(inq.message)}</p>

          <div style="display:flex; gap:8px; margin-top:14px; flex-wrap:wrap;">
            <button class="btn sm w" onclick="handleInquiryStatus(${Number(inq.id)}, 'Reviewed')">Mark Reviewed</button>
            <button class="btn sm c" onclick="handleInquiryStatus(${Number(inq.id)}, 'Replied')">Mark Replied</button>
            <button class="btn sm danger" onclick="handleDeleteInquiry(${Number(inq.id)})">Delete</button>
          </div>
        </div>
      `).join('') : '<div class="glass-panel"><p style="margin:0;">No contact inquiries received yet.</p></div>'}
    </div>
  `,

  adminServices: () => `
    <div>
      <h2>Manage Agency Services</h2>
      <div class="two-col">
        <div class="glass-panel">
          <h3>Add New Service</h3>
          <form onsubmit="handleCreateService(event)">
            <label>Service Title</label>
            <input id="srv-title" required placeholder="Service package name">
            <label>Price in INR (&#8377;)</label>
            <input id="srv-inr" required placeholder="e.g. ₹7,500/month">
            <label>Price in USD ($, optional)</label>
            <input id="srv-usd" placeholder="e.g. $120/month">
            <label>Estimated Duration</label>
            <input id="srv-dur" required placeholder="e.g. 3 Weeks">
            <label>Description</label>
            <textarea id="srv-desc" rows="2" required placeholder="Describe what is included"></textarea>
            <label>Key Features (comma-separated, optional)</label>
            <input id="srv-features" placeholder="Feature 1, Feature 2, Feature 3">
            <button class="btn c" style="width:100%; margin-top:16px;" type="submit">Publish Service</button>
          </form>
        </div>

        <div>
          <h3>Published Services (${state.services.length})</h3>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${state.services.length ? state.services.map(s => `
              <div class="service-list-item">
                <div>
                  <b>${escapeHtml(s.title)}</b> &mdash; <small style="color:var(--red); font-weight:700;">${escapeHtml(s.price_inr)}</small>${s.price_usd ? ` <small>(${escapeHtml(s.price_usd)})</small>` : ''}
                </div>
                <div style="display:flex; gap:8px;">
                  <button class="btn sm w" onclick="openEditServiceModal(${Number(s.id)})">Edit</button>
                  <button class="btn sm danger" onclick="handleDeleteService(${Number(s.id)})">Delete</button>
                </div>
              </div>
            `).join('') : '<div class="glass-panel"><p style="margin:0;">No services published yet. Add your real packages on the left.</p></div>'}
          </div>
        </div>
      </div>
    </div>
  `,

  adminWorks: () => `
    <div>
      <h2>Manage Showcase Case Studies</h2>
      <div class="two-col">
        <div class="glass-panel">
          <h3>Add Case Study</h3>
          <form onsubmit="handleCreateWork(event)">
            <label>Campaign Title</label>
            <input id="wrk-title" required placeholder="Campaign or project name">
            <label>Client Name</label>
            <input id="wrk-client" required placeholder="Client brand name">
            <label>Region</label>
            <input id="wrk-region" required placeholder="e.g. India / Global">
            <label>Category</label>
            <input id="wrk-cat" required placeholder="e.g. Brand Launch">
            <label>Year</label>
            <input id="wrk-year" required placeholder="2026">
            <label>Description</label>
            <textarea id="wrk-desc" rows="3" required placeholder="Summarize the campaign results and deliverables"></textarea>
            <button class="btn c" style="width:100%; margin-top:16px;" type="submit">Publish Case Study</button>
          </form>
        </div>

        <div>
          <h3>Published Case Studies (${state.works.length})</h3>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${state.works.length ? state.works.map(w => `
              <div class="service-list-item">
                <div>
                  <b>${escapeHtml(w.title)}</b> &mdash; <small>${escapeHtml(w.category)} (${escapeHtml(w.year)})</small>
                </div>
                <div style="display:flex; gap:8px;">
                  <button class="btn sm w" onclick="openEditWorkModal(${Number(w.id)})">Edit</button>
                  <button class="btn sm danger" onclick="handleDeleteWork(${Number(w.id)})">Delete</button>
                </div>
              </div>
            `).join('') : '<div class="glass-panel"><p style="margin:0;">No case studies published yet. Add real client work on the left.</p></div>'}
          </div>
        </div>
      </div>
    </div>
  `
};

// ==============================================================================
// 5. MASTER RENDER & ROUTER
// ==============================================================================
function render() {
  const { route, params } = getHashInfo();
  const validRoutes = ['home', 'services', 'about', 'contact', 'login', 'user', 'admin'];
  let viewKey = validRoutes.includes(route) ? route : 'home';

  if (viewKey === 'user' && !state.currentUser) {
    viewKey = 'login';
  }

  if (!location.hash) {
    location.hash = '#/home';
    viewKey = 'home';
  }

  app.innerHTML = viewKey === 'contact' ? Views.contact(params) : Views[viewKey]();

  const nav = $('#navbar');
  if (nav) {
    let navLinksHtml = `
      <a href="#/home" class="nav-link ${viewKey === 'home' ? 'on' : ''}">Showcase</a>
      <a href="#/services" class="nav-link ${viewKey === 'services' ? 'on' : ''}">Services &amp; Pricing</a>
      <a href="#/about" class="nav-link ${viewKey === 'about' ? 'on' : ''}">About &amp; FAQ</a>
      <a href="#/contact" class="nav-link ${viewKey === 'contact' ? 'on' : ''}">Contact</a>
    `;

    if (state.currentUser && state.currentUser.role === 'user') {
      navLinksHtml += `
        <a href="#/user" class="nav-link ${viewKey === 'user' ? 'on' : ''}" style="color:var(--red); font-weight:700;">My Briefs</a>
      `;
    }

    if (state.currentUser && state.currentUser.role === 'admin') {
      navLinksHtml += `
        <a href="#/admin" class="nav-link ${viewKey === 'admin' ? 'on' : ''}" style="color:var(--red); font-weight:700;">Admin Dashboard</a>
      `;
    }

    nav.innerHTML = navLinksHtml;
  }

  const userBox = $('#user-status');
  if (userBox) {
    if (state.currentUser) {
      userBox.innerHTML = `
        <span style="font-weight:700; font-size:13px;">${escapeHtml(state.currentUser.name)}</span>
        <button class="btn sm w" onclick="logout()">Sign Out</button>
      `;
    } else {
      userBox.innerHTML = '<a class="btn sm c" href="#/login">Sign In</a>';
    }
  }

  updateThemeIcon();
  window.scrollTo(0, 0);
}

// ==============================================================================
// 6. INTERACTION & SUPABASE CRUD HANDLERS
// ==============================================================================
function setCurrencyMode(mode) {
  state.currencyMode = mode;
  render();
}

function switchAdminTab(tab) {
  state.adminTab = tab;
  render();
}

function toggleAuthTab(tab) {
  state.authTab = tab;
  state.authNotice = '';
  render();
}

function selectServiceFromButton(btn) {
  const title = btn?.dataset?.serviceTitle || '';
  const budget = btn?.dataset?.serviceBudget || '';
  selectServiceForBrief(title, budget);
}

function selectServiceForBrief(title, budget) {
  state.preselectedService = title;
  setTimeout(() => {
    const srvSelect = $('#bf-service');
    const budInput = $('#bf-budget');
    if (srvSelect) srvSelect.value = title;
    if (budInput && budget) budInput.value = budget;
  }, 80);
}

function handleServiceSelectChange(sel) {
  const selectedOpt = sel.options[sel.selectedIndex];
  const budget = selectedOpt?.getAttribute('data-budget');
  const budInput = $('#bf-budget');
  if (budInput && budget !== null) budInput.value = budget;
}

async function handleContactSubmit(e) {
  e.preventDefault();
  if (!state.supabaseConfigured || !state.supabase) {
    showToast('Please connect Supabase first to submit inquiries.');
    return;
  }

  const now = Date.now();
  if (now < state.contactCooldownUntil) {
    const waitSec = Math.ceil((state.contactCooldownUntil - now) / 1000);
    showToast(`Please wait ${waitSec}s before sending another inquiry.`);
    return;
  }

  const btn = $('#ct-submit-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Sending...';
  }

  const payload = {
    name: $('#ct-name').value.trim(),
    email: $('#ct-email').value.trim().toLowerCase(),
    phone: $('#ct-phone').value.trim(),
    service_interest: $('#ct-service').value,
    subject: $('#ct-subject').value.trim(),
    message: $('#ct-message').value.trim()
  };

  const { error } = await state.supabase.from('contact_messages').insert([payload]);

  if (btn) {
    btn.disabled = false;
    btn.textContent = 'Send Inquiry';
  }

  if (error) {
    showToast(`Failed to send inquiry: ${error.message}`);
    return;
  }

  state.contactCooldownUntil = Date.now() + 15000;
  state.contactSubmitted = true;
  showToast('Inquiry sent! We will contact you shortly.');
  render();
}

async function handleLogin(e) {
  e.preventDefault();
  if (!state.supabaseConfigured || !state.supabase) {
    state.authNotice = 'Supabase credentials are not configured yet.';
    render();
    return;
  }

  const btn = $('#login-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Signing In...';
  }

  const email = $('#auth-email').value.trim().toLowerCase();
  const password = $('#auth-pass').value;

  const { data, error } = await state.supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Sign In';
    }
    state.authNotice = error.message;
    render();
    return;
  }

  state.authNotice = '';
  await syncUserProfile(data.user);
  await loadProtectedData();
  showToast(`Welcome, ${state.currentUser.name}!`);
  location.hash = state.currentUser.role === 'admin' ? '#/admin' : '#/user';
  render();
}

async function handleRegister(e) {
  e.preventDefault();
  if (!state.supabaseConfigured || !state.supabase) {
    state.authNotice = 'Supabase credentials are not configured yet.';
    render();
    return;
  }

  const btn = $('#reg-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Creating Account...';
  }

  const name = $('#reg-name').value.trim();
  const company = $('#reg-co').value.trim();
  const businessDescription = $('#reg-biz-desc').value.trim();
  const email = $('#reg-email').value.trim().toLowerCase();
  const password = $('#reg-pass').value;

  const { data, error } = await state.supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, company, business_description: businessDescription }
    }
  });

  if (error) {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Create Account';
    }
    const lower = (error.message || '').toLowerCase();
    state.authNotice = lower.includes('rate limit')
      ? 'Email rate limit exceeded on Supabase free tier. Turn OFF "Confirm email" in Supabase -> Authentication -> Providers -> Email and try again.'
      : error.message;
    render();
    return;
  }

  if (data.session?.user) {
    state.authNotice = '';
    await syncUserProfile(data.session.user);
    await loadProtectedData();
    showToast('Client account created!');
    location.hash = '#/user';
    render();
  } else {
    state.authTab = 'login';
    state.authNotice = 'Account created! Please check your email inbox to confirm your address, then sign in.';
    render();
  }
}

async function handleOAuthLogin(provider) {
  if (!state.supabaseConfigured || !state.supabase) {
    state.authNotice = 'Supabase credentials are not configured yet.';
    render();
    return;
  }

  const label = provider.charAt(0).toUpperCase() + provider.slice(1);

  if (state.supabaseUrl && state.supabaseAnonKey) {
    try {
      const res = await fetch(`${state.supabaseUrl}/auth/v1/settings`, {
        headers: { apikey: state.supabaseAnonKey }
      });
      if (res.ok) {
        const settings = await res.json();
        if (settings?.external && settings.external[provider] === false) {
          state.authNotice = `${label} login is not turned on yet in Supabase. Go to Supabase -> Authentication -> Providers -> ${label} to add your OAuth Client ID & Secret, or use Email Sign In / Sign Up above.`;
          render();
          return;
        }
      }
    } catch (err) {
      console.warn('OAuth precheck failed:', err);
    }
  }

  const { error } = await state.supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) {
    const msg = (error.message || '').toLowerCase();
    state.authNotice = msg.includes('not enabled') || msg.includes('unsupported provider')
      ? `${label} login is not enabled yet in Supabase. Enable it under Supabase -> Authentication -> Providers -> ${label}.`
      : error.message;
    render();
  }
}

function openEditProfileModal() {
  if (!state.currentUser) return;
  modalEl.innerHTML = `
    <h3>Edit Business Profile</h3>
    <p style="font-size:13px; opacity:0.8; margin-bottom:16px;">Keep your brand details up to date for our creative team.</p>
    <form onsubmit="handleSaveProfile(event)">
      <label>Full Name</label>
      <input id="prof-name" required maxlength="120" value="${escapeHtml(state.currentUser.name)}">
      <label>Business / Brand Name</label>
      <input id="prof-company" required maxlength="150" value="${escapeHtml(state.currentUser.company || '')}">
      <label>Business Description</label>
      <textarea id="prof-desc" rows="3" maxlength="600" placeholder="Describe your business, target market, and offerings">${escapeHtml(state.currentUser.businessDescription || '')}</textarea>
      <div style="display:flex; gap:10px; margin-top:20px;">
        <button class="btn c" type="submit">Save Profile</button>
        <button class="btn w" type="button" onclick="modalEl.close()">Cancel</button>
      </div>
    </form>
  `;
  modalEl.showModal();
}

async function handleSaveProfile(e) {
  e.preventDefault();
  if (!state.supabase || !state.currentUser) return;

  const name = $('#prof-name').value.trim();
  const company = $('#prof-company').value.trim();
  const business_description = $('#prof-desc').value.trim();

  const { error } = await state.supabase
    .from('profiles')
    .update({ name, company, business_description })
    .eq('id', state.currentUser.id);

  if (error) {
    showToast(`Could not update profile: ${error.message}`);
    return;
  }

  state.currentUser.name = name;
  state.currentUser.company = company;
  state.currentUser.businessDescription = business_description;
  modalEl.close();
  showToast('Business profile updated.');
  render();
}

async function logout() {
  if (state.supabase) {
    await state.supabase.auth.signOut();
  }
  state.currentUser = null;
  state.userBriefs = [];
  state.allBriefs = [];
  state.inquiries = [];
  state.clients = [];
  showToast('Signed out successfully.');
  location.hash = '#/home';
  render();
}

async function handleCreateBrief(e) {
  e.preventDefault();
  if (!state.supabase || !state.currentUser) return;

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const payload = {
    user_id: state.currentUser.id,
    user_name: state.currentUser.name,
    user_email: state.currentUser.email,
    company: state.currentUser.company || 'Client Brand',
    title: $('#bf-title').value.trim(),
    service: $('#bf-service').value.trim(),
    budget: $('#bf-budget').value.trim(),
    deliverables: $('#bf-deliv').value.trim(),
    date_formatted: formattedDate
  };

  const { data, error } = await state.supabase.from('briefs').insert([payload]).select().single();
  if (error) {
    showToast(`Could not submit brief: ${error.message}`);
    return;
  }

  state.userBriefs.unshift(data);
  showToast('Project brief submitted!');
  render();
}

function openEditModal(briefId) {
  const brief = state.userBriefs.find(b => b.id === briefId);
  if (!brief) return;

  modalEl.innerHTML = `
    <h3>Edit Project Brief</h3>
    <p style="font-size:13px; opacity:0.8; margin-bottom:16px;">Modify your project title or deliverables scope.</p>
    <form onsubmit="handleSaveEditBrief(event, ${Number(brief.id)})">
      <label>Campaign Title</label>
      <input id="edit-title" required maxlength="200" value="${escapeHtml(brief.title)}">
      <label>Deliverables Scope</label>
      <textarea id="edit-deliv" rows="3" required maxlength="3000">${escapeHtml(brief.deliverables)}</textarea>
      <div style="display:flex; gap:10px; margin-top:20px;">
        <button class="btn c" type="submit">Save Changes</button>
        <button class="btn w" type="button" onclick="modalEl.close()">Cancel</button>
      </div>
    </form>
  `;
  modalEl.showModal();
}

async function handleSaveEditBrief(e, id) {
  e.preventDefault();
  if (!state.supabase) return;

  const title = $('#edit-title').value.trim();
  const deliverables = $('#edit-deliv').value.trim();

  const { data, error } = await state.supabase
    .from('briefs')
    .update({ title, deliverables })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    showToast(`Update failed: ${error.message}`);
    return;
  }

  modalEl.close();
  const idx = state.userBriefs.findIndex(b => b.id === id);
  if (idx !== -1) state.userBriefs[idx] = data;
  showToast('Brief updated.');
  render();
}

async function handleDeleteBrief(id) {
  if (!confirm('Are you sure you want to cancel and delete this brief?')) return;
  if (!state.supabase) return;

  const { error } = await state.supabase.from('briefs').delete().eq('id', id);
  if (error) {
    showToast(`Delete failed: ${error.message}`);
    return;
  }

  state.userBriefs = state.userBriefs.filter(b => b.id !== id);
  showToast('Brief deleted.');
  render();
}

async function handleAdminStatus(id, newStatus) {
  if (!state.supabase) return;
  const noteInput = $(`#note-${id}`);
  const admin_note = noteInput ? noteInput.value.trim() : '';

  const { data, error } = await state.supabase
    .from('briefs')
    .update({ status: newStatus, admin_note })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    showToast(`Update failed: ${error.message}`);
    return;
  }

  const idx = state.allBriefs.findIndex(b => b.id === id);
  if (idx !== -1) state.allBriefs[idx] = data;
  showToast(`Brief marked as ${newStatus}.`);
  render();
}

async function handleAdminDeleteBrief(id) {
  if (!confirm('Admin: Delete this brief permanently?')) return;
  if (!state.supabase) return;

  const { error } = await state.supabase.from('briefs').delete().eq('id', id);
  if (error) {
    showToast(`Delete failed: ${error.message}`);
    return;
  }

  state.allBriefs = state.allBriefs.filter(b => b.id !== id);
  showToast('Brief deleted.');
  render();
}

async function handleInquiryStatus(id, status) {
  if (!state.supabase) return;
  const { data, error } = await state.supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    showToast(`Update failed: ${error.message}`);
    return;
  }

  const idx = state.inquiries.findIndex(i => i.id === id);
  if (idx !== -1) state.inquiries[idx] = data;
  showToast(`Inquiry marked as ${status}.`);
  render();
}

async function handleDeleteInquiry(id) {
  if (!confirm('Delete this inquiry?')) return;
  if (!state.supabase) return;

  const { error } = await state.supabase.from('contact_messages').delete().eq('id', id);
  if (error) {
    showToast(`Delete failed: ${error.message}`);
    return;
  }

  state.inquiries = state.inquiries.filter(i => i.id !== id);
  showToast('Inquiry deleted.');
  render();
}

async function handleCreateService(e) {
  e.preventDefault();
  if (!state.supabase) return;

  const rawFeatures = $('#srv-features').value.trim();
  const features = rawFeatures
    ? rawFeatures.split(',').map(f => f.trim()).filter(Boolean)
    : [];

  const payload = {
    title: $('#srv-title').value.trim(),
    price_inr: $('#srv-inr').value.trim(),
    price_usd: $('#srv-usd').value.trim(),
    duration: $('#srv-dur').value.trim(),
    description: $('#srv-desc').value.trim(),
    features,
    sort_order: state.services.length + 1
  };

  const { data, error } = await state.supabase.from('services').insert([payload]).select().single();
  if (error) {
    showToast(`Failed to add service: ${error.message}`);
    return;
  }

  state.services.push(data);
  showToast('Service published.');
  render();
}

function openEditServiceModal(serviceId) {
  const srv = state.services.find(s => s.id === serviceId);
  if (!srv) return;

  const featuresStr = Array.isArray(srv.features) ? srv.features.join(', ') : '';
  modalEl.innerHTML = `
    <h3>Edit Service</h3>
    <form onsubmit="handleSaveEditService(event, ${Number(srv.id)})">
      <label>Service Title</label>
      <input id="edit-srv-title" value="${escapeHtml(srv.title)}" required>
      <label>Price in INR (&#8377;)</label>
      <input id="edit-srv-inr" value="${escapeHtml(srv.price_inr)}" required>
      <label>Price in USD ($, optional)</label>
      <input id="edit-srv-usd" value="${escapeHtml(srv.price_usd || '')}">
      <label>Duration</label>
      <input id="edit-srv-dur" value="${escapeHtml(srv.duration)}" required>
      <label>Description</label>
      <textarea id="edit-srv-desc" rows="2" required>${escapeHtml(srv.description)}</textarea>
      <label>Key Features (comma-separated)</label>
      <input id="edit-srv-features" value="${escapeHtml(featuresStr)}">
      <div style="display:flex; gap:10px; margin-top:20px;">
        <button class="btn c" type="submit">Save Service</button>
        <button class="btn w" type="button" onclick="modalEl.close()">Cancel</button>
      </div>
    </form>
  `;
  modalEl.showModal();
}

async function handleSaveEditService(e, id) {
  e.preventDefault();
  if (!state.supabase) return;

  const rawFeatures = $('#edit-srv-features').value.trim();
  const features = rawFeatures
    ? rawFeatures.split(',').map(f => f.trim()).filter(Boolean)
    : [];

  const updates = {
    title: $('#edit-srv-title').value.trim(),
    price_inr: $('#edit-srv-inr').value.trim(),
    price_usd: $('#edit-srv-usd').value.trim(),
    duration: $('#edit-srv-dur').value.trim(),
    description: $('#edit-srv-desc').value.trim(),
    features
  };

  const { data, error } = await state.supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    showToast(`Update failed: ${error.message}`);
    return;
  }

  modalEl.close();
  const idx = state.services.findIndex(s => s.id === id);
  if (idx !== -1) state.services[idx] = data;
  showToast('Service updated.');
  render();
}

async function handleDeleteService(id) {
  if (!confirm('Delete this service package?')) return;
  if (!state.supabase) return;

  const { error } = await state.supabase.from('services').delete().eq('id', id);
  if (error) {
    showToast(`Delete failed: ${error.message}`);
    return;
  }

  state.services = state.services.filter(s => s.id !== id);
  showToast('Service deleted.');
  render();
}

async function handleCreateWork(e) {
  e.preventDefault();
  if (!state.supabase) return;

  const payload = {
    title: $('#wrk-title').value.trim(),
    client: $('#wrk-client').value.trim(),
    region: $('#wrk-region').value.trim(),
    category: $('#wrk-cat').value.trim(),
    year: $('#wrk-year').value.trim(),
    description: $('#wrk-desc').value.trim(),
    sort_order: state.works.length + 1
  };

  const { data, error } = await state.supabase.from('works').insert([payload]).select().single();
  if (error) {
    showToast(`Failed to add case study: ${error.message}`);
    return;
  }

  state.works.push(data);
  showToast('Case study published.');
  render();
}

function openEditWorkModal(workId) {
  const work = state.works.find(w => w.id === workId);
  if (!work) return;

  modalEl.innerHTML = `
    <h3>Edit Case Study</h3>
    <form onsubmit="handleSaveEditWork(event, ${Number(work.id)})">
      <label>Campaign Title</label>
      <input id="edit-wrk-title" required maxlength="180" value="${escapeHtml(work.title)}">
      <label>Client Name</label>
      <input id="edit-wrk-client" required maxlength="180" value="${escapeHtml(work.client)}">
      <label>Region</label>
      <input id="edit-wrk-region" required maxlength="100" value="${escapeHtml(work.region)}">
      <label>Category</label>
      <input id="edit-wrk-cat" required maxlength="100" value="${escapeHtml(work.category)}">
      <label>Year</label>
      <input id="edit-wrk-year" required maxlength="20" value="${escapeHtml(work.year)}">
      <label>Description</label>
      <textarea id="edit-wrk-desc" rows="3" required maxlength="1500">${escapeHtml(work.description)}</textarea>
      <div style="display:flex; gap:10px; margin-top:20px;">
        <button class="btn c" type="submit">Save Case Study</button>
        <button class="btn w" type="button" onclick="modalEl.close()">Cancel</button>
      </div>
    </form>
  `;
  modalEl.showModal();
}

async function handleSaveEditWork(e, id) {
  e.preventDefault();
  if (!state.supabase) return;

  const updates = {
    title: $('#edit-wrk-title').value.trim(),
    client: $('#edit-wrk-client').value.trim(),
    region: $('#edit-wrk-region').value.trim(),
    category: $('#edit-wrk-cat').value.trim(),
    year: $('#edit-wrk-year').value.trim(),
    description: $('#edit-wrk-desc').value.trim()
  };

  const { data, error } = await state.supabase
    .from('works')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    showToast(`Update failed: ${error.message}`);
    return;
  }

  modalEl.close();
  const idx = state.works.findIndex(w => w.id === id);
  if (idx !== -1) state.works[idx] = data;
  showToast('Case study updated.');
  render();
}

async function handleDeleteWork(id) {
  if (!confirm('Delete this case study?')) return;
  if (!state.supabase) return;

  const { error } = await state.supabase.from('works').delete().eq('id', id);
  if (error) {
    showToast(`Delete failed: ${error.message}`);
    return;
  }

  state.works = state.works.filter(w => w.id !== id);
  showToast('Case study deleted.');
  render();
}

window.addEventListener('hashchange', () => {
  state.contactSubmitted = false;
  state.authNotice = '';
  render();
});

if (!location.hash) location.hash = '#/home';
initApp();
