(function () {
  'use strict';

  var form = document.getElementById('lpForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    ['lpName', 'lpPhone', 'lpEmail'].forEach(function (id) {
      var field = document.getElementById(id);
      if (!field) return;
      var ok = field.value.trim().length > 0 &&
        (id !== 'lpEmail' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value));
      field.classList.toggle('error', !ok);
      if (!ok) valid = false;
    });

    if (valid) {
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Aanvraag verstuurd! Ik bel je snel.';
      // Replace with actual form submission as needed
    }
  });

  form.querySelectorAll('input').forEach(function (el) {
    el.addEventListener('input', function () { el.classList.remove('error'); });
  });
})();
