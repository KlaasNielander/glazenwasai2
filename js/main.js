(function () {
  'use strict';

  /* ===================================================
     1. Topbar close + sessionStorage
  =================================================== */
  var topbar     = document.getElementById('topbar');
  var topbarClose = document.getElementById('topbarClose');
  var nav        = document.getElementById('nav');

  function hideTopbar() {
    if (!topbar) return;
    topbar.classList.add('hidden');
    if (nav) nav.classList.add('topbar-hidden');
    try { sessionStorage.setItem('topbar-closed', '1'); } catch (_) {}
  }

  if (topbarClose) topbarClose.addEventListener('click', hideTopbar);

  try {
    if (sessionStorage.getItem('topbar-closed')) hideTopbar();
  } catch (_) {}

  /* ===================================================
     2. Nav: transparent → scrolled class op scroll
  =================================================== */
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ===================================================
     3. Mobile menu toggle
  =================================================== */
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Sluit menu bij klik op een link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Sluit menu bij klik buiten de nav
    document.addEventListener('click', function (e) {
      if (navLinks.classList.contains('open') && !nav.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ===================================================
     4. FAQ accordion
  =================================================== */
  document.querySelectorAll('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var answer  = btn.nextElementSibling;
      var isOpen  = btn.getAttribute('aria-expanded') === 'true';

      // Sluit alle andere items
      document.querySelectorAll('.faq__q').forEach(function (b) {
        if (b !== btn) {
          b.setAttribute('aria-expanded', 'false');
          var a = b.nextElementSibling;
          if (a) a.hidden = true;
        }
      });

      // Toggle huidig item
      var newState = !isOpen;
      btn.setAttribute('aria-expanded', String(newState));
      if (answer) answer.hidden = !newState;
    });
  });

  /* ===================================================
     5. Contactformulier validatie + submit feedback
  =================================================== */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      var required = ['firstName', 'lastName', 'phone', 'email'];
      required.forEach(function (id) {
        var field = document.getElementById(id);
        if (!field) return;

        var value = field.value.trim();
        var ok = value.length > 0;

        if (id === 'email') {
          ok = ok && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        if (id === 'phone') {
          ok = ok && value.replace(/\s/g, '').length >= 9;
        }

        field.classList.toggle('error', !ok);
        if (!ok) valid = false;
      });

      if (valid) {
        var submitBtn = contactForm.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Aanvraag verstuurd!';
        submitBtn.style.background = '#22C55E';
        submitBtn.style.borderColor = '#22C55E';

        // Toon succesbericht
        var notice = contactForm.querySelector('.form__notice');
        if (notice) {
          notice.textContent = 'Bedankt. Ik neem binnen 24 uur contact met u op.';
          notice.style.color = '#22C55E';
        }
      }
    });

    // Verwijder error class bij typen
    contactForm.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', function () { el.classList.remove('error'); });
    });
  }

  /* ===================================================
     6. IntersectionObserver fade-in voor cards & stappen
  =================================================== */
  if ('IntersectionObserver' in window) {
    var targets = document.querySelectorAll(
      '.bento-card, .review-card, .step, .faq__item, .area-tag, .benefit-item, .lp-step'
    );

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    targets.forEach(function (el, i) {
      el.classList.add('fade-in');
      // Stagger vertraging voor grid-items
      el.style.transitionDelay = (i % 4) * 0.07 + 's';
      observer.observe(el);
    });
  }

  /* ===================================================
     7. Marquee: dupliceer content voor naadloze loop
     (HTML heeft al twee .marquee-inner spans; dit is
     een veiligheidsmaatregel voor browsers die no-wrap
     trunceren)
  =================================================== */
  var marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    var inners = marqueeTrack.querySelectorAll('.marquee-inner');
    // Zorg dat er minstens 2 kopieën zijn voor de loop
    if (inners.length === 1) {
      var clone = inners[0].cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marqueeTrack.appendChild(clone);
    }
  }

})();
