/*! FethiyeninUstası · runtime.js
 * Amaç: minimum bağımlılık ile ortak etkileşimler (smooth scroll, TOC spy, accordion tek-açık, howto anim, lazy embed)
 * Not: Tüm script'ler <script defer> ile yüklenecek. 3rd-party yoktur. */
(() => {
  'use strict';

  // ---- KÜÇÜK YARDIMCILAR ---------------------------------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const off = (el, ev, fn, opts) => el && el.removeEventListener(ev, fn, opts);

  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smoothBehavior = prefersReduced ? 'auto' : 'smooth';

  const App = (window.App = window.App || {});
  App.state = App.state || {};
  App.utils = { $, $$, on, off };

  // ---- SMOOTH SCROLL (İÇ LİNKLER) ------------------------------------------
  function enableSmoothAnchors() {
    const anchors = $$('a[href^="#"]');
    anchors.forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      on(a, 'click', e => {
        // Yalnız aynı sayfa hedefleri
        const targetId = decodeURIComponent(href.slice(1));
        const target = document.getElementById(targetId);
        if (!target) return;
        e.preventDefault();
        // CSS tarafında section'lara scroll-margin-top tanımlayabilirsiniz.
        target.scrollIntoView({ behavior: smoothBehavior, block: 'start' });
        // URL hash'i sıçrama yapmadan güncelle
        history.pushState(null, '', `#${encodeURIComponent(targetId)}`);
      });
    });
  }

  // ---- TOC SCROLL-SPY (chip'lerde aktif bölüm) ------------------------------
  function enableTocSpy() {
    const toc = $('.toc');
    if (!toc) return;

    const sections = $$('.sec[id]');
    if (!sections.length) return;

    const map = new Map(); // id -> <a>
    $$('.toc a[href^="#"]', toc).forEach(a => {
      const id = a.getAttribute('href').slice(1);
      if (id) map.set(id, a);
    });

    let active;
    const setActive = id => {
      if (active === id) return;
      if (active && map.get(active)) map.get(active).classList.remove('is-active');
      if (map.get(id)) map.get(id).classList.add('is-active');
      active = id;
    };

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      // Üstte %30, altta %65 ofset; header yüksekliğine göre CSS'te ayarlamak daha sağlıklıdır.
      { root: null, rootMargin: '-30% 0px -65% 0px', threshold: 0.01 }
    );

    sections.forEach(sec => io.observe(sec));
  }

  // ---- ACCORDION (details) tek-açık mod ------------------------------------
  function enableAccordions() {
    $$('.accordion').forEach(acc => {
      const items = $$('details', acc);
      items.forEach(d => {
        on(d, 'toggle', () => {
          if (d.open) {
            items.forEach(o => {
              if (o !== d && o.open) o.open = false;
            });
          }
        });
      });
    });
  }

  // ---- HOWTO adımları görünürken sınıf ekle --------------------------------
  function enableHowtoSteps() {
    const steps = $$('.steps .step');
    if (!steps.length) return;

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('is-in');
        });
      },
      { root: null, rootMargin: '0px 0px -20% 0px', threshold: 0.1 }
    );

    steps.forEach(s => io.observe(s));
  }

  // ---- LAZY EMBED (iframe/video[data-src]) ---------------------------------
  function enableLazyEmbeds() {
    const embeds = $$('iframe[data-src], video[data-src], img[data-src]');
    if (!embeds.length) return;

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const src = el.getAttribute('data-src');
          const srcset = el.getAttribute('data-srcset');
          if (src) el.setAttribute('src', src);
          if (srcset && 'srcset' in el) el.setAttribute('srcset', srcset);
          el.removeAttribute('data-src');
          el.removeAttribute('data-srcset');
          el.classList.add('is-loaded');
          io.unobserve(el);
        });
      },
      { root: null, rootMargin: '200px 0px', threshold: 0.01 }
    );

    embeds.forEach(el => io.observe(el));
  }

  // ---- FOCUS-RING yalnız klavye ile görünür --------------------------------
  function enableFocusRing() {
    const root = document.documentElement;
    const onKey = e => {
      if (e.key === 'Tab') {
        root.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', onKey);
        window.addEventListener('mousedown', onMouse);
      }
    };
    const onMouse = () => {
      document.documentElement.classList.remove('user-is-tabbing');
      window.removeEventListener('mousedown', onMouse);
      window.addEventListener('keydown', onKey);
    };
    window.addEventListener('keydown', onKey);
  }

  // ---- INIT -----------------------------------------------------------------
  function init() {
    // Dil bilgisi (ileride i18n kullanımı için)
    App.lang = document.documentElement.lang || 'tr';

    enableSmoothAnchors();
    enableTocSpy();
    enableAccordions();
    enableHowtoSteps();
    enableLazyEmbeds();
    enableFocusRing();

    document.body.classList.add('js-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
