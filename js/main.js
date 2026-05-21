(function () {
  'use strict';

  // Announce bar close
  const announceBar = document.getElementById('announceBar');
  const closeBtn    = document.getElementById('closeAnnounce');
  const nav         = document.getElementById('nav');

  function hideAnnounce() {
    announceBar.classList.add('hidden');
    nav.classList.add('announce-hidden');
    try { sessionStorage.setItem('announce-closed', '1'); } catch (_) {}
  }

  if (closeBtn) closeBtn.addEventListener('click', hideAnnounce);
  if (sessionStorage.getItem('announce-closed')) hideAnnounce();

  // Sticky nav shadow on scroll
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const answer  = btn.nextElementSibling;
      const open    = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.faq__q').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        const a = b.nextElementSibling;
        if (a) {
          a.hidden = true;
          a.style.maxHeight = null;
        }
      });

      // Open this one if it was closed
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });

  // Form validation + feedback
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      ['firstName', 'lastName', 'phone', 'email'].forEach(function (id) {
        const field = document.getElementById(id);
        if (!field) return;
        const ok = field.value.trim().length > 0 &&
          (id !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value));
        field.classList.toggle('error', !ok);
        if (!ok) valid = false;
      });

      if (valid) {
        const btn = form.querySelector('[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Aanvraag verstuurd!';
        // Replace with actual form submission (e.g. fetch POST) as needed
      }
    });

    // Remove error on input
    form.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', function () { el.classList.remove('error'); });
    });
  }

  // Intersection-based fade-in for sections
  if ('IntersectionObserver' in window) {
    var style = document.createElement('style');
    style.textContent = '.fade-in{opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease}.fade-in.visible{opacity:1;transform:none}';
    document.head.appendChild(style);

    var targets = document.querySelectorAll('.service-card, .review-card, .step, .faq__item, .area-tag');
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    targets.forEach(function (el) {
      el.classList.add('fade-in');
      obs.observe(el);
    });
  }
})();
