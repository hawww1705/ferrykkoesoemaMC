/* ============================================================
   FERRY KOESOEMA – LUXURY MC & KOESOEMA SINGERS
   Premium JavaScript – CLEAN REWRITE (fully responsive)
   ============================================================ */

'use strict';

/* ---------- UTILITY ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. NAVBAR – single, unified handler (no duplicates)
   ============================================================ */
(function initNavbar() {
  const navbar  = $('#navbar');
  const toggle  = $('#nav-toggle');
  const menu    = $('#nav-menu');
  const links   = $$('.nav-link', menu);

  let lastScroll = 0;
  let menuOpen   = false;

  /* --- Scroll: scrolled class + hide-on-scroll-down --- */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);

    // Jangan sembunyikan navbar kalau menu sedang terbuka
    if (!menuOpen) {
      if (y > lastScroll && y > 200) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
    }
    lastScroll = y;
  }, { passive: true });

  /* --- Hamburger toggle: menu open/close + active class --- */
  function openMenu() {
    menuOpen = true;
    menu.classList.add('open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    navbar.style.transform = 'translateY(0)'; // selalu tampilkan navbar saat menu terbuka
  }

  function closeMenu() {
    menuOpen = false;
    menu.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (menuOpen) closeMenu(); else openMenu();
  });

  // Tutup menu saat klik link
  links.forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  // Tutup menu saat klik di luar
  document.addEventListener('click', (e) => {
    if (menuOpen && !navbar.contains(e.target)) closeMenu();
  });

  // Tutup menu saat klik tombol ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  /* --- Active link highlight saat scroll --- */
  const sections = $$('section[id]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = $(`[href="#${entry.target.id}"]`, menu);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => obs.observe(s));
})();

/* ============================================================
   2. HERO PARTICLES
   ============================================================ */
(function initHeroParticles() {
  const container = $('#hero-particles');
  if (!container) return;

  const count = window.innerWidth < 640 ? 15 : 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const dur  = Math.random() * 10 + 8;
    const del  = Math.random() * 5;
    p.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      background:${Math.random() > 0.5 ? '#D4AF37' : '#F8F5F0'};
      border-radius:50%;
      opacity:${Math.random() * 0.5 + 0.1};
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation:float-particle ${dur}s ease-in-out infinite ${del}s alternate;
      pointer-events:none;
    `;
    container.appendChild(p);
  }

  if (!document.getElementById('particle-kf')) {
    const s = document.createElement('style');
    s.id = 'particle-kf';
    s.textContent = `
      @keyframes float-particle {
        0%   { transform:translateY(0) scale(1); opacity:0.1; }
        100% { transform:translateY(-60px) scale(1.2); opacity:0.6; }
      }
    `;
    document.head.appendChild(s);
  }
})();

/* ============================================================
   3. AOS – Animate on Scroll
   ============================================================ */
(function initAOS() {
  const els = $$('[data-aos]');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const del = parseInt(el.dataset.aosDelay || 0);
        setTimeout(() => el.classList.add('aos-animate'), del);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => obs.observe(el));
})();

/* ============================================================
   4. STATS COUNTER
   ============================================================ */
(function initStats() {
  const statEls = $$('[data-target]');
  if (!statEls.length) return;

  let done = false;
  const obs = new IntersectionObserver((entries) => {
    if (done) return;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        done = true;
        statEls.forEach(el => {
          const target = parseInt(el.dataset.target);
          const dur    = 1800;
          const start  = performance.now();
          const tick   = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const e = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(e * target) + '+';
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const row = $('#stats-row');
  if (row) obs.observe(row);
})();

/* ============================================================
   5. GALLERY FILTER + LIGHTBOX
   ============================================================ */
(function initGallery() {
  const btns  = $$('.filter-btn');
  const items = $$('.gallery-item');

  // Inject appear animation
  const s = document.createElement('style');
  s.textContent = `@keyframes gallery-appear{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`;
  document.head.appendChild(s);

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');

      const filter = btn.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !show);
        if (show) {
          item.style.animation = 'none';
          void item.offsetHeight;
          item.style.animation = 'gallery-appear 0.4s ease forwards';
        }
      });
    });
  });

  /* Lightbox */
  const lb        = $('#lightbox');
  const lbImg     = $('#lightbox-img');
  const lbCaption = $('#lightbox-caption');
  const lbClose   = $('#lightbox-close');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const cap = item.querySelector('.gallery-item-overlay span');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = cap ? cap.textContent : '';
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lb.style.display = 'none';
    document.body.style.overflow = '';
  };

  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.style.display !== 'none') closeLightbox();
  });
})();

/* ============================================================
   6. TESTIMONIALS SLIDER
   ============================================================ */
(function initTestimonials() {
  const slides    = $$('.testimonial-slide');
  const prevBtn   = $('#slider-prev');
  const nextBtn   = $('#slider-next');
  const dotsWrap  = $('#slider-dots');
  if (!slides.length) return;

  let cur = 0;
  let auto;

  // Buat dots
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = `slider-dot${i === 0 ? ' active' : ''}`;
    d.setAttribute('aria-label', `Testimoni ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function goTo(idx) {
    slides[cur].classList.remove('active');
    $$('.slider-dot')[cur].classList.remove('active');
    cur = (idx + slides.length) % slides.length;
    slides[cur].classList.add('active');
    $$('.slider-dot')[cur].classList.add('active');
    resetAuto();
  }

  function resetAuto() {
    clearInterval(auto);
    auto = setInterval(() => goTo(cur + 1), 5500);
  }

  slides[0].classList.add('active');
  prevBtn.addEventListener('click', () => goTo(cur - 1));
  nextBtn.addEventListener('click', () => goTo(cur + 1));

  // Swipe support (tanpa memblokir scroll)
  let tx = 0;
  const slider = $('#testimonials-slider');
  if (slider) {
    slider.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) goTo(dx < 0 ? cur + 1 : cur - 1);
    }, { passive: true });
  }

  resetAuto();
})();

/* ============================================================
   7. VIDEO MODAL
   ============================================================ */
window.openVideo = function(url, title) {
  const modal = $('#video-modal');
  if (!modal) return;
  $('#video-modal-title').textContent = title;
  $('#video-iframe').src = url;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.closeVideo = function() {
  const modal = $('#video-modal');
  if (!modal) return;
  $('#video-iframe').src = '';
  modal.style.display = 'none';
  document.body.style.overflow = '';
};

document.addEventListener('keydown', e => {
  const modal = $('#video-modal');
  if (e.key === 'Escape' && modal && modal.style.display !== 'none') window.closeVideo();
});

$$('.video-thumbnail').forEach(th => {
  th.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); th.click(); }
  });
});

/* ============================================================
   8. FLOATING WHATSAPP AGENT
   ============================================================ */
(function initWAAgent() {
  const agent   = $('#wa-agent');
  const fab     = $('#wa-fab-btn');
  const bubble  = $('#wa-agent .wa-bubble');
  const closeB  = $('#wa-close-btn');
  if (!fab || !bubble) return;

  let open = false;

  function show() {
    open = true;
    bubble.classList.add('visible');
    const dot = $('.wa-notif-dot', fab);
    if (dot) dot.style.display = 'none';
  }
  function hide() {
    open = false;
    bubble.classList.remove('visible');
  }

  fab.addEventListener('click', () => open ? hide() : show());
  closeB.addEventListener('click', e => { e.stopPropagation(); hide(); });
  document.addEventListener('click', e => { if (open && !agent.contains(e.target)) hide(); });

  // Auto popup 5 detik
  setTimeout(() => { if (!open) show(); }, 5000);
})();

/* ============================================================
   9. CONTACT FORM → WHATSAPP
   ============================================================ */
(function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = $('#form-name').value.trim();
    const evType  = $('#form-event').value;
    const date    = $('#form-date').value;
    const message = $('#form-message').value.trim();

    if (!name || !evType || !date || !message) {
      showFeedback('Mohon lengkapi semua field yang diperlukan.', 'error');
      return;
    }

    const labels = { wedding:'Wedding', engagement:'Engagement/Lamaran', birthday:'Birthday', corporate:'Corporate Event', other:'Lainnya' };
    const d = date ? new Date(date).toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'}) : '-';

    const msg = encodeURIComponent(
      `Halo Ferry Koesoema! 👋\n\n` +
      `*Nama:* ${name}\n` +
      `*Jenis Acara:* ${labels[evType] || evType}\n` +
      `*Tanggal Acara:* ${d}\n\n` +
      `*Pesan:*\n${message}\n\n` +
      `Mohon informasi lebih lanjut. Terima kasih! 🙏`
    );

    window.open(`https://wa.me/6282137020557?text=${msg}`, '_blank');
    showFeedback('Pesan dikirim ke WhatsApp! Kami akan segera menghubungi Anda. 🎉', 'success');
    form.reset();
  });

  function showFeedback(msg, type) {
    let el = $('#form-feedback');
    if (!el) {
      el = document.createElement('div');
      el.id = 'form-feedback';
      form.parentNode.insertBefore(el, form.nextSibling);
    }
    el.textContent = msg;
    el.style.cssText = `
      padding:1rem 1.25rem;border-radius:12px;font-size:0.88rem;font-weight:600;
      margin-top:1rem;animation:fadeIn .3s ease;
      background:${type==='success'?'#d4edda':'#f8d7da'};
      color:${type==='success'?'#155724':'#721c24'};
      border:1px solid ${type==='success'?'#c3e6cb':'#f5c6cb'};
    `;
    setTimeout(() => el && el.remove(), 5000);
  }
})();

/* ============================================================
   10. BACK TO TOP
   ============================================================ */
(function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 500 ? 'flex' : 'none';
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ============================================================
   11. FOOTER CONSTELLATION (Canvas)
   ============================================================ */
(function initFooterConstellation() {
  const canvas = $('#footer-constellation');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let raf;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildParticles();
  }

  function buildParticles() {
    const n = Math.floor((canvas.width * canvas.height) / 10000);
    particles = Array.from({ length: n }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.7 ? '#D4AF37' : '#F8F5F0',
      opacity: Math.random() * 0.8 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      ps: Math.random() * 0.02 + 0.01,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x  = (p.x + p.vx + canvas.width)  % canvas.width;
      p.y  = (p.y + p.vy + canvas.height) % canvas.height;
      p.pulse += p.ps;
      const pf = 0.6 + Math.sin(p.pulse) * 0.4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * pf, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity * pf;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#D4AF37';
          ctx.globalAlpha = (1 - d / 100) * 0.25;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  }

  // Easter egg
  const sig = $('#benchcode-signature');
  let hoverT;
  if (sig) {
    sig.addEventListener('mouseenter', () => {
      hoverT = setTimeout(() => sig.classList.add('reveal'), 3000);
    });
    sig.addEventListener('mouseleave', () => clearTimeout(hoverT));
  }

  // Lazy init: mulai animasi hanya saat footer terlihat
  const footerObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      resize();
      draw();
      footerObs.disconnect();
    }
  }, { threshold: 0.1 });
  const footer = $('#footer');
  if (footer) footerObs.observe(footer);

  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    draw();
  }, { passive: true });
})();

/* ============================================================
   12. CTA PARTICLES
   ============================================================ */
(function initCTAParticles() {
  const c = $('#cta-particles');
  if (!c) return;
  const s = document.createElement('style');
  s.textContent = `@keyframes cta-float{0%{transform:translateY(0) rotate(0deg)}100%{transform:translateY(-50px) rotate(180deg)}}`;
  document.head.appendChild(s);
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;width:${Math.random()*4+2}px;height:${Math.random()*4+2}px;
      border-radius:50%;background:${Math.random()>.4?'#D4AF37':'#F8F5F0'};
      opacity:${Math.random()*.25+.05};
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation:cta-float ${Math.random()*12+8}s ease-in-out infinite ${Math.random()*6}s alternate;
      pointer-events:none;
    `;
    c.appendChild(p);
  }
})();

/* ============================================================
   13. MC IMAGE PARALLAX (desktop only)
   ============================================================ */
(function initMCParallax() {
  if (window.innerWidth <= 900) return; // skip di mobile/tablet
  const img = $('#mc-main-img');
  const sec = $('#mc-section');
  if (!img || !sec) return;
  sec.addEventListener('mousemove', e => {
    const r = sec.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    img.style.transform = `scale(1.04) translate(${x*10}px,${y*8}px)`;
  }, { passive: true });
  sec.addEventListener('mouseleave', () => { img.style.transform = ''; });
})();

/* ============================================================
   14. FIX 100VH MOBILE (address bar compensation)
   ============================================================ */
(function fixMobileVh() {
  function setVh() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
  setVh();
  window.addEventListener('resize', setVh, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(setVh, 200));
})();

/* ============================================================
   15. SMOOTH SCROLL (anchor links)
   ============================================================ */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const target = $(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '80');
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   16. PREVENT iOS INPUT ZOOM (iOS zooms bila font-size < 16px)
   ============================================================ */
(function preventIOSZoom() {
  if (!/iPhone|iPad|iPod/.test(navigator.userAgent)) return;
  const s = document.createElement('style');
  s.textContent = `input,select,textarea{font-size:max(16px,1em)!important;}`;
  document.head.appendChild(s);
})();

/* ============================================================
   17. REDUCED MOTION
   ============================================================ */
(function checkReducedMotion() {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = document.createElement('style');
  s.textContent = `*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;}`;
  document.head.appendChild(s);
})();

/* ============================================================
   INIT LOG
   ============================================================ */
console.log('%c✦ Ferry Koesoema – Professional MC & Koesoema Singers ✦', 'color:#D4AF37;font-size:14px;font-weight:bold;');
console.log('%cWebsite crafted by BenchCode Dev ❤️', 'color:#7A5C45;font-size:11px;');
