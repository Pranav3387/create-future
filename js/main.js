// AURA launch page interactions — vanilla JS, no build step required.

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initReveal();
  initCountdown();
  initStatCounters();
  initAccordion();
  initReserveForm();
});

/* Mobile nav toggle */
function initMobileNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  if (!hamburger) return;
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('#navLinks a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

/* Scroll-reveal animation via IntersectionObserver */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => observer.observe(el));
}

/* Countdown to a launch date 45 days from first page load (persisted per browser) */
function initCountdown() {
  const key = 'aura-launch-date';
  let launch = localStorage.getItem(key);
  if (!launch) {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    launch = d.toISOString();
    localStorage.setItem(key, launch);
  }
  const target = new Date(launch).getTime();

  const el = {
    d: document.getElementById('cd-d'),
    h: document.getElementById('cd-h'),
    m: document.getElementById('cd-m'),
    s: document.getElementById('cd-s'),
  };
  if (!el.d) return;

  function tick() {
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const day = Math.floor(diff / 86400000); diff -= day * 86400000;
    const hr = Math.floor(diff / 3600000); diff -= hr * 3600000;
    const min = Math.floor(diff / 60000); diff -= min * 60000;
    const sec = Math.floor(diff / 1000);
    el.d.textContent = String(day).padStart(2, '0');
    el.h.textContent = String(hr).padStart(2, '0');
    el.m.textContent = String(min).padStart(2, '0');
    el.s.textContent = String(sec).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
}

/* Animated waitlist stat counters (deterministic display numbers, not fabricated real users) */
function initStatCounters() {
  animateCount('statWaitlist', 10482);
  animateCount('statCountries', 37);
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = 1400;
  const start = performance.now();
  function frame(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* FAQ accordion */
function initAccordion() {
  const items = document.querySelectorAll('.acc-item');
  items.forEach(item => {
    const head = item.querySelector('.acc-head');
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* Waitlist form — stores locally and shows confirmation.
   To go live: point this at a real endpoint (Formspree, Google Sheets via Apps Script,
   Mailchimp, or your own backend) and replace the localStorage call with a fetch(). */
function initReserveForm() {
  const form = document.getElementById('reserveForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rName').value.trim();
    const email = document.getElementById('rEmail').value.trim();
    if (!name || !email) return;

    const key = 'aura-waitlist';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push({ name, email, ts: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(list));

    note.textContent = `Thanks, ${name}! You're on the list — check ${email} for confirmation once a real signup backend is connected.`;
    form.reset();
  });
}
