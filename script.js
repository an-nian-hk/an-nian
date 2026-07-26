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
  try {
    var btn = document.getElementById('zenAudioBtn');
    if (!btn) return;

    var ctx = null;
    var gainNode = null;
    var oscs = [];
    var isPlaying = false;

    function createAmbient() {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = ctx.createGain();
      gainNode.gain.value = 0;
      gainNode.connect(ctx.destination);

      // Layer 1: deep drone ~55Hz (A1) - grounding
      var osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 55;
      var g1 = ctx.createGain();
      g1.gain.value = 0.15;
      osc1.connect(g1);
      g1.connect(gainNode);
      osc1.start();
      oscs.push({ osc: osc1, gain: g1 });

      // Layer 2: harmonic ~110Hz (A2) - warmth
      var osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 110;
      var g2 = ctx.createGain();
      g2.gain.value = 0.08;
      osc2.connect(g2);
      g2.connect(gainNode);
      osc2.start();
      oscs.push({ osc: osc2, gain: g2 });

      // Layer 3: gentle overtone ~330Hz (E4) - airiness
      var osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.value = 329.6;
      var g3 = ctx.createGain();
      g3.gain.value = 0.04;
      osc3.connect(g3);
      g3.connect(gainNode);
      osc3.start();
      oscs.push({ osc: osc3, gain: g3 });

      // Layer 4: very high sparkle ~880Hz
      var osc4 = ctx.createOscillator();
      osc4.type = 'sine';
      osc4.frequency.value = 880;
      var g4 = ctx.createGain();
      g4.gain.value = 0.015;
      osc4.connect(g4);
      g4.connect(gainNode);
      osc4.start();
      oscs.push({ osc: osc4, gain: g4 });

      // Slow tremolo on the drone
      var lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.07; // very slow ~14 second cycle
      var lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.3;
      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);
      lfo.start();
      oscs.push({ osc: lfo, gain: lfoGain });
    }

    function fadeIn() {
      if (!ctx || ctx.state === 'closed') createAmbient();
      if (ctx.state === 'suspended') ctx.resume();
      gainNode.gain.cancelScheduledValues(ctx.currentTime);
      gainNode.gain.setValueAtTime(gainNode.gain.value || 0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 2);
    }

    function fadeOut(cb) {
      if (!ctx || !gainNode) { if (cb) cb(); return; }
      gainNode.gain.cancelScheduledValues(ctx.currentTime);
      gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      setTimeout(function() {
        if (ctx && ctx.state !== 'closed') ctx.suspend();
        if (cb) cb();
      }, 1600);
    }

    btn.addEventListener('click', function() {
      if (isPlaying) {
        fadeOut(function() {
          btn.classList.remove('zen-audio-btn--active');
          btn.setAttribute('aria-label', '播放禪修音樂');
          isPlaying = false;
        });
      } else {
        btn.classList.add('zen-audio-btn--active');
        btn.setAttribute('aria-label', '暫停禪修音樂');
        fadeIn();
        isPlaying = true;
      }
    });
  } catch (e) {}
})();
