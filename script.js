/* =============================================================================
   Developer Portfolio: script.js
   -----------------------------------------------------------------------------
   Vanilla JavaScript, no frameworks, no libraries, no build step.
   Everything you need to personalise lives in the CONFIG object below.

   Safety notes:
   - All dynamic text is inserted with textContent (never innerHTML, never eval).
   - No API keys, secrets or network calls apart from fetching the local
     portfolio.cpp file for the in-page source viewer.
   - Numbers marked "sample" are placeholder demo data, not real statistics.
   ============================================================================= */
'use strict';

/* =============================================================================
   1. CONFIG: EDIT THIS
   ============================================================================= */
const CONFIG = {
  profile: {
    name: 'Your Name',
    initials: 'YN',
    handle: '@your-username',
    email: 'you@example.com',
    location: 'Your City, Country',
    availability: 'Open to internships',
    focus: 'Currently focused on full-stack web and systems programming.',
    summary: "I'm a developer who enjoys turning messy problems into clean, fast, well-tested software, from responsive web apps to performance-minded C++.",
    roles: ['Software Developer', 'Full-Stack Web Developer', 'C++ & DSA Enthusiast', 'Problem Solver']
  },

  /* Leave a URL containing "your-username" (or empty) and the site will show a
     friendly "placeholder link" notice instead of navigating. */
  social: [
    { id: 'github', label: 'GitHub', icon: 'i-github', url: 'https://github.com/your-username' },
    { id: 'linkedin', label: 'LinkedIn', icon: 'i-linkedin', url: 'https://www.linkedin.com/in/your-username' },
    { id: 'website', label: 'Website', icon: 'i-globe', url: 'https://your-username.dev' }
  ],

  /* KPI widgets: SAMPLE values. Replace with your own. */
  kpis: [
    { label: 'Projects built', value: 12, suffix: '', icon: 'i-folder', color: 'var(--cyan)', trend: [3, 4, 4, 6, 7, 8, 9, 10, 12], note: 'sample · all time' },
    { label: 'Problems solved', value: 340, suffix: '+', icon: 'i-tree', color: 'var(--violet)', trend: [60, 95, 120, 160, 190, 230, 270, 310, 340], note: 'sample · DSA practice' },
    { label: 'Commits this year', value: 0, suffix: '', icon: 'i-code', color: 'var(--blue)', trend: [], note: 'from sample activity', fromActivity: true },
    { label: 'Current streak', value: 0, suffix: 'days', icon: 'i-flame', color: 'var(--amber)', trend: [], note: 'from sample activity', fromStreak: true }
  ],

  charts: {
    /* Activity is a SAMPLE series generated deterministically from this seed so
       the area chart and heatmap always agree. Replace generateActivity() with
       real data (an array of { date, count }) if you have it. */
    activity: { seed: 20260, unit: 'commits' },
    languages: [
      { name: 'JavaScript', pct: 34, color: '#22d3ee' },
      { name: 'C++', pct: 26, color: '#8b5cf6' },
      { name: 'Python', pct: 16, color: '#3b82f6' },
      { name: 'HTML/CSS', pct: 14, color: '#34d399' },
      { name: 'SQL', pct: 6, color: '#fbbf24' },
      { name: 'Other', pct: 4, color: '#fb7185' }
    ]
  },

  /* Self-assessed skill levels, 1–5. */
  skills: {
    Languages: [
      { name: 'C++', level: 4 }, { name: 'JavaScript', level: 4 }, { name: 'Python', level: 3 },
      { name: 'Java', level: 3 }, { name: 'SQL', level: 3 }
    ],
    Web: [
      { name: 'HTML & CSS', level: 5 }, { name: 'Responsive design', level: 4 }, { name: 'Node.js / Express', level: 3 },
      { name: 'React', level: 3 }, { name: 'REST APIs', level: 4 }
    ],
    Tools: [
      { name: 'Git & GitHub', level: 4 }, { name: 'Linux / Bash', level: 4 }, { name: 'Nginx', level: 3 },
      { name: 'Docker', level: 2 }, { name: 'AWS EC2', level: 3 }
    ],
    'CS Fundamentals': [
      { name: 'Data structures', level: 4 }, { name: 'Algorithms', level: 4 }, { name: 'OOP', level: 4 },
      { name: 'DBMS', level: 3 }, { name: 'Operating systems', level: 3 }
    ]
  },

  categories: [
    { id: 'all', label: 'All' },
    { id: 'web', label: 'Web Development' },
    { id: 'systems', label: 'Systems Programming' },
    { id: 'aiml', label: 'AI/ML' }
  ],

  /* Example projects. Empty link = placeholder (shows a notice). */
  projects: [
    {
      id: 'trado',
      name: 'Trado',
      featured: true,
      category: 'web',
      tagline: 'Paper-trading dashboard for learning the markets without risking money.',
      description: 'A responsive web app where beginners practise trading with virtual money, follow a watchlist and review their performance on clear charts.',
      problem: 'New investors lack a safe, simple place to practise and understand risk before using real money.',
      features: ['Virtual portfolio with buy/sell orders', 'Watchlist with price alerts', 'Performance charts and trade journal', 'Responsive dashboard UI'],
      stack: ['JavaScript', 'Node.js', 'Express', 'MongoDB', 'Chart rendering'],
      status: 'In progress', progress: 72, phase: 'Building portfolio analytics', nextMilestone: 'Trade journal export',
      preview: 'trading',
      links: { source: '', demo: '' }
    },
    {
      id: 'unihive',
      name: 'UniHive',
      category: 'web',
      tagline: 'Campus hub for clubs, events and study groups.',
      description: 'A community platform where students discover clubs, RSVP to events and form study groups for their courses.',
      problem: 'Campus information is scattered across chats and notice boards, so students miss events and struggle to find peers.',
      features: ['Club and event directory', 'RSVP and reminders', 'Course-based study groups', 'Role-based admin tools'],
      stack: ['React', 'Node.js', 'PostgreSQL', 'REST API'],
      status: 'Prototype', progress: 45, phase: 'User testing the prototype', nextMilestone: 'Study-group matching',
      preview: 'campus',
      links: { source: '', demo: '' }
    },
    {
      id: 'cpp-explorer',
      name: 'C++ Algorithm Explorer',
      category: 'systems',
      tagline: 'Menu-driven C++17 program that visualises classic algorithms in the terminal.',
      description: 'A console tool that runs and explains binary search, five sorting algorithms, BFS/DFS, Dijkstra, LCS and the Sieve of Eratosthenes, with input validation and step traces.',
      problem: 'Algorithms are easier to understand when you can feed in your own data and watch each step and its cost.',
      features: ['Binary search with step trace', 'Sort comparison: counts, timings, correctness check', 'BFS / DFS and Dijkstra on sample or custom graphs', 'LCS dynamic programming and prime sieve'],
      stack: ['C++17', 'STL', 'Algorithms', 'Data structures'],
      status: 'Complete', progress: 100, phase: 'Complete, compiles with zero warnings', nextMilestone: 'Add A* search and a test suite',
      preview: 'algo',
      links: { source: 'portfolio.cpp', demo: '' }
    }
  ],

  about: {
    intro: "I'm a software developer who likes understanding how things work under the hood and building tools people actually use.",
    body: 'I enjoy the whole path from a rough idea to a deployed product: designing the data model, writing clean and tested code, and polishing the interface until it feels effortless.',
    statement: 'Good software is simple to use, honest about its limits, and kind to the next developer.',
    interests: ['Full-stack web apps', 'Algorithms & competitive programming', 'Systems & performance', 'Cloud deployment'],
    strengths: ['Breaking problems into steps', 'Clean, readable code', 'Learning new tools fast', 'Clear communication']
  },

  techStack: [
    { group: 'Languages', icon: 'i-code', items: [{ name: 'C++' }, { name: 'JavaScript' }, { name: 'Python' }, { name: 'Java' }, { name: 'TypeScript', learning: true }] },
    { group: 'Web', icon: 'i-globe', items: [{ name: 'HTML5' }, { name: 'CSS3' }, { name: 'React' }, { name: 'Node.js' }, { name: 'Express' }] },
    { group: 'Databases', icon: 'i-db', items: [{ name: 'MySQL' }, { name: 'PostgreSQL' }, { name: 'MongoDB' }] },
    { group: 'Tools', icon: 'i-tool', items: [{ name: 'Git' }, { name: 'Linux' }, { name: 'VS Code' }, { name: 'Docker', learning: true }] },
    { group: 'Cloud & DevOps', icon: 'i-cloud', items: [{ name: 'AWS EC2' }, { name: 'Nginx' }, { name: 'CI/CD', learning: true }] },
    { group: 'DSA', icon: 'i-tree', items: [{ name: 'Graphs' }, { name: 'Dynamic programming' }, { name: 'Trees' }, { name: 'Sorting & searching' }] }
  ],

  timeline: [
    { date: 'Year 1', title: 'Started programming', text: 'Learned C and C++ fundamentals, problem solving and basic data structures.', tags: ['C', 'C++'] },
    { date: 'Year 1–2', title: 'Data structures & algorithms', text: 'Practised DSA regularly: graphs, dynamic programming, trees and complexity analysis.', tags: ['DSA', 'STL'] },
    { date: 'Year 2', title: 'Web development', text: 'Built responsive sites and full-stack apps with JavaScript, Node.js and SQL/NoSQL databases.', tags: ['JavaScript', 'Node.js', 'SQL'] },
    { date: 'Year 3', title: 'Projects & deployment', text: 'Shipped Trado and UniHive prototypes and learned to deploy static and Node apps on Linux with Nginx.', tags: ['Linux', 'Nginx', 'AWS'] },
    { date: 'Now', title: 'Looking for opportunities', text: 'Seeking internships and junior roles where I can learn from a strong team and ship real products.', tags: ['Open to work'], now: true }
  ],

  contact: {
    invitation: "I'm open to internships, junior roles and interesting collaborations. The quickest way to reach me is email."
  }
};

/* =============================================================================
   2. EARLY SETUP (runs immediately: script is loaded with defer)
   ============================================================================= */
const THEME_KEY = 'portfolio-theme';
const SIDEBAR_KEY = 'portfolio-sidebar';
const root = document.documentElement;
root.classList.add('js');

function storageGet(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
function storageSet(key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* private mode: ignore */ } }

(function applySavedTheme() {
  const saved = storageGet(THEME_KEY);
  root.setAttribute('data-theme', saved === 'light' ? 'light' : 'dark');
})();

const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
const reduceMotion = () => !!(motionQuery && motionQuery.matches);

/* =============================================================================
   3. SMALL HELPERS
   ============================================================================= */
const $ = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
const SVG_NS = 'http://www.w3.org/2000/svg';

/** Create an HTML element. children may be strings (set as text) or nodes. */
function el(tag, attrs, children) {
  const node = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach((k) => {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'style') Object.keys(v).forEach((p) => node.style.setProperty(p, v[p]));
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : String(v));
    });
  }
  appendChildren(node, children);
  return node;
}
function appendChildren(node, children) {
  if (children === undefined || children === null) return;
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c === null || c === undefined || c === false) return;
    node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  });
}
/** Create an SVG element. */
function svgEl(tag, attrs, children) {
  const node = document.createElementNS(SVG_NS, tag);
  if (attrs) Object.keys(attrs).forEach((k) => {
    if (attrs[k] === null || attrs[k] === undefined) return;
    if (k === 'text') node.textContent = attrs[k];
    else node.setAttribute(k, String(attrs[k]));
  });
  appendChildren(node, children);
  return node;
}
/** Sprite icon <svg class="icon"><use href="#id"/></svg> */
function icon(id, extra) {
  const s = svgEl('svg', { class: 'icon' + (extra ? ' ' + extra : ''), 'aria-hidden': 'true', focusable: 'false' });
  s.appendChild(svgEl('use', { href: '#' + id }));
  return s;
}
function getPath(obj, path) { return path.split('.').reduce((o, k) => (o && k in o ? o[k] : undefined), obj); }
const fmt = (n) => Number(n).toLocaleString('en-US');
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fmtDay = (d) => DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
const fmtShort = (d) => MONTHS[d.getMonth()] + ' ' + d.getDate();
function isPlaceholderUrl(url) { return !url || /your-username|example\.com/i.test(url); }

/** Seeded PRNG (mulberry32) so sample data is stable between visits. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Run an init step without letting one failure break the rest of the page. */
function safe(name, fn) {
  try { fn(); } catch (err) { console.warn('[portfolio] ' + name + ' failed:', err); }
}

/* =============================================================================
   4. TOAST + TOOLTIP
   ============================================================================= */
let toastTimer = 0;
function toast(message) {
  const t = $('#toast');
  const txt = $('#toastText');
  if (!t || !txt) return;
  txt.textContent = message;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

const Tooltip = {
  node: null,
  show(rows, x, y) {
    const tt = this.node || (this.node = $('#tooltip'));
    if (!tt) return;
    tt.textContent = '';
    rows.forEach((r) => {
      if (r.k) tt.appendChild(el('span', { class: 'tt-k', text: r.k }));
      if (r.v) {
        const line = el('span', { class: 'tt-v' });
        if (r.color) line.appendChild(el('span', { class: 'tt-sw', style: { background: r.color } }));
        line.appendChild(document.createTextNode(r.v));
        tt.appendChild(line);
      }
    });
    tt.classList.add('show');
    const w = tt.offsetWidth, h = tt.offsetHeight;
    let left = x + 14, top = y - h - 12;
    if (left + w > window.innerWidth - 8) left = x - w - 14;
    if (top < 8) top = y + 16;
    left = clamp(left, 8, Math.max(8, window.innerWidth - w - 8));
    top = clamp(top, 8, Math.max(8, window.innerHeight - h - 8));
    tt.style.transform = 'translate(' + Math.round(left) + 'px,' + Math.round(top) + 'px)';
  },
  showAt(rows, element) {
    const r = element.getBoundingClientRect();
    this.show(rows, r.left + r.width / 2, r.top);
  },
  hide() { if (this.node) this.node.classList.remove('show'); }
};

/* =============================================================================
   5. SAMPLE ACTIVITY DATA (shared by the area chart, heatmap and KPIs)
   ============================================================================= */
function generateActivity(seed) {
  const rand = mulberry32(seed);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const progress = (364 - i) / 364;               // slow upward trend over the year
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const restDay = rand() < (weekend ? 0.38 : 0.14); // some days off
    let count = 0;
    if (!restDay) {
      const base = 2 + progress * 5 + Math.sin((364 - i) / 18) * 1.6;
      count = Math.max(0, Math.round(base * (weekend ? 0.6 : 1) + (rand() - 0.35) * 5));
      if (rand() < 0.04) count += 6 + Math.round(rand() * 6); // occasional big push
    }
    days.push({ date: d, count: count });
  }
  return days;
}
const ACTIVITY = generateActivity(CONFIG.charts.activity.seed);

function activityStats(days) {
  let total = 0, active = 0, longest = 0, run = 0, best = { count: -1, date: null };
  days.forEach((d) => {
    total += d.count;
    if (d.count > 0) { active++; run++; longest = Math.max(longest, run); } else run = 0;
    if (d.count > best.count) best = d;
  });
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current++;
    else if (i === days.length - 1) continue; // today not done yet is fine
    else break;
  }
  return { total: total, active: active, longest: longest, current: current, best: best };
}
const ACT_STATS = activityStats(ACTIVITY);

/** Aggregate the daily series for a range. */
function seriesFor(range) {
  if (range === '7d' || range === '30d') {
    const n = range === '7d' ? 7 : 30;
    return ACTIVITY.slice(-n).map((d) => ({ label: fmtShort(d.date), tip: fmtDay(d.date), value: d.count }));
  }
  if (range === '90d') {
    const slice = ACTIVITY.slice(-91);
    const out = [];
    for (let i = 0; i < slice.length; i += 7) {
      const wk = slice.slice(i, i + 7);
      out.push({
        label: fmtShort(wk[0].date),
        tip: 'Week of ' + fmtShort(wk[0].date) + ' – ' + fmtShort(wk[wk.length - 1].date),
        value: wk.reduce((s, d) => s + d.count, 0)
      });
    }
    return out;
  }
  // 1y: monthly totals, oldest first (12 buckets ending with the current month)
  const map = new Map();
  ACTIVITY.forEach((d) => {
    const key = d.date.getFullYear() * 12 + d.date.getMonth();
    if (!map.has(key)) map.set(key, { y: d.date.getFullYear(), m: d.date.getMonth(), value: 0 });
    map.get(key).value += d.count;
  });
  return Array.from(map.values()).slice(-12).map((b) => ({
    label: MONTHS[b.m], tip: MONTHS[b.m] + ' ' + b.y + (b.y === new Date().getFullYear() && b.m === new Date().getMonth() ? ' (month to date)' : ''), value: b.value
  }));
}

/* =============================================================================
   6. TEXT BINDINGS, THEME, CLOCK, ROLE TYPER
   ============================================================================= */
function initBindings() {
  $$('[data-bind]').forEach((node) => {
    const v = getPath(CONFIG, node.getAttribute('data-bind'));
    if (typeof v === 'string' && v) node.textContent = v;
  });
  const email = CONFIG.profile.email;
  const link = $('#emailLink');
  if (link) link.setAttribute('href', 'mailto:' + email);
  document.title = CONFIG.profile.name + ' · Software Developer Portfolio';
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
}

function initTheme() {
  const btn = $('#themeToggle');
  const meta = document.querySelector('meta[name="theme-color"]');
  const sync = () => {
    const light = root.getAttribute('data-theme') === 'light';
    if (btn) {
      btn.setAttribute('aria-pressed', String(light));
      btn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
      btn.title = light ? 'Dark theme' : 'Light theme';
    }
    if (meta) meta.setAttribute('content', light ? '#f4f6fb' : '#060a14');
  };
  sync();
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    storageSet(THEME_KEY, next);
    sync();
    toast(next === 'light' ? 'Light theme on' : 'Dark theme on');
  });
}

function initClock() {
  const dateEl = $('#clockDate'), timeEl = $('#clockTime');
  if (!dateEl || !timeEl) return;
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    const now = new Date();
    dateEl.textContent = DAYS[now.getDay()] + ' ' + now.getDate() + ' ' + MONTHS[now.getMonth()];
    timeEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    timeEl.setAttribute('datetime', now.toISOString());
  };
  tick();
  setInterval(tick, 1000);
}

function initRoleTyper() {
  const node = $('#roleText');
  const roles = CONFIG.profile.roles || [];
  if (!node || !roles.length) return;
  node.textContent = roles[0];
  if (roles.length < 2) return;
  let idx = 0;
  if (reduceMotion()) {
    setInterval(() => { idx = (idx + 1) % roles.length; node.textContent = roles[idx]; }, 3200);
    return;
  }
  let chars = roles[0].length, deleting = true;
  const step = () => {
    const word = roles[idx];
    if (deleting) {
      chars--;
      node.textContent = word.slice(0, chars);
      if (chars <= 0) { deleting = false; idx = (idx + 1) % roles.length; return setTimeout(step, 320); }
      return setTimeout(step, 34);
    }
    const target = roles[idx];
    chars++;
    node.textContent = target.slice(0, chars);
    if (chars >= target.length) { deleting = true; return setTimeout(step, 2200); }
    return setTimeout(step, 62);
  };
  setTimeout(step, 2400);
}

/* =============================================================================
   7. SIDEBAR, MOBILE NAV, ACTIVE SECTION, REVEALS, BACK-TO-TOP
   ============================================================================= */
function initSidebar() {
  const body = document.body;
  const collapseBtn = $('#collapseBtn');
  const menuBtn = $('#menuBtn');
  const closeBtn = $('#sidebarClose');
  const scrim = $('#navScrim');
  const sidebar = $('#sidebar');
  const mobile = () => window.matchMedia('(max-width: 960px)').matches;

  const setCollapsed = (on) => {
    body.classList.toggle('sidebar-collapsed', on);
    if (collapseBtn) {
      collapseBtn.setAttribute('aria-expanded', String(!on));
      collapseBtn.setAttribute('aria-label', on ? 'Expand sidebar' : 'Collapse sidebar');
    }
  };
  setCollapsed(storageGet(SIDEBAR_KEY) === 'collapsed');
  if (collapseBtn) collapseBtn.addEventListener('click', () => {
    const on = !body.classList.contains('sidebar-collapsed');
    setCollapsed(on);
    storageSet(SIDEBAR_KEY, on ? 'collapsed' : 'expanded');
  });

  const openNav = () => {
    body.classList.add('nav-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    const first = $('#navList a');
    if (first) setTimeout(() => first.focus(), 60);
  };
  const closeNav = (restore) => {
    if (!body.classList.contains('nav-open')) return;
    body.classList.remove('nav-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      if (restore) menuBtn.focus();
    }
  };
  if (menuBtn) menuBtn.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', () => closeNav(true));
  if (scrim) scrim.addEventListener('click', () => closeNav(true));
  $$('#navList a').forEach((a) => a.addEventListener('click', () => { if (mobile()) closeNav(false); }));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('nav-open')) closeNav(true);
    // keep keyboard focus inside the open drawer
    if (e.key === 'Tab' && body.classList.contains('nav-open') && mobile() && sidebar) {
      const items = $$('a, button', sidebar).filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize', () => { if (!mobile()) closeNav(false); });
}

function initActiveSection() {
  const links = $$('#navList a');
  const crumb = $('#crumb');
  const sections = links.map((a) => document.getElementById(a.getAttribute('data-section'))).filter(Boolean);
  const setActive = (id) => {
    links.forEach((a) => {
      if (a.getAttribute('data-section') === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    const link = links.find((a) => a.getAttribute('data-section') === id);
    if (crumb && link) crumb.textContent = link.textContent.replace(/\d+$/, '').trim();
  };
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach((s) => io.observe(s));
}

/** Calls cb once when the element first becomes visible. */
function onFirstVisible(node, cb, threshold) {
  if (!node) return;
  if (!('IntersectionObserver' in window)) { cb(); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { io.disconnect(); cb(); } });
  }, { threshold: threshold === undefined ? 0.2 : threshold });
  io.observe(node);
}

function initReveals() {
  const nodes = $$('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduceMotion()) { nodes.forEach((n) => n.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  nodes.forEach((n) => io.observe(n));
}

function initBackToTop() {
  const btn = $('#toTop');
  if (!btn) return;
  const sync = () => btn.classList.toggle('show', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' });
    const home = $('#home');
    if (home) home.focus({ preventScroll: true });
  });
}

/* =============================================================================
   8. KPI WIDGETS
   ============================================================================= */
function sparkPaths(values, w, h) {
  if (!values.length) return { line: '', area: '' };
  const min = Math.min.apply(null, values), max = Math.max.apply(null, values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [values.length === 1 ? w / 2 : (i / (values.length - 1)) * w, h - 3 - ((v - min) / span) * (h - 6)]);
  const line = monotonePath(pts);
  return { line: line, area: line + ' L' + w + ',' + h + ' L0,' + h + ' Z' };
}

function initKpis() {
  const grid = $('#kpiGrid');
  if (!grid) return;
  // derive monthly trends for activity-based KPIs
  const monthly = seriesFor('1y').map((b) => b.value);
  const cumulative = monthly.reduce((acc, v) => { acc.push((acc.length ? acc[acc.length - 1] : 0) + v); return acc; }, []);
  const weeklyActive = [];
  for (let i = ACTIVITY.length - 63; i < ACTIVITY.length; i += 7) weeklyActive.push(ACTIVITY.slice(i, i + 7).filter((d) => d.count > 0).length);

  const counters = [];
  CONFIG.kpis.forEach((k) => {
    let value = k.value, trend = k.trend;
    if (k.fromActivity) { value = ACT_STATS.total; trend = cumulative; }
    if (k.fromStreak) { value = ACT_STATS.current; trend = weeklyActive; }
    const valueSpan = el('span', { text: '0' });
    const card = el('article', { class: 'card kpi', style: { '--kpi-c': k.color } }, [
      el('div', { class: 'kpi-top' }, [
        el('span', { class: 'kpi-label', text: k.label }),
        el('span', { class: 'kpi-icon' }, icon(k.icon))
      ]),
      el('div', { class: 'kpi-value' }, [valueSpan, k.suffix ? el('small', { text: k.suffix }) : null]),
      el('div', { class: 'kpi-foot' }, [el('span', { class: 'kpi-note', text: k.note })])
    ]);
    const p = sparkPaths(trend, 96, 34);
    const spark = svgEl('svg', { class: 'spark', viewBox: '0 0 96 34', preserveAspectRatio: 'none', 'aria-hidden': 'true' }, [
      svgEl('path', { class: 'a', d: p.area }), svgEl('path', { class: 'l', d: p.line })
    ]);
    card.querySelector('.kpi-foot').appendChild(spark);
    card.setAttribute('aria-label', k.label + ': ' + fmt(value) + (k.suffix ? ' ' + k.suffix : '') + ' (' + k.note + ')');
    grid.appendChild(card);
    counters.push({ node: valueSpan, value: value });
  });

  const run = () => {
    if (reduceMotion()) { counters.forEach((c) => { c.node.textContent = fmt(c.value); }); return; }
    const start = performance.now(), dur = 1200;
    const frame = (t) => {
      const p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 3);
      counters.forEach((c) => { c.node.textContent = fmt(Math.round(c.value * e)); });
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  onFirstVisible(grid, run, 0.3);
}

/* =============================================================================
   9. AREA CHART (SVG, monotone cubic, tooltips, keyboard, draw animation)
   ============================================================================= */
/** Monotone cubic interpolation (Fritsch–Carlson) → SVG path data. */
function monotonePath(pts) {
  const n = pts.length;
  if (!n) return '';
  if (n === 1) return 'M' + pts[0][0] + ',' + pts[0][1];
  const dx = [], m = [], t = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    m[i] = dx[i] === 0 ? 0 : (pts[i + 1][1] - pts[i][1]) / dx[i];
  }
  t[0] = m[0]; t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
    const a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
    if (s > 9) { const tau = 3 / Math.sqrt(s); t[i] = tau * a * m[i]; t[i + 1] = tau * b * m[i]; }
  }
  const r = (v) => Math.round(v * 100) / 100;
  let d = 'M' + r(pts[0][0]) + ',' + r(pts[0][1]);
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ' C' + r(pts[i][0] + h) + ',' + r(pts[i][1] + t[i] * h) + ' ' + r(pts[i + 1][0] - h) + ',' + r(pts[i + 1][1] - t[i + 1] * h) + ' ' + r(pts[i + 1][0]) + ',' + r(pts[i + 1][1]);
  }
  return d;
}
function niceMax(v) {
  if (v <= 0) return 4;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * exp;
}

function initAreaChart() {
  const box = $('#activityChart');
  const group = $('#rangeGroup');
  const statsEl = $('#actStats');
  const summary = $('#actSummary');
  const sub = $('#actSub');
  if (!box || !group) return;
  const unit = CONFIG.charts.activity.unit;
  const labels = { '7d': 'last 7 days, daily', '30d': 'last 30 days, daily', '90d': 'last 90 days, weekly totals', '1y': 'last 12 months, monthly totals' };
  const state = { range: '1y', data: [], pts: [], active: -1, drawn: false, visible: false, w: 0, h: 0 };
  let svg, guide, dot;

  function renderStats() {
    const vals = state.data.map((d) => d.value);
    const total = vals.reduce((s, v) => s + v, 0);
    const avg = vals.length ? total / vals.length : 0;
    const peakIdx = vals.indexOf(Math.max.apply(null, vals));
    statsEl.textContent = '';
    [['Total', fmt(total) + ' ' + unit], ['Average', (Math.round(avg * 10) / 10) + ' / ' + (state.range === '90d' ? 'week' : state.range === '1y' ? 'month' : 'day')], ['Peak', state.data[peakIdx] ? state.data[peakIdx].label + ' · ' + fmt(vals[peakIdx]) : '—']]
      .forEach((p) => statsEl.appendChild(el('div', null, [el('span', { class: 'stat-k', text: p[0] }), el('span', { class: 'stat-v', text: p[1] })])));
    if (sub) sub.textContent = 'Commits, ' + labels[state.range] + ' (sample data)';
    if (summary) summary.textContent = 'Showing ' + labels[state.range] + '. Total ' + fmt(total) + ' ' + unit + '.';
  }

  function render(animate) {
    const w = Math.max(240, box.clientWidth), h = Math.max(160, box.clientHeight);
    state.w = w; state.h = h;
    const pad = { l: 38, r: 14, t: 14, b: 28 };
    const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
    const data = state.data;
    const max = niceMax(Math.max.apply(null, data.map((d) => d.value)) * 1.1);
    const x = (i) => pad.l + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
    const y = (v) => pad.t + ih - (v / max) * ih;
    state.pts = data.map((d, i) => [x(i), y(d.value)]);

    box.textContent = '';
    svg = svgEl('svg', { viewBox: '0 0 ' + w + ' ' + h, width: w, height: h, 'aria-hidden': 'true' });
    const defs = svgEl('defs');
    defs.appendChild(svgEl('linearGradient', { id: 'lineGrad', x1: '0', y1: '0', x2: '1', y2: '0' }, [
      svgEl('stop', { offset: '0%', class: 'stop-cyan' }), svgEl('stop', { offset: '55%', class: 'stop-blue' }), svgEl('stop', { offset: '100%', class: 'stop-violet' })
    ]));
    defs.appendChild(svgEl('linearGradient', { id: 'areaGrad', x1: '0', y1: '0', x2: '0', y2: '1' }, [
      svgEl('stop', { offset: '0%', class: 'stop-cyan', 'stop-opacity': '0.32' }), svgEl('stop', { offset: '100%', class: 'stop-blue', 'stop-opacity': '0' })
    ]));
    svg.appendChild(defs);

    const axis = svgEl('g', { class: 'axis' });
    for (let i = 0; i <= 4; i++) {
      const v = (max / 4) * i, yy = Math.round(y(v)) + 0.5;
      axis.appendChild(svgEl('line', { class: 'grid-line', x1: pad.l, x2: w - pad.r, y1: yy, y2: yy }));
      axis.appendChild(svgEl('text', { x: pad.l - 8, y: yy + 3.5, 'text-anchor': 'end', text: fmt(Math.round(v)) }));
    }
    const maxLabels = Math.max(2, Math.floor(iw / 58));
    const every = Math.max(1, Math.ceil(data.length / maxLabels));
    data.forEach((d, i) => {
      if (i % every !== 0 && i !== data.length - 1) return;
      if (i !== data.length - 1 && data.length - 1 - i < every * 0.6) return;
      axis.appendChild(svgEl('text', { x: x(i), y: h - 8, 'text-anchor': i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle', text: d.label }));
    });
    svg.appendChild(axis);

    const linePath = monotonePath(state.pts);
    const layer = svgEl('g', { class: 'chart-layer' });
    const area = svgEl('path', { class: 'area-fill', d: linePath + ' L' + x(data.length - 1) + ',' + (pad.t + ih) + ' L' + x(0) + ',' + (pad.t + ih) + ' Z' });
    const line = svgEl('path', { class: 'area-line', d: linePath });
    layer.appendChild(area);
    layer.appendChild(line);
    if (data.length <= 31) state.pts.forEach((p) => layer.appendChild(svgEl('circle', { class: 'pt', cx: p[0], cy: p[1], r: data.length <= 12 ? 3.5 : 2.4 })));
    svg.appendChild(layer);

    guide = svgEl('line', { class: 'guide', y1: pad.t, y2: pad.t + ih, x1: -10, x2: -10, opacity: 0 });
    dot = svgEl('circle', { class: 'hover-dot', r: 5, cx: -10, cy: -10, opacity: 0 });
    svg.appendChild(guide);
    svg.appendChild(dot);
    box.appendChild(svg);

    if (animate && !reduceMotion()) {
      const len = line.getTotalLength ? line.getTotalLength() : 1000;
      line.style.strokeDasharray = len + ' ' + len;
      line.style.strokeDashoffset = String(len);
      area.style.opacity = '0';
      line.getBoundingClientRect();
      line.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.2,.7,.2,1)';
      area.style.transition = 'opacity .9s ease .25s';
      requestAnimationFrame(() => { line.style.strokeDashoffset = '0'; area.style.opacity = '1'; });
      setTimeout(() => { line.style.strokeDasharray = ''; line.style.strokeDashoffset = ''; line.style.transition = ''; }, 1300);
    }
    if (state.active >= 0) highlight(state.active, false);
  }

  function highlight(i, withTooltip) {
    if (!state.pts.length) return;
    i = clamp(i, 0, state.pts.length - 1);
    state.active = i;
    const p = state.pts[i], d = state.data[i];
    guide.setAttribute('x1', p[0]); guide.setAttribute('x2', p[0]); guide.setAttribute('opacity', 1);
    dot.setAttribute('cx', p[0]); dot.setAttribute('cy', p[1]); dot.setAttribute('opacity', 1);
    if (withTooltip !== false) {
      const r = box.getBoundingClientRect();
      const sx = r.left + (p[0] / state.w) * r.width, sy = r.top + (p[1] / state.h) * r.height;
      Tooltip.show([{ k: d.tip }, { v: fmt(d.value) + ' ' + unit, color: 'var(--cyan)' }], sx, sy);
    }
    if (summary) summary.textContent = d.tip + ': ' + fmt(d.value) + ' ' + unit;
  }
  function clearHighlight() {
    state.active = -1;
    if (guide) guide.setAttribute('opacity', 0);
    if (dot) dot.setAttribute('opacity', 0);
    Tooltip.hide();
  }
  function nearest(clientX) {
    const r = box.getBoundingClientRect();
    const xx = ((clientX - r.left) / r.width) * state.w;
    let best = 0, bd = Infinity;
    state.pts.forEach((p, i) => { const dd = Math.abs(p[0] - xx); if (dd < bd) { bd = dd; best = i; } });
    return best;
  }

  box.addEventListener('pointermove', (e) => highlight(nearest(e.clientX)));
  box.addEventListener('pointerdown', (e) => highlight(nearest(e.clientX)));
  box.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') clearHighlight(); });
  document.addEventListener('pointerdown', (e) => { if (state.active >= 0 && !box.contains(e.target)) clearHighlight(); });
  box.addEventListener('blur', clearHighlight);
  box.addEventListener('keydown', (e) => {
    const n = state.pts.length;
    if (!n) return;
    let i = state.active < 0 ? n - 1 : state.active;
    if (e.key === 'ArrowRight') i++;
    else if (e.key === 'ArrowLeft') i--;
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = n - 1;
    else if (e.key === 'Escape') { clearHighlight(); return; }
    else return;
    e.preventDefault();
    highlight(i);
  });

  function setRange(range) {
    state.range = range;
    state.data = seriesFor(range);
    state.active = -1;
    Tooltip.hide();
    $$('button', group).forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-range') === range)));
    box.setAttribute('data-range', range);
    renderStats();
    render(state.visible);
  }
  $$('button', group).forEach((b) => b.addEventListener('click', () => setRange(b.getAttribute('data-range'))));

  state.data = seriesFor(state.range);
  box.setAttribute('data-range', state.range);
  renderStats();
  render(false);
  onFirstVisible(box, () => { state.visible = true; render(true); }, 0.35);

  let lastW = box.clientWidth;
  const onResize = () => { if (Math.abs(box.clientWidth - lastW) > 1) { lastW = box.clientWidth; render(false); } };
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(box);
  else window.addEventListener('resize', onResize);
}

/* =============================================================================
   10. DONUT CHART
   ============================================================================= */
function initDonut() {
  const host = $('#donut'), legend = $('#donutLegend');
  if (!host || !legend) return;
  const langs = CONFIG.charts.languages;
  const total = langs.reduce((s, l) => s + l.pct, 0) || 1;
  const R = 80, C = 2 * Math.PI * R, GAP = langs.length > 1 ? 2.2 : 0;
  const svg = svgEl('svg', { viewBox: '0 0 200 200', 'aria-hidden': 'true' });
  svg.appendChild(svgEl('circle', { class: 'track', cx: 100, cy: 100, r: R }));
  const center = el('div', { class: 'donut-center' }, [el('span', { class: 'dc-v', text: String(langs.length) }), el('span', { class: 'dc-k', text: 'languages' })]);
  const [cv, ck] = center.children;
  const arcs = [], buttons = [];
  let offset = 0;

  const setActive = (i, evt) => {
    host.classList.toggle('has-active', i >= 0);
    arcs.forEach((a, j) => a.classList.toggle('active', j === i));
    buttons.forEach((b, j) => { b.classList.toggle('active', j === i); b.setAttribute('aria-pressed', String(j === i)); });
    if (i < 0) { cv.textContent = String(langs.length); ck.textContent = 'languages'; Tooltip.hide(); return; }
    const l = langs[i];
    cv.textContent = Math.round((l.pct / total) * 100) + '%';
    ck.textContent = l.name;
    const rows = [{ k: 'Language (sample)' }, { v: l.name + ' · ' + Math.round((l.pct / total) * 100) + '%', color: l.color }];
    if (evt && evt.clientX !== undefined && evt.pointerType !== undefined) Tooltip.show(rows, evt.clientX, evt.clientY);
    else Tooltip.showAt(rows, evt && evt.currentTarget ? evt.currentTarget : host);
  };

  langs.forEach((l, i) => {
    const len = Math.max(0, (l.pct / total) * C - GAP);
    const arc = svgEl('circle', {
      class: 'seg-arc', cx: 100, cy: 100, r: R, stroke: l.color,
      'stroke-dasharray': (reduceMotion() ? len : 0) + ' ' + C, 'stroke-dashoffset': -offset
    });
    arc.dataset.len = String(len);
    arc.addEventListener('pointerenter', (e) => setActive(i, e));
    arc.addEventListener('pointermove', (e) => Tooltip.show([{ k: 'Language (sample)' }, { v: l.name + ' · ' + Math.round((l.pct / total) * 100) + '%', color: l.color }], e.clientX, e.clientY));
    arc.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') setActive(-1); });
    svg.appendChild(arc);
    arcs.push(arc);
    offset += (l.pct / total) * C;

    const btn = el('button', { type: 'button', 'aria-pressed': 'false', 'aria-label': l.name + ' ' + Math.round((l.pct / total) * 100) + ' percent' }, [
      el('span', { class: 'sw', style: { background: l.color } }), el('span', { text: l.name }), el('span', { class: 'pct', text: Math.round((l.pct / total) * 100) + '%' })
    ]);
    btn.addEventListener('mouseenter', (e) => setActive(i, e));
    btn.addEventListener('mouseleave', () => setActive(-1));
    btn.addEventListener('focus', (e) => setActive(i, e));
    btn.addEventListener('blur', () => setActive(-1));
    btn.addEventListener('click', (e) => setActive(btn.classList.contains('active') && e.detail > 0 ? -1 : i, e));
    legend.appendChild(btn);
    buttons.push(btn);
  });
  host.appendChild(svg);
  host.appendChild(center);
  host.setAttribute('role', 'img');
  host.setAttribute('aria-label', 'Language mix (sample): ' + langs.map((l) => l.name + ' ' + Math.round((l.pct / total) * 100) + '%').join(', '));
  if (!reduceMotion()) onFirstVisible(host, () => requestAnimationFrame(() => arcs.forEach((a) => a.setAttribute('stroke-dasharray', a.dataset.len + ' ' + C))), 0.3);
}

/* =============================================================================
   11. CONTRIBUTION HEATMAP
   ============================================================================= */
function initHeatmap() {
  const host = $('#heatmap'), statsEl = $('#heatStats'), scroller = $('#heatScroll');
  if (!host) return;
  const level = (c) => (c === 0 ? 0 : c <= 2 ? 1 : c <= 5 ? 2 : c <= 8 ? 3 : 4);
  const first = ACTIVITY[0].date;
  const lead = first.getDay();                 // empty cells before the first day
  const totalCells = lead + ACTIVITY.length;
  const weeks = Math.ceil(totalCells / 7);

  const months = el('div', { class: 'heat-months', 'aria-hidden': 'true', style: { 'grid-template-columns': 'repeat(' + weeks + ', 1fr)' } });
  let lastMonth = -1;
  ACTIVITY.forEach((d, idx) => {
    const week = Math.floor((idx + lead) / 7);
    if (d.date.getMonth() !== lastMonth && d.date.getDate() <= 7 && week < weeks - 1) {
      lastMonth = d.date.getMonth();
      months.appendChild(el('span', { text: MONTHS[lastMonth], style: { 'grid-column': (week + 1) + ' / span 3' } }));
    }
  });

  const dayLabels = el('div', { class: 'heat-days', 'aria-hidden': 'true' });
  DAYS.forEach((d, i) => dayLabels.appendChild(el('span', { text: i % 2 === 1 ? d : '' })));

  const grid = el('div', { class: 'heat-grid', role: 'grid', 'aria-label': 'Daily contributions, last 12 months (sample data). Use arrow keys to move between days.', style: { 'grid-template-columns': 'repeat(' + weeks + ', 1fr)' } });
  const cells = [];
  for (let i = 0; i < lead; i++) grid.appendChild(el('span', { class: 'cell empty', 'aria-hidden': 'true' }));
  ACTIVITY.forEach((d, i) => {
    const label = d.count + ' ' + CONFIG.charts.activity.unit + ' on ' + fmtDay(d.date);
    const c = el('span', { class: 'cell lv' + level(d.count), role: 'gridcell', tabindex: i === ACTIVITY.length - 1 ? '0' : '-1', 'aria-label': label });
    c.dataset.i = String(i);
    grid.appendChild(c);
    cells.push(c);
  });
  const tip = (c) => {
    const d = ACTIVITY[Number(c.dataset.i)];
    Tooltip.showAt([{ k: fmtDay(d.date) }, { v: (d.count === 0 ? 'No ' : fmt(d.count) + ' ') + CONFIG.charts.activity.unit, color: getComputedStyle(c).backgroundColor }], c);
  };
  grid.addEventListener('pointerover', (e) => { if (e.target.dataset && e.target.dataset.i) tip(e.target); });
  grid.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') Tooltip.hide(); });
  document.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch' && !(e.target.closest && e.target.closest('#activityChart, #donut, #donutLegend, #heatmap'))) Tooltip.hide(); });
  grid.addEventListener('focusin', (e) => { if (e.target.dataset && e.target.dataset.i) tip(e.target); });
  grid.addEventListener('focusout', () => Tooltip.hide());
  grid.addEventListener('keydown', (e) => {
    const cur = Number(document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.i : NaN);
    if (Number.isNaN(cur)) return;
    const moves = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7, Home: -cur, End: cells.length - 1 - cur };
    if (!(e.key in moves)) { if (e.key === 'Escape') Tooltip.hide(); return; }
    e.preventDefault();
    const next = clamp(cur + moves[e.key], 0, cells.length - 1);
    cells[cur].setAttribute('tabindex', '-1');
    cells[next].setAttribute('tabindex', '0');
    cells[next].focus();
  });
  grid.addEventListener('click', (e) => {
    const c = e.target;
    if (!c.dataset || !c.dataset.i) return;
    cells.forEach((x) => x.setAttribute('tabindex', '-1'));
    c.setAttribute('tabindex', '0');
    tip(c);
  });

  host.appendChild(months);
  host.appendChild(el('div', { class: 'heat-body' }, [dayLabels, grid]));
  if (scroller) scroller.scrollLeft = scroller.scrollWidth; // show most recent weeks first on small screens

  if (statsEl) {
    const s = ACT_STATS;
    [['Total', fmt(s.total)], ['Active days', fmt(s.active)], ['Longest streak', s.longest + 'd'], ['Current streak', s.current + 'd']]
      .forEach((p) => statsEl.appendChild(el('span', null, [p[0] + ': ', el('b', { text: p[1] })])));
  }
}

/* =============================================================================
   12. SKILL BARS (tabs per category)
   ============================================================================= */
function initSkills() {
  const tabs = $('#skillTabs'), list = $('#skillList');
  if (!tabs || !list) return;
  const cats = Object.keys(CONFIG.skills);
  const words = ['', 'Learning', 'Basic', 'Comfortable', 'Strong', 'Advanced'];
  let current = 0, shown = false;
  const buttons = cats.map((c, i) => el('button', { type: 'button', role: 'tab', id: 'skill-tab-' + i, 'aria-selected': String(i === 0), 'aria-controls': 'skillList', tabindex: i === 0 ? '0' : '-1', text: c }));

  const render = () => {
    list.textContent = '';
    list.setAttribute('aria-labelledby', 'skill-tab-' + current);
    const bars = [];
    CONFIG.skills[cats[current]].forEach((s) => {
      const lvl = clamp(s.level, 1, 5);
      const fill = el('i');
      bars.push([fill, (lvl / 5) * 100]);
      list.appendChild(el('div', { class: 'skill-row' }, [
        el('div', { class: 'skill-meta' }, [el('span', { text: s.name }), el('span', { text: words[lvl] + ' · ' + lvl + '/5' })]),
        el('div', { class: 'bar', role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': '5', 'aria-valuenow': String(lvl), 'aria-label': s.name + ' self-assessed ' + lvl + ' of 5' }, fill)
      ]));
    });
    const fillAll = () => bars.forEach((b) => { b[0].style.width = b[1] + '%'; });
    if (shown || reduceMotion()) requestAnimationFrame(() => requestAnimationFrame(fillAll));
    else onFirstVisible(list, () => { shown = true; requestAnimationFrame(fillAll); }, 0.2);
  };
  const select = (i, focus) => {
    current = (i + cats.length) % cats.length;
    buttons.forEach((b, j) => { b.setAttribute('aria-selected', String(j === current)); b.setAttribute('tabindex', j === current ? '0' : '-1'); });
    if (focus) buttons[current].focus();
    render();
  };
  buttons.forEach((b, i) => {
    b.addEventListener('click', () => select(i, false));
    b.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); select(current + 1, true); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); select(current - 1, true); }
      else if (e.key === 'Home') { e.preventDefault(); select(0, true); }
      else if (e.key === 'End') { e.preventDefault(); select(cats.length - 1, true); }
    });
    tabs.appendChild(b);
  });
  render();
}

/* =============================================================================
   13. PROJECT PROGRESS CHART
   ============================================================================= */
const CAT_COLORS = { web: 'var(--cyan)', systems: 'var(--violet)', aiml: 'var(--amber)' };
const catLabel = (id) => (CONFIG.categories.find((c) => c.id === id) || { label: id }).label;
const statusColor = (s) => (/complete/i.test(s) ? 'var(--green)' : /progress/i.test(s) ? 'var(--cyan)' : 'var(--amber)');

function initProgress() {
  const list = $('#progList'), detail = $('#progDetail'), cats = $('#progCats');
  if (!list || !detail) return;
  const used = Array.from(new Set(CONFIG.projects.map((p) => p.category)));
  if (cats) used.forEach((c) => cats.appendChild(el('span', null, [el('i', { style: { background: CAT_COLORS[c] || 'var(--blue)' } }), catLabel(c)])));
  const rows = [], fills = [];
  const showDetail = (p) => {
    detail.textContent = '';
    detail.appendChild(el('h4', { text: p.name + ' · ' + p.progress + '%' }));
    detail.appendChild(el('dl', null, [
      el('dt', { text: 'Status' }), el('dd', { text: p.status }),
      el('dt', { text: 'Phase' }), el('dd', { text: p.phase }),
      el('dt', { text: 'Next' }), el('dd', { text: p.nextMilestone })
    ]));
  };
  CONFIG.projects.forEach((p, i) => {
    const fill = el('i', { style: { '--pc': CAT_COLORS[p.category] || 'var(--blue)' } });
    fills.push([fill, p.progress]);
    const row = el('button', { type: 'button', class: 'prog-row', 'aria-pressed': String(i === 0), 'aria-label': p.name + ', ' + p.progress + ' percent complete' }, [
      el('span', { class: 'prog-name', text: p.name }),
      el('span', { class: 'bar' }, fill),
      el('span', { class: 'prog-pct', text: p.progress + '%' })
    ]);
    row.addEventListener('click', () => { rows.forEach((r) => r.setAttribute('aria-pressed', String(r === row))); showDetail(p); });
    row.addEventListener('mouseenter', (e) => Tooltip.show([{ k: catLabel(p.category) + ' · ' + p.status }, { v: p.progress + '% complete', color: CAT_COLORS[p.category] }], e.clientX, e.clientY));
    row.addEventListener('mousemove', (e) => Tooltip.show([{ k: catLabel(p.category) + ' · ' + p.status }, { v: p.progress + '% complete', color: CAT_COLORS[p.category] }], e.clientX, e.clientY));
    row.addEventListener('mouseleave', () => Tooltip.hide());
    rows.push(row);
    list.appendChild(row);
  });
  if (CONFIG.projects.length) showDetail(CONFIG.projects[0]);
  const fillAll = () => fills.forEach((f) => { f[0].style.width = clamp(f[1], 0, 100) + '%'; });
  if (reduceMotion()) fillAll(); else onFirstVisible(list, () => requestAnimationFrame(fillAll), 0.2);
}

/* =============================================================================
   14. PROJECTS: previews, cards, filters, search
   ============================================================================= */
function buildPreview(type) {
  const s = svgEl('svg', { viewBox: '0 0 320 170', preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': 'true' });
  const add = (tag, attrs) => s.appendChild(svgEl(tag, attrs));
  add('rect', { class: 'pv-bg', x: 0, y: 0, width: 320, height: 170 });
  if (type === 'trading') {
    add('rect', { class: 'pv-panel', x: 16, y: 16, width: 200, height: 138, rx: 10 });
    add('text', { class: 'pv-text-hi', x: 28, y: 36, text: 'PORTFOLIO  +4.2%' });
    add('path', { class: 'pv-area', d: 'M28 132 L28 104 L52 98 L76 108 L100 88 L124 92 L148 70 L172 76 L204 54 L204 132 Z' });
    add('path', { class: 'pv-line', d: 'M28 104 L52 98 L76 108 L100 88 L124 92 L148 70 L172 76 L204 54' });
    [0, 1, 2, 3, 4, 5, 6].forEach((i) => {
      const h = [18, 26, 14, 30, 22, 34, 20][i];
      add('rect', { class: i % 2 ? 'pv-bar' : 'pv-bar2', x: 30 + i * 25, y: 144 - h * 0.3, width: 10, height: h * 0.3, rx: 2 });
    });
    add('rect', { class: 'pv-panel', x: 226, y: 16, width: 78, height: 138, rx: 10 });
    ['AAPL', 'MSFT', 'NVDA', 'TSLA'].forEach((t, i) => {
      add('text', { class: 'pv-text', x: 236, y: 40 + i * 28, text: t });
      add('rect', { class: i === 3 ? 'pv-acc' : 'pv-bar2', x: 274, y: 32 + i * 28, width: 20, height: 9, rx: 3 });
    });
  } else if (type === 'campus') {
    add('rect', { class: 'pv-panel', x: 16, y: 16, width: 288, height: 26, rx: 8 });
    add('text', { class: 'pv-text-hi', x: 28, y: 33, text: 'UniHive · This week' });
    add('circle', { class: 'pv-dot', cx: 290, cy: 29, r: 4 });
    [0, 1, 2].forEach((i) => {
      const x = 16 + i * 98;
      add('rect', { class: 'pv-panel', x: x, y: 52, width: 90, height: 102, rx: 9 });
      add('rect', { class: i === 1 ? 'pv-acc' : 'pv-bar', x: x + 10, y: 62, width: 70, height: 34, rx: 6 });
      add('text', { class: 'pv-text-hi', x: x + 10, y: 112, text: ['Hack Night', 'AI Club', 'DSA Group'][i] });
      add('rect', { class: 'pv-skel', x: x + 10, y: 120, width: 58, height: 6, rx: 3 });
      add('rect', { class: 'pv-bar2', x: x + 10, y: 134, width: 34, height: 12, rx: 6 });
    });
  } else {
    add('rect', { class: 'pv-panel', x: 16, y: 16, width: 288, height: 138, rx: 10 });
    add('text', { class: 'pv-text-hi', x: 28, y: 36, text: '$ ./explorer  [2] sort compare' });
    const bars = [28, 52, 40, 76, 60, 92, 70, 104, 84, 116];
    bars.forEach((h, i) => add('rect', { class: i >= 7 ? 'pv-acc' : 'pv-bar2', x: 30 + i * 18, y: 144 - h * 0.85, width: 11, height: h * 0.85, rx: 2 }));
    const nodes = [[236, 60], [278, 52], [256, 96], [292, 104], [230, 128]];
    [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4]].forEach((e) => add('line', { x1: nodes[e[0]][0], y1: nodes[e[0]][1], x2: nodes[e[1]][0], y2: nodes[e[1]][1], class: 'pv-line2' }));
    nodes.forEach((n, i) => add('circle', { cx: n[0], cy: n[1], r: 7, class: i === 0 ? 'pv-dot' : 'pv-bar' }));
  }
  return s;
}

/** Link that warns instead of navigating when it's still a placeholder. */
function smartLink(url, label, iconId, cls, extraAttrs) {
  const placeholder = isPlaceholderUrl(url);
  const a = el('a', Object.assign({ class: cls, href: placeholder ? '#' : url }, extraAttrs || {}), [icon(iconId), el('span', { text: label })]);
  if (placeholder) {
    a.setAttribute('data-placeholder', 'true');
    a.setAttribute('title', 'Placeholder: add your link in CONFIG');
    a.addEventListener('click', (e) => { e.preventDefault(); toast(label + ': placeholder link. Add your URL in CONFIG in script.js.'); });
  } else if (/^https?:/i.test(url)) {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  }
  return a;
}

function projectActions(p, inModal) {
  const wrap = el('div', { class: inModal ? '' : 'proj-actions' });
  if (!inModal) {
    wrap.appendChild(el('button', { type: 'button', class: 'btn btn-primary btn-sm', 'data-open-project': p.id, onclick: () => openProject(p) }, [icon('i-eye'), el('span', { text: 'Details' })]));
  }
  if (p.links.source === 'portfolio.cpp') {
    wrap.appendChild(el('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: () => openSource() }, [icon('i-file-code'), el('span', { text: 'View source' })]));
    wrap.appendChild(el('a', { class: 'btn btn-ghost btn-sm', href: 'portfolio.cpp', download: true }, [icon('i-download'), el('span', { text: 'Download' })]));
  } else {
    wrap.appendChild(smartLink(p.links.source, 'Source', 'i-github', 'btn btn-ghost btn-sm'));
  }
  wrap.appendChild(smartLink(p.links.demo, 'Live demo', 'i-external', 'btn btn-ghost btn-sm'));
  return wrap;
}

function projectCard(p) {
  const card = el('article', { class: 'card proj-card' + (p.featured ? ' featured' : ''), 'data-category': p.category, 'aria-labelledby': 'proj-' + p.id });
  const preview = el('div', { class: 'preview' }, [buildPreview(p.preview)]);
  if (p.featured) preview.appendChild(el('span', { class: 'badge pv-tag' }, [icon('i-star', 'icon-sm'), 'Featured']));
  const body = el('div', { class: 'proj-body' }, [
    el('div', { class: 'proj-top' }, [el('span', { class: 'proj-cat', text: catLabel(p.category) }), el('span', { class: 'status', style: { '--st': statusColor(p.status) }, text: p.status })]),
    el('h3', { class: 'proj-title', id: 'proj-' + p.id, text: p.name }),
    el('p', { class: 'proj-desc', text: p.featured ? p.description : p.tagline }),
    el('p', { class: 'proj-problem', text: 'Problem: ' + p.problem }),
    el('div', { class: 'tags' }, p.stack.map((t) => el('span', { class: 'tag', text: t }))),
    projectActions(p, false)
  ]);
  card.appendChild(el('div', { class: 'proj-inner' }, [preview, body]));
  return card;
}

function initProjects() {
  const grid = $('#projGrid'), filters = $('#projFilters'), search = $('#projSearch'), count = $('#resultCount');
  if (!grid) return;
  const state = { cat: 'all', q: '' };
  const cards = CONFIG.projects.map((p) => ({ p: p, node: projectCard(p), text: [p.name, p.tagline, p.description, p.problem, p.stack.join(' '), p.features.join(' '), catLabel(p.category)].join(' ').toLowerCase() }));
  const empty = el('div', { class: 'empty-state', role: 'status' }, [icon('i-search'), el('h3', { text: 'No projects here yet' }), el('p', { class: 'empty-text', text: '' })]);

  const apply = () => {
    const q = state.q.trim().toLowerCase();
    let shown = 0;
    grid.textContent = '';
    cards.forEach((c) => {
      const okCat = state.cat === 'all' || c.p.category === state.cat;
      const okQ = !q || q.split(/\s+/).every((w) => c.text.indexOf(w) !== -1);
      if (okCat && okQ) { grid.appendChild(c.node); shown++; }
    });
    if (!shown) {
      empty.querySelector('.empty-text').textContent = q
        ? 'Nothing matches “' + state.q.trim() + '”. Try another keyword or clear the search.'
        : catLabel(state.cat) + ' projects are coming soon. Add one to CONFIG.projects in script.js.';
      grid.appendChild(empty);
    }
    if (count) count.textContent = shown + ' of ' + cards.length + ' project' + (cards.length === 1 ? '' : 's');
  };

  if (filters) CONFIG.categories.forEach((c) => {
    const n = c.id === 'all' ? CONFIG.projects.length : CONFIG.projects.filter((p) => p.category === c.id).length;
    const b = el('button', { type: 'button', class: 'chip-btn', 'data-filter': c.id, 'aria-pressed': String(c.id === 'all') }, [c.label, el('span', { class: 'n', text: String(n) })]);
    b.addEventListener('click', () => {
      state.cat = c.id;
      $$('.chip-btn', filters).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      apply();
    });
    filters.appendChild(b);
  });
  if (search) {
    search.addEventListener('input', () => { state.q = search.value; apply(); });
    search.addEventListener('keydown', (e) => { if (e.key === 'Escape' && search.value) { e.stopPropagation(); search.value = ''; state.q = ''; apply(); } });
    document.addEventListener('keydown', (e) => {
      const t = e.target;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey && $('#modalRoot').hidden) {
        e.preventDefault();
        search.focus();
      }
    });
  }
  apply();
}

/* =============================================================================
   15. MODAL (focus trap, Escape, focus restore) + PROJECT DETAILS + SOURCE VIEWER
   ============================================================================= */
const Modal = {
  lastFocus: null,
  open(opts) {
    const rootEl = $('#modalRoot'), modal = $('#modal');
    if (!rootEl || !modal) return;
    this.lastFocus = document.activeElement;
    $('#modalEyebrow').textContent = opts.eyebrow || '';
    $('#modalTitle').textContent = opts.title || '';
    const body = $('#modalBody'), foot = $('#modalFoot');
    body.textContent = '';
    foot.textContent = '';
    appendChildren(body, opts.body);
    appendChildren(foot, opts.foot);
    foot.hidden = !foot.childNodes.length;
    modal.classList.toggle('wide', !!opts.wide);
    rootEl.hidden = false;
    document.body.classList.add('modal-open');
    Tooltip.hide();
    const closeBtn = $('.modal-head [data-close-modal]', modal);
    requestAnimationFrame(() => (closeBtn || modal).focus());
  },
  close() {
    const rootEl = $('#modalRoot');
    if (!rootEl || rootEl.hidden) return;
    rootEl.hidden = true;
    document.body.classList.remove('modal-open');
    if (this.lastFocus && typeof this.lastFocus.focus === 'function') this.lastFocus.focus();
  },
  init() {
    const rootEl = $('#modalRoot');
    if (!rootEl) return;
    $$('[data-close-modal]', rootEl).forEach((n) => n.addEventListener('click', () => this.close()));
    document.addEventListener('keydown', (e) => {
      if (rootEl.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); this.close(); return; }
      if (e.key === 'Tab') {
        const items = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', $('#modal')).filter((n) => n.offsetParent !== null || n === document.activeElement);
        if (!items.length) { e.preventDefault(); return; }
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === $('#modal'))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
};

function openProject(p) {
  const body = [
    el('div', { class: 'preview', style: { 'border-radius': '12px', border: '1px solid var(--border)' } }, [buildPreview(p.preview)]),
    el('p', { text: p.description }),
    el('div', { class: 'modal-grid' }, [
      el('div', { class: 'kv' }, [el('span', { text: 'Category' }), el('b', { text: catLabel(p.category) })]),
      el('div', { class: 'kv' }, [el('span', { text: 'Status' }), el('b', { text: p.status + ' · ' + p.progress + '%' })]),
      el('div', { class: 'kv' }, [el('span', { text: 'Current phase' }), el('b', { text: p.phase })]),
      el('div', { class: 'kv' }, [el('span', { text: 'Next milestone' }), el('b', { text: p.nextMilestone })])
    ]),
    el('div', null, [el('h3', { text: 'Problem' }), el('p', { text: p.problem })]),
    el('div', null, [el('h3', { text: 'Key features' }), el('ul', { class: 'bullets' }, p.features.map((f) => el('li', { text: f })))]),
    el('div', null, [el('h3', { text: 'Tech stack' }), el('div', { class: 'tags' }, p.stack.map((t) => el('span', { class: 'tag', text: t })))])
  ];
  const actions = projectActions(p, true);
  Modal.open({ eyebrow: catLabel(p.category) + ' · Example project', title: p.name, body: body, foot: Array.from(actions.childNodes) });
}

function openSource() {
  const pre = el('pre', { class: 'source-view', tabindex: '0', 'aria-label': 'portfolio.cpp source code', text: 'Loading portfolio.cpp…' });
  const info = el('p', { class: 'muted', text: 'Read-only view. The program runs in a terminal; compile it with g++ -std=c++17.' });
  const foot = [
    el('a', { class: 'btn btn-ghost btn-sm', href: 'portfolio.cpp', target: '_blank', rel: 'noopener' }, [icon('i-external'), el('span', { text: 'Open raw file' })]),
    el('a', { class: 'btn btn-primary btn-sm', href: 'portfolio.cpp', download: true }, [icon('i-download'), el('span', { text: 'Download .cpp' })])
  ];
  Modal.open({ eyebrow: 'Source code · C++17', title: 'portfolio.cpp', body: [info, pre], foot: foot, wide: true });
  if (!window.fetch) { pre.textContent = 'Your browser cannot load the file inline. Use “Open raw file” or “Download .cpp”.'; return; }
  fetch('portfolio.cpp', { cache: 'no-cache' })
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
    .then((text) => {
      pre.textContent = text; // textContent: shown as plain text, never parsed as HTML
      info.textContent = text.split('\n').length + ' lines · read-only view. Compile with: g++ -std=c++17 -O2 -Wall -Wextra -pedantic portfolio.cpp -o explorer';
    })
    .catch(() => {
      pre.textContent = 'Could not load portfolio.cpp inline (this happens when the page is opened from file:// instead of a web server). Use “Open raw file” or “Download .cpp” below.';
    });
}

/* =============================================================================
   16. ABOUT, TECH STACK, TIMELINE
   ============================================================================= */
function initAbout() {
  const fill = (id, items) => { const ul = $(id); if (ul) items.forEach((t) => ul.appendChild(el('li', { text: t }))); };
  fill('#interestList', CONFIG.about.interests);
  fill('#strengthList', CONFIG.about.strengths);
  const groups = $('#stackGroups');
  if (groups) CONFIG.techStack.forEach((g) => {
    groups.appendChild(el('div', { class: 'stack-group' }, [
      el('h4', null, [icon(g.icon), g.group]),
      el('div', { class: 'chips' }, g.items.map((it) => el('span', { class: 'chip' + (it.learning ? ' learning' : ''), text: it.name, title: it.learning ? 'Currently learning' : null })))
    ]));
  });
}

function initTimeline() {
  const ol = $('#timeline');
  if (!ol) return;
  CONFIG.timeline.forEach((t) => {
    ol.appendChild(el('li', { class: 'tl-item' + (t.now ? ' now' : ''), 'data-reveal': true }, [
      el('span', { class: 'tl-dot', 'aria-hidden': 'true' }, icon(t.now ? 'i-star' : 'i-check')),
      el('div', { class: 'card tl-card' }, [
        el('div', { class: 'tl-top' }, [el('span', { class: 'tl-date', text: t.date }), t.now ? el('span', { class: 'badge' }, [el('span', { class: 'badge-dot', style: { color: 'var(--green)' } }), 'Current']) : null]),
        el('h3', { text: t.title }),
        el('p', { text: t.text }),
        t.tags && t.tags.length ? el('div', { class: 'tags' }, t.tags.map((g) => el('span', { class: 'tag', text: g }))) : null
      ])
    ]));
  });
}

/* =============================================================================
   17. CONTACT: copy email (Clipboard API → execCommand → manual select) + socials
   ============================================================================= */
function initContact() {
  const btn = $('#copyEmailBtn'), status = $('#copyStatus'), link = $('#emailLink');
  const email = CONFIG.profile.email;
  const say = (msg, warn) => { if (!status) return; status.textContent = msg; status.classList.toggle('warn', !!warn); };
  const label = btn ? $('span', btn) : null;
  const done = () => {
    say('Copied ' + email + ' to your clipboard.');
    if (label) { label.textContent = 'Copied!'; setTimeout(() => { label.textContent = 'Copy email'; }, 2000); }
  };
  const legacyCopy = () => {
    const ta = el('textarea', { readonly: true, 'aria-hidden': 'true', style: { position: 'fixed', top: '-1000px', left: '0', opacity: '0' } });
    ta.value = email;
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  };
  const manualSelect = () => {
    const target = link ? $('span', link) : null;
    if (target && window.getSelection) {
      const range = document.createRange();
      range.selectNodeContents(target);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    say('Copying is blocked here. The address is selected, so press Ctrl+C (or ⌘C) to copy it.', true);
  };
  if (btn) btn.addEventListener('click', () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(done, () => (legacyCopy() ? done() : manualSelect()));
    } else if (legacyCopy()) done();
    else manualSelect();
  });

  const list = $('#socialLinks'), foot = $('#footerSocial');
  CONFIG.social.forEach((s) => {
    const placeholder = isPlaceholderUrl(s.url);
    if (list) {
      const a = smartLink(s.url, s.label, s.icon, 'social-link');
      a.textContent = '';
      a.appendChild(icon(s.icon));
      a.appendChild(el('span', null, [el('b', { text: s.label }), el('small', { text: placeholder ? 'placeholder · set in CONFIG' : s.url.replace(/^https?:\/\//, '') })]));
      a.appendChild(icon('i-external'));
      list.appendChild(a);
    }
    if (foot) {
      const f = smartLink(s.url, s.label, s.icon, 'icon-btn', { 'aria-label': s.label + (placeholder ? ' (placeholder)' : '') });
      const txt = $('span', f);
      if (txt) txt.remove();
      foot.appendChild(f);
    }
  });
  const avatar = document.querySelector('.avatar-wrap');
  if (avatar) avatar.setAttribute('aria-label', 'About ' + CONFIG.profile.name);
}

/* =============================================================================
   18. BOOT
   ============================================================================= */
function initSourceButton() {
  const b = $('#viewSourceBtn');
  if (b) b.addEventListener('click', openSource);
}

function boot() {
  if (reduceMotion()) root.classList.add('reduce-motion');
  if (motionQuery && motionQuery.addEventListener) motionQuery.addEventListener('change', () => root.classList.toggle('reduce-motion', reduceMotion()));
  safe('bindings', initBindings);
  safe('theme', initTheme);
  safe('clock', initClock);
  safe('roles', initRoleTyper);
  safe('sidebar', initSidebar);
  safe('kpis', initKpis);
  safe('area chart', initAreaChart);
  safe('donut', initDonut);
  safe('heatmap', initHeatmap);
  safe('skills', initSkills);
  safe('progress', initProgress);
  safe('projects', initProjects);
  safe('modal', () => Modal.init());
  safe('source', initSourceButton);
  safe('about', initAbout);
  safe('timeline', initTimeline);
  safe('contact', initContact);
  safe('active section', initActiveSection);
  safe('reveals', initReveals);
  safe('back to top', initBackToTop);
  window.addEventListener('scroll', () => Tooltip.hide(), { passive: true });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
