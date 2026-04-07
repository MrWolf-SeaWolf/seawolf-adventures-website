/* ═══════════════════════════════════════════════════════════════════════
   Sea Wolf Adventures: Main JS
   Handles: nav scroll state, mobile menu, scroll fade-in animations,
            video hero fallback, Formspree contact form
   Pure vanilla JS; no dependencies
   ══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Nav: darken on scroll ──────────────────────────────────────── */
  const nav = document.querySelector('.nav') ||
              document.querySelector('.site-header');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active nav link ────────────────────────────────────────────── */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const normalize = p => p.replace(/\/$/, '') || '/';
    if (normalize(currentPath) === normalize(href) ||
        (href !== '/' && currentPath.startsWith(href))) {
      link.classList.add('active');
    }
  });

  /* ── Mobile nav: checkbox toggle (homepage, about, contact) ─────── */
  const navToggle = document.querySelector('.nav-toggle');
  if (navToggle) {
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.checked = false;
      });
    });
  }

  /* ── Mobile nav: button toggle (inner pages with .nav-toggle btn) ─ */
  const navToggleBtn = document.querySelector('button.nav-toggle');
  if (navToggleBtn) {
    const navLinks = document.querySelector('.nav-links');
    navToggleBtn.addEventListener('click', () => {
      const expanded = navToggleBtn.getAttribute('aria-expanded') === 'true';
      navToggleBtn.setAttribute('aria-expanded', String(!expanded));
      if (navLinks) navLinks.classList.toggle('open');
    });
    // Close on link click
    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navToggleBtn.setAttribute('aria-expanded', 'false');
          navLinks.classList.remove('open');
        });
      });
    }
  }

  /* ── Video Hero: fallback to poster/image if video cannot play ──── */
  const heroVideo = document.querySelector('.hero-video');
  const heroSection = document.querySelector('.hero--video');
  if (heroVideo && heroSection) {
    // Check if the video has any <source> children
    const sources = heroVideo.querySelectorAll('source');
    if (sources.length === 0) {
      // No video sources provided; show fallback image
      heroSection.classList.add('hero--video-fallback');
    } else {
      // Video sources exist; listen for errors
      heroVideo.addEventListener('error', function () {
        heroSection.classList.add('hero--video-fallback');
      }, true);

      // Also handle the case where video stalls or never starts
      let videoStarted = false;
      heroVideo.addEventListener('playing', function () {
        videoStarted = true;
      });
      setTimeout(function () {
        if (!videoStarted) {
          heroSection.classList.add('hero--video-fallback');
        }
      }, 4000);
    }

    // On slow connections, prefer the image
    if (navigator.connection) {
      var conn = navigator.connection;
      if (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
        heroSection.classList.add('hero--video-fallback');
      }
    }
  }

  /* ── Scroll fade-in (IntersectionObserver) ──────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Lazy-load images fallback (for older browsers) ─────────────── */
  if ('loading' in HTMLImageElement.prototype === false) {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imgObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) img.src = img.dataset.src;
            imgObserver.unobserve(img);
          }
        });
      });
      lazyImgs.forEach(img => imgObserver.observe(img));
    }
  }

  /* ── Smooth scroll for anchor links ─────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navH = nav ? nav.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Contact form: Formspree submission with fetch ──────────────── */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';

      // Show loading state
      if (btn) {
        btn.textContent = 'Sending...';
        btn.disabled = true;
        btn.style.cursor = 'wait';
      }

      // Submit via fetch to Formspree
      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          // Success
          if (btn) {
            btn.textContent = 'Enquiry Sent; We Will Be In Touch';
            btn.style.background = 'var(--forest-mid)';
            btn.style.cursor = 'default';
          }
          contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(function () {
        // Fallback: open mailto
        if (btn) {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.cursor = 'pointer';
        }
        window.location.href = 'mailto:lodge@seawolfadventures.ca?subject=Website Enquiry';
      });
    });
  }

})();

// Handle mobile menu scroll leak
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
});
