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


/* ========== Zen Music (YouTube) ========== */
(function() {
  var btn = document.getElementById('zenAudioBtn');
  if (!btn) return;

  var player = null;
  var isPlaying = false;
  var isReady = false;
  var volume = 30; // start at 30%
  var fadeInterval = null;

  // YouTube API callback
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('ytPlayer', {
      videoId: 'CHz__3r-YF8',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        iv_load_policy: 3,
        loop: 1,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showinfo: 0
      },
      events: {
        onReady: function() {
          isReady = true;
          player.setVolume(0);
          player.setLoop(true);
        },
        onStateChange: function(e) {
          // YT.PlayerState.ENDED = 0 → replay
          if (e.data === 0 && isPlaying) {
            player.seekTo(0);
            player.playVideo();
          }
        }
      }
    });
  };

  function fadeVolume(target, duration, cb) {
    clearInterval(fadeInterval);
    if (!isReady || !player) { if (cb) cb(); return; }
    var current = player.getVolume();
    if (current === false) current = 0;
    var steps = 20;
    var stepTime = duration / steps;
    var stepDelta = (target - current) / steps;
    var step = 0;
    fadeInterval = setInterval(function() {
      step++;
      var v = Math.round(current + stepDelta * step);
      v = Math.max(0, Math.min(100, v));
      try { player.setVolume(v); } catch(e) {}
      if (step >= steps) {
        clearInterval(fadeInterval);
        try { player.setVolume(target); } catch(e) {}
        if (cb) cb();
      }
    }, stepTime);
  }

  btn.addEventListener('click', function() {
    if (isPlaying) {
      fadeVolume(0, 1500, function() {
        try { player.pauseVideo(); } catch(e) {}
        btn.classList.remove('zen-audio-btn--active');
        btn.setAttribute('aria-label', '播放禪修音樂');
        btn.title = '禪修音樂';
        isPlaying = false;
      });
    } else {
      btn.classList.add('zen-audio-btn--active');
      btn.setAttribute('aria-label', '暫停禪修音樂');
      btn.title = '禪修音樂（播放中）';
      try {
        player.unMute();
        player.playVideo();
      } catch(e) {}
      isPlaying = true;
      fadeVolume(volume, 2000);
    }
  });
})();