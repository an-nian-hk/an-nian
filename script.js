// 安念善終服務辦公室 — 一條龍善終服務 Landing Page Interactivity
const WA_NUMBER = '85298593507';

(function() {
  try {
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
      if (!hamburger || !navLinks || !navOverlay) return;
      var isOpen = open !== undefined ? open : !navLinks.classList.contains('active');
      hamburger.classList.toggle('active', isOpen);
      navLinks.classList.toggle('active', isOpen);
      navOverlay.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isOpen);
    }

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function() { toggleNav(); });
      if (navOverlay) navOverlay.addEventListener('click', function() { toggleNav(false); });
      navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() { toggleNav(false); });
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') toggleNav(false);
    });

    // === Smooth scroll ===
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
    var theme = (function() { try { return localStorage.getItem('theme'); } catch(e) { return null; } })();
    var isDark = theme ? theme === 'dark' : prefersDark;
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    renderToggleIcon(isDark);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function() {
        isDark = !isDark;
        root.setAttribute('data-theme', isDark ? 'dark' : 'light');
        try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch(e) {}
        renderToggleIcon(isDark);
      });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      var stored;
      try { stored = localStorage.getItem('theme'); } catch(ex) { stored = null; }
      if (!stored) {
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
      toggleBtn.setAttribute('aria-label', dark ? '切換至淺色模式' : '切換至深色模式');
    }

    // === Header shadow ===
    var header = document.getElementById('header');
    function onScroll() {
      if (!header) return;
      header.classList.toggle('header--scrolled', window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // === Fixed CTA bar ===
    var ctaBar = document.getElementById('ctaBar');
    function toggleCta() {
      if (!ctaBar) return;
      ctaBar.classList.toggle('cta-bar--visible', window.scrollY > 600);
    }
    toggleCta();
    window.addEventListener('scroll', toggleCta, { passive: true });

    // === Analytics hooks ===
    document.querySelectorAll('.wa-link').forEach(function(a) {
      a.addEventListener('click', function() {
        var label = (a.getAttribute('data-wa') || '').substring(0, 40);
        try { if (window.dataLayer) window.dataLayer.push({ event: 'whatsapp_click', label: label }); } catch(e) {}
        try { if (window.gtag) window.gtag('event', 'whatsapp_click', { event_label: label }); } catch(e) {}
      });
    });

  } catch (e) { /* non-critical UI script, fail silently */ }
})();

/* ========== Scroll Reveal ========== */
(function() {
  try {
    var revealEls = document.querySelectorAll('[data-reveal]');
    if (!revealEls.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('wt-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function(el) { observer.observe(el); });
  } catch (e) {}
})();


/* ========== Zen Ambient Music ========== */
(function() {
  var btn = document.getElementById('zenAudioBtn');
  if (!btn) return;

  var ctx = null;
  var masterGain = null;
  var oscNodes = [];
  var isPlaying = false;
  var tremoloId = null;

  function buildEngine() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);

    // Layer 1: G3 ~196Hz
    var o1 = ctx.createOscillator();
    o1.type = 'sine';
    o1.frequency.value = 196;
    var g1 = ctx.createGain();
    g1.gain.value = 0.22;
    o1.connect(g1).connect(masterGain);
    o1.start();
    oscNodes.push(o1);

    // Layer 2: D4 ~294Hz
    var o2 = ctx.createOscillator();
    o2.type = 'sine';
    o2.frequency.value = 293.7;
    var g2 = ctx.createGain();
    g2.gain.value = 0.14;
    o2.connect(g2).connect(masterGain);
    o2.start();
    oscNodes.push(o2);

    // Layer 3: G4 ~392Hz
    var o3 = ctx.createOscillator();
    o3.type = 'sine';
    o3.frequency.value = 392;
    var g3 = ctx.createGain();
    g3.gain.value = 0.08;
    o3.connect(g3).connect(masterGain);
    o3.start();
    oscNodes.push(o3);

    // Layer 4: G5 ~784Hz
    var o4 = ctx.createOscillator();
    o4.type = 'sine';
    o4.frequency.value = 784;
    var g4 = ctx.createGain();
    g4.gain.value = 0.04;
    o4.connect(g4).connect(masterGain);
    o4.start();
    oscNodes.push(o4);

    startTremolo();
  }

  function startTremolo() {
    if (!ctx || ctx.state === 'closed') return;
    clearTimeout(tremoloId);
    var now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value || 0.28, now);
    masterGain.gain.linearRampToValueAtTime(0.42, now + 3);
    masterGain.gain.linearRampToValueAtTime(0.28, now + 7);
    tremoloId = setTimeout(startTremolo, 7000);
  }

  function fadeIn() {
    if (!ctx || ctx.state === 'closed') buildEngine();
    if (ctx.state === 'suspended') ctx.resume();
    clearTimeout(tremoloId);
    var now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.35, now + 2.5);
    setTimeout(startTremolo, 2600);
  }

  function fadeOut(cb) {
    clearTimeout(tremoloId);
    if (!ctx || !masterGain) { if (cb) cb(); return; }
    var now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + 2);
    setTimeout(function() {
      if (ctx && ctx.state !== 'closed') ctx.suspend();
      if (cb) cb();
    }, 2100);
  }

  btn.addEventListener('click', function() {
    if (isPlaying) {
      fadeOut(function() {
        btn.classList.remove('zen-audio-btn--active');
        btn.setAttribute('aria-label', '播放禪修音樂');
        btn.title = '禪修音樂';
        isPlaying = false;
      });
    } else {
      btn.classList.add('zen-audio-btn--active');
      btn.setAttribute('aria-label', '暫停禪修音樂');
      btn.title = '禪修音樂（播放中）';
      fadeIn();
      isPlaying = true;
    }
  });
})();