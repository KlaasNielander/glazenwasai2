(function () {
  'use strict';

  /* ── Cookie banner ── */
  var banner = document.getElementById('cookieBanner');

  window.cookieChoice = function (accepted) {
    try { localStorage.setItem('cookieChoice', accepted ? 'accepted' : 'declined'); } catch (e) {}
    if (banner) { banner.classList.remove('visible'); banner.style.display = 'none'; }
  };

  try {
    if (!localStorage.getItem('cookieChoice') && banner) {
      setTimeout(function () { banner.classList.add('visible'); }, 1200);
    }
  } catch (e) {}

  /* ── Nav shadow on scroll ── */
  var nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Contact form ── */
  var contactForm = document.getElementById('contactForm');
  var successMsg  = document.getElementById('successMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameField  = contactForm.querySelector('[name="naam"]');
      var phoneField = contactForm.querySelector('[name="telefoon"]');
      var valid = true;

      if (nameField && nameField.value.trim().length < 2) {
        nameField.style.borderColor = '#ef4444';
        nameField.focus();
        valid = false;
      }
      if (phoneField && phoneField.value.replace(/\s/g, '').length < 9) {
        phoneField.style.borderColor = '#ef4444';
        if (valid) phoneField.focus();
        valid = false;
      }

      if (!valid) return;

      var btn = contactForm.querySelector('[type="submit"]');
      btn.disabled    = true;
      btn.textContent = 'Bezig met versturen…';

      fetch('https://formspree.io/f/mzdwpyqb', {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(contactForm)
      })
      .then(function (res) {
        if (res.ok) {
          contactForm.reset();
          contactForm.style.display = 'none';
          if (successMsg) successMsg.classList.add('visible');
        } else {
          btn.disabled    = false;
          btn.textContent = 'Verstuur aanvraag →';
          alert('Er ging iets mis. Probeer het opnieuw of bel direct: 06 290 106 30');
        }
      })
      .catch(function () {
        btn.disabled    = false;
        btn.textContent = 'Verstuur aanvraag →';
        alert('Er ging iets mis. Probeer het opnieuw of bel direct: 06 290 106 30');
      });
    });

    contactForm.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', function () { el.style.borderColor = ''; });
    });
  }

})();
