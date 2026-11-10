// Saffron & Steam – infaden bij scrollen en het MailerLite-formulier

// Tekst en beelden rustig laten infaden zodra ze in beeld komen
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();

// Inschrijven: velden controleren en versturen naar MailerLite zonder de pagina te verlaten
(function () {
  var wrap = document.getElementById('ml-form');
  if (!wrap) return;
  var form = wrap.querySelector('form');
  var email = form.querySelector('#ml-email');
  var optin = form.querySelector('#ml-optin');
  var success = wrap.querySelector('.ml-success');
  var error = wrap.querySelector('.ml-error');
  var button = form.querySelector('button[type="submit"]');

  function setInvalid(input, errId, invalid) {
    input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    document.getElementById(errId).hidden = !invalid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var emailOk = email.value.trim() !== '' && email.checkValidity();
    setInvalid(email, 'ml-email-err', !emailOk);
    setInvalid(optin, 'ml-optin-err', !optin.checked);
    if (!emailOk) { email.focus(); return; }
    if (!optin.checked) { optin.focus(); return; }

    error.hidden = true;
    button.disabled = true;
    button.textContent = 'Even geduld…';

    fetch(form.action, { method: 'POST', body: new FormData(form) })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data || !data.success) throw new Error('MailerLite');
        form.hidden = true;
        success.hidden = false;
      })
      .catch(function () {
        error.hidden = false;
        button.disabled = false;
        button.textContent = 'Inschrijven';
      });
  });
})();
