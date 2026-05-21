(function () {
  'use strict';

  /* ===================================================
     1. VSL play button — laad YouTube iframe bij klik
        Gebruik data-src op #vslData voor de YouTube URL
  =================================================== */
  var vslPlayBtn   = document.getElementById('vslPlayBtn');
  var vslPlayer    = document.getElementById('vslPlayer');
  var vslIframeWrap = document.getElementById('vslIframeWrap');
  var vslData      = document.getElementById('vslData');

  function loadVsl() {
    if (!vslData || !vslIframeWrap || !vslPlayer) return;

    var src = vslData.getAttribute('data-vsl-src');
    if (!src || src.indexOf('VIDEO_ID') !== -1) {
      // Geen echte YouTube URL ingesteld — toon placeholder bericht
      var msg = document.createElement('div');
      msg.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.55);font-size:.9rem;text-align:center;padding:1rem;';
      msg.textContent = 'Video binnenkort beschikbaar.';
      vslPlayer.appendChild(msg);
      // Verberg thumbnail
      var thumb = vslPlayer.querySelector('.vsl-thumbnail');
      if (thumb) thumb.style.display = 'none';
      return;
    }

    // Bouw iframe met autoplay
    var separator = src.indexOf('?') !== -1 ? '&' : '?';
    var autoplaySrc = src + separator + 'autoplay=1&rel=0&modestbranding=1';

    var iframe = document.createElement('iframe');
    iframe.src = autoplaySrc;
    iframe.title = 'Lappers – Glazenwasser Nijmegen';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';

    vslIframeWrap.innerHTML = '';
    vslIframeWrap.appendChild(iframe);
    vslIframeWrap.hidden = false;

    // Verberg de thumbnail
    var thumb = vslPlayer.querySelector('.vsl-thumbnail');
    if (thumb) thumb.style.display = 'none';
  }

  if (vslPlayBtn) {
    vslPlayBtn.addEventListener('click', loadVsl);
    vslPlayBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadVsl();
      }
    });
  }

  /* ===================================================
     2. Formulier validatie + submit feedback
        Werkt op zowel #lpForm (hero) als #lpFormFull
  =================================================== */
  function setupLpForm(formId) {
    var form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      var nameField  = form.querySelector('[name="name"]');
      var phoneField = form.querySelector('[name="phone"]');

      if (nameField) {
        var nameOk = nameField.value.trim().length >= 2;
        nameField.classList.toggle('error', !nameOk);
        if (!nameOk) valid = false;
      }

      if (phoneField) {
        var phoneVal = phoneField.value.replace(/\s/g, '');
        var phoneOk = phoneVal.length >= 9 && /^[0-9+\-\s()]+$/.test(phoneField.value);
        phoneField.classList.toggle('error', !phoneOk);
        if (!phoneOk) valid = false;
      }

      if (valid) {
        var submitBtn = form.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Aanvraag verstuurd!';
        submitBtn.style.background = '#22C55E';
        submitBtn.style.borderColor = '#22C55E';

        var notice = form.querySelector('.form__notice');
        if (notice) {
          notice.textContent = 'Bedankt. Ik bel u terug binnen 24 uur.';
          notice.style.color = '#22C55E';
        }
      }
    });

    // Verwijder error class bij typen
    form.querySelectorAll('input').forEach(function (el) {
      el.addEventListener('input', function () { el.classList.remove('error'); });
    });
  }

  setupLpForm('lpForm');
  setupLpForm('lpFormFull');

  /* ===================================================
     3. FAQ accordion (LP-pagina)
     Hergebruikt dezelfde .faq__q structuur als main.js,
     maar main.js initialiseert ook de FAQ op deze pagina.
     Dit bestand doet niets extra's voor FAQ tenzij main.js
     niet geladen is — dit is een veiligheidsnet.
  =================================================== */
  // main.js initialiseert al alle .faq__q elementen op de pagina.
  // Geen duplicate listener nodig.

})();
