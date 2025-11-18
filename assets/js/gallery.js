/*! FethiyeninUstası · gallery.js
 * Amaç: <dialog class="lightbox"> ile galeri/lightbox davranışı
 * Özellikler: grup dolaşımı (←/→), ESC ile kapanış, focus trap, komşu preload, caption/alt aktarımı
 */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  const App = (window.App = window.App || {});
  App.gallery = App.gallery || {};

  // ---- Galeri öğelerini grupla (data-lightbox="group") ----------------------
  function collectGalleries(scope = document) {
    const groups = new Map(); // groupName -> [{href, caption, anchor, thumb}]
    $$('a[data-lightbox]', scope).forEach(a => {
      const group = a.getAttribute('data-lightbox') || '_';
      const href = a.getAttribute('href');
      if (!href) return;

      // Caption: <figcaption> varsa onu, yoksa img alt / a.title
      let caption = '';
      const fig = a.closest('figure');
      if (fig) {
        const fc = $('figcaption', fig);
        caption = fc ? fc.textContent.trim() : '';
      }
      if (!caption) {
        const img = $('img', a);
        caption = img?.getAttribute('alt')?.trim() || a.getAttribute('title') || '';
      }

      const thumb = $('img', a)?.getAttribute('src') || '';
      const item = { href, caption, anchor: a, thumb };
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(item);
    });
    return groups;
  }

  // ---- Dialog yardımcıları ---------------------------------------------------
  function getDialogFor(anchor) {
    // Önce en yakın section/container içinde bir dialog ara, yoksa sayfada ilk lightbox'ı kullan
    const local = anchor.closest('[data-component="lightbox"]');
    return (local && $('dialog.lightbox', local)) || $('dialog.lightbox');
  }

  function supportsDialog() {
    return typeof HTMLDialogElement !== 'undefined' && 'showModal' in HTMLDialogElement.prototype;
  }

  function lockScroll(lock) {
    const root = document.documentElement;
    if (lock) {
      root.classList.add('scroll-lock');
      root.style.overflow = 'hidden';
    } else {
      root.classList.remove('scroll-lock');
      root.style.overflow = '';
    }
  }

  // Focus trap: dialog içinde TAB dolaşımı
  function trapFocus(dialog, enable) {
    const FOCUSABLE = [
      'a[href]',
      'area[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    function onKey(e) {
      if (e.key !== 'Tab') return;
      const nodes = $$(FOCUSABLE, dialog).filter(n => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }

    if (enable) {
      dialog.__focusHandler = onKey;
      on(dialog, 'keydown', onKey);
    } else if (dialog.__focusHandler) {
      dialog.removeEventListener('keydown', dialog.__focusHandler);
      dialog.__focusHandler = null;
    }
  }

  // ---- Lightbox ana akış ----------------------------------------------------
  function openLightbox(dialog, groupItems, startIndex = 0) {
    if (!groupItems || !groupItems.length) return;

    // UI referansları
    const img = $('.lightbox__img', dialog);
    const captionEl = $('.lightbox__caption', dialog);
    let closeBtn = $('[data-action="close"]', dialog);
    let prevBtn = $('[data-action="prev"]', dialog);
    let nextBtn = $('[data-action="next"]', dialog);

    // Eksikse ileri/geri düğmeleri ekle
    if (!prevBtn) {
      prevBtn = document.createElement('button');
      prevBtn.className = 'lightbox__prev';
      prevBtn.setAttribute('data-action', 'prev');
      prevBtn.setAttribute('aria-label', 'Önceki');
      prevBtn.textContent = '‹';
      dialog.appendChild(prevBtn);
    }
    if (!nextBtn) {
      nextBtn = document.createElement('button');
      nextBtn.className = 'lightbox__next';
      nextBtn.setAttribute('data-action', 'next');
      nextBtn.setAttribute('aria-label', 'Sonraki');
      nextBtn.textContent = '›';
      dialog.appendChild(nextBtn);
    }

    // Durum
    dialog.__group = groupItems;
    dialog.__index = startIndex;

    function show(idx) {
      if (idx < 0) idx = groupItems.length - 1;
      if (idx >= groupItems.length) idx = 0;

      const item = groupItems[idx];
      dialog.__index = idx;

      // Görsel yükle
      if (img) {
        img.src = item.href;
        img.alt = item.caption || '';
      }
      if (captionEl) captionEl.textContent = item.caption || '';

      // Komşuları preload
      preloadAround(groupItems, idx);

      // Odak
      (closeBtn || dialog).focus();
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'ArrowLeft') {
        show(dialog.__index - 1);
      } else if (e.key === 'ArrowRight') {
        show(dialog.__index + 1);
      }
    }

    function onClick(e) {
      const action = e.target.getAttribute && e.target.getAttribute('data-action');
      if (action === 'close') {
        e.preventDefault();
        close();
      } else if (action === 'prev') {
        e.preventDefault();
        show(dialog.__index - 1);
      } else if (action === 'next') {
        e.preventDefault();
        show(dialog.__index + 1);
      } else if (e.target === dialog) {
        // (dialog) arka plana tıklama
        close();
      }
    }

    function close() {
      document.removeEventListener('keydown', onKey);
      trapFocus(dialog, false);
      lockScroll(false);

      if (supportsDialog()) {
        dialog.close();
      } else {
        dialog.classList.remove('is-open');
        dialog.removeAttribute('open');
      }
    }

    // Açılış
    if (supportsDialog()) {
      dialog.showModal();
    } else {
      // Basit fallback
      dialog.setAttribute('open', '');
      dialog.classList.add('is-open');
    }
    lockScroll(true);
    trapFocus(dialog, true);
    document.addEventListener('keydown', onKey);
    on(dialog, 'click', onClick);
    on(dialog, 'close', () => {
      trapFocus(dialog, false);
      lockScroll(false);
      dialog.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    }, { once: true });

    show(startIndex);
  }

  function preloadAround(items, idx) {
    const prev = items[(idx - 1 + items.length) % items.length];
    const next = items[(idx + 1) % items.length];
    [prev, next].forEach(it => {
      if (!it) return;
      const im = new Image();
      im.src = it.href;
    });
  }

  // ---- BAĞLAMA --------------------------------------------------------------
  function bindLightbox(scope = document) {
    const groups = collectGalleries(scope);
    if (!groups.size) return;

    groups.forEach((items, groupName) => {
      items.forEach((it, i) => {
        on(it.anchor, 'click', ev => {
          // Sadece sol tık + modifiers yok
          if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
          ev.preventDefault();
          const dialog = getDialogFor(it.anchor);
          openLightbox(dialog, items, i);
        });
      });
    });
  }

  // ---- INIT -----------------------------------------------------------------
  function init() {
    bindLightbox(document);
    document.body.classList.add('gallery-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
