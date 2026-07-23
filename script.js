// 安念善終 — 一條龍善終服務 Landing Page Interactivity
const WA_NUMBER = '85298593507';

(function() {
  // === Build wa.me links ===
  document.querySelectorAll('.wa-link[data-wa]').forEach(function(a) {
    var msg = a.getAttribute('data-wa') || '';
    a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });

  // === Dynamic Year ===
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // === Mobile Nav ===
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.querySelector('.nav');
  var navOverlay = document.getElementById('navOverlay');

  function toggleNav(open) {
    var isOpen = open !== undefined ? open : !navLinks.classList.contains('active');
    hamburger.classList.toggle('active', isOpen);
    navLinks.classList.toggle('active', isOpen);
    navOverlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen);
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() { toggleNav(); });
    navOverlay.addEventListener('click', function() { toggleNav(false); });
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() { toggleNav(false); });
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') toggleNav(false);
  });

  // === Smooth scroll for anchor links ===
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#top') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // === Theme Toggle ===
  var toggleBtn = document.querySelector('[data-theme-toggle]');
  var root = document.documentElement;
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = localStorage.getItem('theme');
  var isDark = theme ? theme === 'dark' : prefersDark;
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  renderToggleIcon(isDark);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      isDark = !isDark;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      renderToggleIcon(isDark);
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      isDark = e.matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
      renderToggleIcon(isDark);
    }
  });

  function renderToggleIcon(dark) {
    if (!toggleBtn) return;
    toggleBtn.innerHTML = dark
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
    toggleBtn.setAttribute('aria-label', '切換至' + (dark ? '淺色' : '深色') + '模式');
  }

  // === Header shadow on scroll ===
  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('header--scrolled');
    else header.classList.remove('header--scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // === Fixed CTA bar ===
  var ctaBar = document.getElementById('ctaBar');
  function toggleCta() {
    if (!ctaBar) return;
    if (window.scrollY > 600) ctaBar.classList.add('cta-bar--visible');
    else ctaBar.classList.remove('cta-bar--visible');
  }
  toggleCta();
  window.addEventListener('scroll', toggleCta, { passive: true });

  // === Analytics hooks (placeholder) ===
  document.querySelectorAll('.wa-link').forEach(function(a) {
    a.addEventListener('click', function() {
      var label = (a.getAttribute('data-wa') || '').substring(0, 40);
      if (window.dataLayer) window.dataLayer.push({ event: 'whatsapp_click', label: label });
      if (window.gtag) window.gtag('event', 'whatsapp_click', { event_label: label });
    });
  });
})();