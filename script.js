(function () {
  'use strict';

  /* idioma pt/en */
  var current = 'pt';
  try { current = localStorage.getItem('lang') === 'en' ? 'en' : 'pt'; } catch (e) {}
  var langButtons = [].slice.call(document.querySelectorAll('.lang__btn'));

  function applyLang(lang) {
    current = lang;
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.querySelectorAll('[data-pt][data-en]').forEach(function (el) { el.innerHTML = el.getAttribute('data-' + lang); });
    document.querySelectorAll('[data-pt-aria][data-en-aria]').forEach(function (el) { el.setAttribute('aria-label', el.getAttribute('data-' + lang + '-aria')); });
    langButtons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
    var t = document.querySelector('title');
    if (t && t.getAttribute('data-' + lang)) document.title = t.getAttribute('data-' + lang);
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }
  langButtons.forEach(function (b) { b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); }); });
  applyLang(current);

  /* menu mobile */
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.nav__burger');
  function closeMenu() { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    burger.setAttribute('aria-expanded', nav.classList.toggle('is-open') ? 'true' : 'false');
  });
  nav.querySelectorAll('.nav__links a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); burger.focus(); }
  });

  /* filtros */
  var filterButtons = [].slice.call(document.querySelectorAll('.filters .pill'));
  var projects = [].slice.call(document.querySelectorAll('.project[data-cat]'));
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      projects.forEach(function (p) {
        var cats = (p.getAttribute('data-cat') || '').split(' ');
        p.classList.toggle('is-hidden', !(cat === 'all' || cats.indexOf(cat) !== -1));
      });
    });
  });

  /* copiar e-mail */
  var copyBtn = document.getElementById('copy-email');
  var copied = document.getElementById('copied');
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(copyBtn.getAttribute('data-email')).then(function () {
        copied.hidden = false;
        clearTimeout(copied._t);
        copied._t = setTimeout(function () { copied.hidden = true; }, 1800);
      });
    });
  } else if (copyBtn) { copyBtn.hidden = true; }

  /* entrada ao rolar */
  var items = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('is-in'); }); }
})();
