/* ============================================================
   FERRY KOESOEMA – LUXURY MC & KOESOEMA SINGERS
   Premium JavaScript – Interactive Functionality
   ============================================================ */

'use strict';

/* ---------- UTILITY ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. NAVBAR
   ============================================================ */
(function initNavbar() {
  const navbar = $('#navbar');
  const toggle = $('#nav-toggle');
  const menu = $('#nav-menu');
  const links = $$('.nav-link', menu);

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 60);
    // Hide/show on scroll
    if (scrollY > lastScroll && scrollY > 300) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScroll = scrollY;
  }, { passive: true });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Active link on scroll
  const sections = $$('section[id]');
  const observerNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const activeLink = $(`[href="#${entry.target.id}"]`, menu);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observerNav.observe(s));
})();

/* ============================================================
   2. HERO PARTICLES
   ============================================================ */
(function initHeroParticles() {
  const container = $('#hero-particles');
  if (!container) return;

  const count = window.innerWidth < 640 ? 18 : 35;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      background: ${Math.random() > 0.5 ? '#D4AF37' : '#F8F5F0'};
      border-radius: 50%;
      opacity: ${Math.random() * 0.6 + 0.1};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float-particle ${Math.random() * 10 + 8}s ease-in-out infinite ${Math.random() * 5}s alternate;
    `;
    container.appendChild(p);
  }

  // Add keyframe if not exists
  if (!document.getElementById('particle-kf')) {
    const style = document.createElement('style');
    style.id = 'particle-kf';
    style.textContent = `
      @keyframes float-particle {
        0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.1; }
        100% { transform: translateY(-80px) translateX(${Math.random() > 0.5 ? '' : '-'}40px) scale(1.3); opacity: 0.6; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ============================================================
   3. AOS (Animate on Scroll)
   ============================================================ */
(function initAOS() {
  const elements = $$('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.aosDelay || 0);
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   4. STATS COUNTER
   ============================================================ */
(function initStats() {
  const statEls = $$('[data-target]');
  if (!statEls.length) return;

  let triggered = false;

  const observer = new IntersectionObserver((entries) => {
    if (triggered) return;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggered = true;
        statEls.forEach(el => {
          const target = parseInt(el.dataset.target);
          const duration = 1800;
          const start = performance.now();

          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(ease * target) + '+';
            if (progress < 1) requestAnimationFrame(update);
          }

          requestAnimationFrame(update);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const statsRow = $('#stats-row');
  if (statsRow) observer.observe(statsRow);
})();

/* ============================================================
   5. GALLERY FILTER + LIGHTBOX
   ============================================================ */
(function initGallery() {
  const filterBtns = $$('.filter-btn');
  const items = $$('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
        if (match) {
          item.style.animation = 'none';
          item.offsetHeight; // reflow
          item.style.animation = 'gallery-appear 0.4s ease forwards';
        }
      });
    });
  });

  // Add gallery appear keyframe
  const style = document.createElement('style');
  style.textContent = `@keyframes gallery-appear { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`;
  document.head.appendChild(style);

  // Lightbox
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightbox-img');
  const lightboxCaption = $('#lightbox-caption');
  const lightboxClose = $('#lightbox-close');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-item-overlay span');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = caption ? caption.textContent : '';
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      lightbox.focus();
    });
  });

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (lightbox.style.display !== 'none') closeLightbox();
    }
  });
})();

/* ============================================================
   6. TESTIMONIALS SLIDER
   ============================================================ */
(function initTestimonials() {
  const slides = $$('.testimonial-slide');
  const prevBtn = $('#slider-prev');
  const nextBtn = $('#slider-next');
  const dotsContainer = $('#slider-dots');

  if (!slides.length) return;

  let current = 0;
  let autoInterval;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    $$('.slider-dot')[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    $$('.slider-dot')[current].classList.add('active');
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoInterval);
    autoInterval = setInterval(() => goTo(current + 1), 5500);
  }

  // Init first slide
  slides[0].classList.add('active');
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Swipe support
  let touchStartX = 0;
  const slider = $('#testimonials-slider');
  if (slider) {
    slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
    });
  }

  resetAuto();
})();

/* ============================================================
   7. VIDEO MODAL
   ============================================================ */
window.openVideo = function(url, title) {
  const modal = $('#video-modal');
  const iframe = $('#video-iframe');
  const titleEl = $('#video-modal-title');

  if (!modal) return;

  titleEl.textContent = title;
  iframe.src = url;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.closeVideo = function() {
  const modal = $('#video-modal');
  const iframe = $('#video-iframe');
  if (!modal) return;
  iframe.src = '';
  modal.style.display = 'none';
  document.body.style.overflow = '';
};

// Keyboard close for video
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const modal = $('#video-modal');
    if (modal && modal.style.display !== 'none') window.closeVideo();
  }
});

// Enter key for video thumbnails
$$('.video-thumbnail').forEach(thumb => {
  thumb.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      thumb.click();
    }
  });
});

/* ============================================================
   8. FLOATING WHATSAPP AGENT
   ============================================================ */
(function initWAAgent() {
  const agent = $('#wa-agent');
  const fab = $('#wa-fab-btn');
  const bubble = $('.wa-bubble', agent);
  const closeBtn = $('#wa-close-btn');

  if (!fab || !bubble) return;

  let isOpen = false;

  function openBubble() {
    isOpen = true;
    bubble.classList.add('visible');
    const notif = $('.wa-notif-dot', fab);
    if (notif) notif.style.display = 'none';
  }

  function closeBubble() {
    isOpen = false;
    bubble.classList.remove('visible');
  }

  fab.addEventListener('click', () => {
    if (isOpen) closeBubble(); else openBubble();
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeBubble();
  });

  // Auto popup after 5 seconds
  setTimeout(() => {
    if (!isOpen) openBubble();
  }, 5000);

  // Close on outside click
  document.addEventListener('click', e => {
    if (isOpen && !agent.contains(e.target)) closeBubble();
  });
})();

/* ============================================================
   9. CONTACT FORM → WHATSAPP
   ============================================================ */
(function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = $('#form-name').value.trim();
    const event = $('#form-event').value;
    const date = $('#form-date').value;
    const message = $('#form-message').value.trim();

    if (!name || !event || !date || !message) {
      showFormFeedback('Mohon lengkapi semua field yang diperlukan.', 'error');
      return;
    }

    const eventLabels = {
      wedding: 'Wedding',
      engagement: 'Engagement / Lamaran',
      birthday: 'Birthday',
      corporate: 'Corporate Event',
      other: 'Lainnya'
    };

    const wa_message = encodeURIComponent(
      `Halo Ferry Koesoema! 👋\n\nSaya tertarik dengan layanan Anda:\n\n` +
      `*Nama:* ${name}\n` +
      `*Jenis Acara:* ${eventLabels[event] || event}\n` +
      `*Tanggal Acara:* ${formatDate(date)}\n\n` +
      `*Pesan:*\n${message}\n\n` +
      `Mohon informasi lebih lanjut. Terima kasih! 🙏`
    );

    window.open(`https://wa.me/6282137020557?text=${wa_message}`, '_blank');
    showFormFeedback('Pesan dikirim ke WhatsApp! Kami akan segera menghubungi Anda. 🎉', 'success');
    form.reset();
  });

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  function showFormFeedback(msg, type) {
    let fb = $('#form-feedback');
    if (!fb) {
      fb = document.createElement('div');
      fb.id = 'form-feedback';
      form.parentNode.insertBefore(fb, form.nextSibling);
    }
    fb.textContent = msg;
    fb.style.cssText = `
      padding: 1rem 1.25rem;
      border-radius: 12px;
      font-size: 0.88rem;
      font-weight: 600;
      margin-top: 1rem;
      animation: fadeIn 0.3s ease;
      background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
      color: ${type === 'success' ? '#155724' : '#721c24'};
      border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
    `;
    setTimeout(() => { if (fb) fb.remove(); }, 5000);
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

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   11. FOOTER CONSTELLATION
   ============================================================ */
(function initFooterConstellation() {
  const canvas = $('#footer-constellation');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animFrame;
  let particles = [];
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 10000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: Math.random() > 0.7 ? '#D4AF37' : '#F8F5F0',
        opacity: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      // Wrap
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const pulseFactor = 0.6 + Math.sin(p.pulse) * 0.4;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * pulseFactor, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity * pulseFactor;
      ctx.fill();
    });

    // Draw connections (constellation lines)
    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#D4AF37';
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    animFrame = requestAnimationFrame(draw);
  }

  // Easter egg hover trigger
  const sig = $('#benchcode-signature');
  let hoverTimer = null;

  if (sig) {
    sig.addEventListener('mouseenter', () => {
      hoverTimer = setTimeout(() => {
        sig.classList.add('reveal');
      }, 3000);
    });

    sig.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      // Keep revealed once triggered for session
    });
  }

  // Observe footer visibility
  const footer = $('#footer');
  const footerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        resize();
        draw();
        footerObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });

  if (footer) footerObserver.observe(footer);

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrame);
    resize();
    draw();
  });
})();

/* ============================================================
   12. CTA PARTICLES
   ============================================================ */
(function initCTAParticles() {
  const container = $('#cta-particles');
  if (!container) return;

  const count = 25;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 5 + 2;
    const isGold = Math.random() > 0.4;
    p.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${isGold ? '#D4AF37' : '#F8F5F0'};
      opacity: ${Math.random() * 0.3 + 0.05};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: cta-float ${Math.random() * 12 + 8}s ease-in-out infinite ${Math.random() * 6}s alternate;
    `;
    container.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes cta-float {
      0% { transform: translateY(0) rotate(0deg); }
      100% { transform: translateY(-60px) rotate(180deg); }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   13. SMOOTH SECTION TRANSITIONS (cursor parallax on MC img)
   ============================================================ */
(function initMCParallax() {
  const mcImg = $('#mc-main-img');
  if (!mcImg) return;

  const section = $('#mc-section');

  section.addEventListener('mousemove', e => {
    const rect = section.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mcImg.style.transform = `scale(1.04) translate(${x * 10}px, ${y * 8}px)`;
  });

  section.addEventListener('mouseleave', () => {
    mcImg.style.transform = '';
  });
})();

/* ============================================================
   14. LAZY LOAD IMAGES
   ============================================================ */
(function initLazyLoad() {
  const lazyImgs = $$('img[loading="lazy"]');

  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported, nothing to do
    return;
  }

  // Fallback
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  lazyImgs.forEach(img => observer.observe(img));
})();

/* ============================================================
   15. SMOOTH SCROLL POLYFILL
   ============================================================ */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = $(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '80');
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   16. PERFORMANCE – Reduce animations on low-end devices
   ============================================================ */
(function checkPerfPreference() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ============================================================
   17. MOBILE-SPECIFIC ENHANCEMENTS
   ============================================================ */
(function initMobileEnhancements() {

  /* --- Fix 100vh pada mobile browser (address bar) --- */
  function setVhVariable() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  setVhVariable();
  window.addEventListener('resize', setVhVariable, { passive: true });
  window.addEventListener('orientationchange', () => {
    setTimeout(setVhVariable, 200);
  });

  /* --- Hamburger icon animation (3 garis → X) --- */
  const toggle = $('#nav-toggle');
  const menu = $('#nav-menu');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('open');
      const spans = toggle.querySelectorAll('span');
      if (isOpen) {
        // X shape
        if (spans[0]) spans[0].style.cssText = 'transform: rotate(45deg) translate(5px, 5px); background: #D4AF37;';
        if (spans[1]) spans[1].style.cssText = 'opacity: 0; transform: scaleX(0);';
        if (spans[2]) spans[2].style.cssText = 'transform: rotate(-45deg) translate(5px, -5px); background: #D4AF37;';
      } else {
        // Reset
        spans.forEach(s => s.style.cssText = '');
      }
    });

    // Reset spans when link clicked
    $$('.nav-link', menu).forEach(link => {
      link.addEventListener('click', () => {
        toggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
      });
    });
  }

  /* --- Prevent iOS double-tap zoom on buttons & links --- */
  let lastTap = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('a')) {
        e.preventDefault();
        e.target.click && e.target.click();
      }
    }
    lastTap = now;
  }, { passive: false });

  /* --- Prevent iOS form zoom (font-size < 16px triggers zoom) --- */
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    const style = document.createElement('style');
    style.textContent = `
      input, select, textarea {
        font-size: 16px !important;
      }
    `;
    document.head.appendChild(style);
  }

  /* --- Gallery touch swipe (horizontal filter scroll) --- */
  const galleryFilter = $('#gallery-filter');
  if (galleryFilter) {
    let isDown = false;
    let startX, scrollLeft;

    galleryFilter.addEventListener('touchstart', e => {
      isDown = true;
      startX = e.touches[0].pageX - galleryFilter.offsetLeft;
      scrollLeft = galleryFilter.scrollLeft;
    }, { passive: true });

    galleryFilter.addEventListener('touchmove', e => {
      if (!isDown) return;
      const x = e.touches[0].pageX - galleryFilter.offsetLeft;
      const walk = (x - startX) * 1.5;
      galleryFilter.scrollLeft = scrollLeft - walk;
    }, { passive: true });

    galleryFilter.addEventListener('touchend', () => { isDown = false; });
  }

  /* --- Singers section: swipe left/right between cards on mobile --- */
  const singersPackages = $('#singers-packages');
  if (singersPackages && window.innerWidth <= 480) {
    singersPackages.style.cssText = `
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      gap: 1rem;
      padding: 0.5rem 0 1rem;
    `;
    singersPackages.style.setProperty('--webkit-scrollbar', 'none');

    $$('.singer-card', singersPackages).forEach(card => {
      card.style.cssText = `
        flex: 0 0 85%;
        scroll-snap-align: start;
        min-width: 85%;
      `;
    });

    // Add CSS for scrollbar hide
    const style = document.createElement('style');
    style.textContent = `#singers-packages::-webkit-scrollbar { display: none; }`;
    document.head.appendChild(style);
  }

  /* --- Services: swipe on mobile --- */
  const servicesGrid = $('#services-grid');
  if (servicesGrid && window.innerWidth <= 480) {
    let touchStartX = 0;
    servicesGrid.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  }

  /* --- Scroll navbar: on mobile show when scrolling UP, hide scrolling DOWN --- */
  const navbar = $('#navbar');
  if (navbar && window.innerWidth <= 640) {
    let lastY = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          if (currentY > lastY && currentY > 100) {
            navbar.style.transform = 'translateY(-100%)';
          } else {
            navbar.style.transform = 'translateY(0)';
          }
          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* --- Testimonial card: prevent accidental scroll-close --- */
  const testimonialSlider = $('#testimonials-slider');
  if (testimonialSlider) {
    testimonialSlider.addEventListener('touchstart', e => {
      e.stopPropagation();
    }, { passive: true });
  }

  /* --- Fix hero height with CSS variable on mobile --- */
  const heroEl = $('.hero');
  if (heroEl) {
    const style = document.createElement('style');
    style.textContent = `.hero { min-height: calc(var(--vh, 1vh) * 100); }`;
    document.head.appendChild(style);
  }

  /* --- Add active tap feedback on cards (mobile touch) --- */
  const tapElements = $$('.service-card, .why-card, .singer-card, .highlight-item, .mc-service-card');
  tapElements.forEach(el => {
    el.addEventListener('touchstart', () => {
      el.style.opacity = '0.85';
    }, { passive: true });
    el.addEventListener('touchend', () => {
      setTimeout(() => { el.style.opacity = ''; }, 150);
    }, { passive: true });
  });

})();

/* ============================================================
   INIT LOG
   ============================================================ */
console.log('%c✦ Ferry Koesoema – Professional MC & Koesoema Singers ✦', 'color: #D4AF37; font-size: 14px; font-weight: bold;');
console.log('%cWebsite crafted by BenchCode Dev with ❤️', 'color: #7A5C45; font-size: 11px;');

