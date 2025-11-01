/* FethiyeninUstası — gallery.js
   Kapsam: SADECE <main data-page="home"> içindeki #gallery
   İçerik: filtre toolbar, <dialog> lightbox (+fallback), klavye navigasyonu
*/
(() => {
  'use strict';

  const doc = document;
  const main = doc.querySelector('main#main.site-main[data-page="home"]');
  if (!main) return;

  // --- Seçiciler ---
  const section = main.querySelector('#gallery');
  if (!section) return;
  const list = section.querySelector('[data-gallery]');
  const filterBar = section.querySelector('.filters');
  const dlg = section.querySelector('#lightbox'); // <dialog>
  const supportsDialog = typeof window.HTMLDialogElement !== 'undefined' && dlg instanceof HTMLDialogElement;

  // --- Yardımcılar ---
  const $$ = (sel, root = main) => Array.from(root.querySelectorAll(sel));
  const on = (el, type, fn, opts) => el && el.addEventListener(type, fn, opts);
  const delegate = (root, sel, type, fn, opts) => {
    if (!root) return;
    root.addEventListener(type, (e) => {
      const target = e.target.closest(sel);
      if (target && root.contains(target)) fn(e, target);
    }, opts);
  };
  const lockScroll = (lock) => {
    const html = doc.documentElement;
    if (lock) {
      html.dataset.scrollLock = '1';
      html.style.overflow = 'hidden';
    } else {
      delete html.dataset.scrollLock;
      html.style.overflow = '';
    }
  };
  const visibleItems = () => {
    return Array.from(list.querySelectorAll('.gallery__item')).filter(li => !li.hidden);
  };
  const currentLang = () => doc.documentElement.lang || 'tr-TR';

  // --- Filtreleme ---
  if (filterBar) {
    const setActive = (btn) => {
      Array.from(filterBar.querySelectorAll('.filter')).forEach(b => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    };

    const applyFilter = (key) => {
      const items = Array.from(list.querySelectorAll('.gallery__item'));
      items.forEach(li => {
        const tags = (li.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
        const show = key === 'all' || tags.includes(key);
        li.hidden = !show;
      });
    };

    // Varsayılan: 'all'
    const defaultBtn = filterBar.querySelector('.filter[data-filter="all"]') || filterBar.querySelector('.filter');
    if (defaultBtn) {
      setActive(defaultBtn);
      applyFilter(defaultBtn.getAttribute('data-filter'));
    }

    // Click handler
    delegate(filterBar, '.filter', 'click', (e, btn) => {
      e.preventDefault();
      const key = btn.getAttribute('data-filter') || 'all';
      setActive(btn);
      applyFilter(key);
    });

    // Klavye erişilebilirliği (sol/sağ ile dolaş)
    on(filterBar, 'keydown', (e) => {
      const btns = Array.from(filterBar.querySelectorAll('.filter'));
      const i = btns.indexOf(doc.activeElement);
      if (i < 0) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        btns[(i + 1) % btns.length].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        btns[(i - 1 + btns.length) % btns.length].focus();
      }
    });
  }

  // --- Lightbox (image/video) ---
  let activeIndex = -1; // görünür öğeler arasında index
  const stage = dlg?.querySelector('[data-stage]');
  const captionEl = dlg?.querySelector('[data-caption]');
  const openOriginal = dlg?.querySelector('[data-openoriginal]');
  const closeBtn = dlg?.querySelector('.lightbox__close');

  const buildStage = (aEl) => {
    if (!stage) return;
    stage.innerHTML = '';
    const type = (aEl.getAttribute('data-media') || 'image').toLowerCase();
    if (type === 'video') {
      const video = doc.createElement('video');
      video.controls = true;
      video.preload = 'metadata';
      video.src = aEl.getAttribute('href');
      stage.appendChild(video);
    } else {
      const img = doc.createElement('img');
      img.src = aEl.getAttribute('href');
      img.alt = (aEl.querySelector('.gallery__caption')?.textContent || 'Media');
      img.decoding = 'async';
      stage.appendChild(img);
    }
    const cap = aEl.querySelector('.gallery__caption')?.textContent || '';
    if (captionEl) captionEl.textContent = cap;
    if (openOriginal) {
      openOriginal.href = aEl.getAttribute('href');
      openOriginal.setAttribute('download', '');
      openOriginal.setAttribute('rel', 'noopener');
    }
  };

  const openByIndex = (idx) => {
    const vis = visibleItems();
    if (!vis.length) return;
    activeIndex = Math.max(0, Math.min(idx, vis.length - 1));
    const a = vis[activeIndex].querySelector('.gallery__link');
    if (!a) return;

    buildStage(a);
    if (supportsDialog && dlg) {
      main.setAttribute('aria-hidden', 'true');
      lockScroll(true);
      dlg.removeAttribute('inert');
      dlg.showModal();
      closeBtn?.focus();
    } else {
      // Fallback: basit overlay
      openFallback(a);
    }
  };

  const openFromAnchor = (a) => {
    // a elementinin görünür listedeki indexini bul
    const vis = visibleItems().map(li => li.querySelector('.gallery__link'));
    const idx = vis.indexOf(a);
    openByIndex(idx >= 0 ? idx : 0);
  };

  const closeLightbox = () => {
    if (supportsDialog && dlg?.open) {
      dlg.close();
      dlg.setAttribute('inert', '');
      main.removeAttribute('aria-hidden');
      lockScroll(false);
    } else {
      closeFallback();
    }
  };

  // Dialog olayları
  if (supportsDialog && dlg) {
    on(closeBtn, 'click', (e) => { e.preventDefault(); closeLightbox(); });
    on(dlg, 'click', (e) => {
      // backdrop tıklaması
      const rect = dlg.getBoundingClientRect();
      const inDialog = (e.clientX >= rect.left && e.clientX <= rect.right &&
                        e.clientY >= rect.top && e.clientY <= rect.bottom);
      if (!inDialog) closeLightbox();
    });
    on(doc, 'keydown', (e) => {
      if (!dlg.open) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); openByIndex(activeIndex + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); openByIndex(activeIndex - 1); }
    });
  }

  // Fallback overlay
  let fb = null;
  const openFallback = (a) => {
    closeFallback();
    fb = doc.createElement('div');
    fb.className = 'lb-fallback';
    fb.innerHTML = `
      <button class="lb-fallback__close" aria-label="Kapat">&times;</button>
      <div class="lb-fallback__stage"></div>
      <div class="lb-fallback__meta">
        <p class="lb-fallback__caption"></p>
        <a class="lb-fallback__open" target="_blank" rel="noopener">Orijinali aç</a>
      </div>
    `;
    doc.body.appendChild(fb);
    lockScroll(true);
    const st = fb.querySelector('.lb-fallback__stage');
    const cap = fb.querySelector('.lb-fallback__caption');
    const open = fb.querySelector('.lb-fallback__open');
    const btn = fb.querySelector('.lb-fallback__close');

    const img = doc.createElement('img');
    img.decoding = 'async';
    img.src = a.getAttribute('href');
    img.alt = (a.querySelector('.gallery__caption')?.textContent || 'Media');
    st.appendChild(img);

    cap.textContent = a.querySelector('.gallery__caption')?.textContent || '';
    open.href = a.getAttribute('href');

    btn.addEventListener('click', (e) => { e.preventDefault(); closeFallback(); }, { once: true });
    fb.addEventListener('click', (e) => { if (e.target === fb) closeFallback(); });
    doc.addEventListener('keydown', fbEsc, { once: true });
  };
  const fbEsc = (e) => { if (e.key === 'Escape') closeFallback(); };
  const closeFallback = () => {
    if (fb) {
      fb.remove();
      fb = null;
      lockScroll(false);
    }
  };

  // --- Delegasyon: galeri linki tıklaması ---
  delegate(list, 'a.gallery__link', 'click', (e, a) => {
    e.preventDefault();
    openFromAnchor(a);
  });

  // Dil değişiminde lightbox meta metinleri otomatik güncellenir (açılışta okunuyor).
  // Görünürlük değiştikçe ok tuşları doğru akışta gezinir.

  // Hazır.
})();
  function renderProcess(){
    const lang = S.currentLang, t = HOME_COPY.process;
    const items = t.items.map((s,i)=>`
      <li class="step">
        <div class="step-dot"></div>
        <div class="step-card">
          <div class="step-kicker">${t.step[lang]} ${i+1}</div>
          <h3>${s.t[lang]}</h3>
          <p style="color:#3f3f46; margin-top:4px;">${s.d[lang]}</p>
        </div>
      </li>`).join("");
    $("#process") && ($("#process").innerHTML = `<h2 class="text-3xl font-semibold" style="margin-bottom:18px;">${t.title[lang]}</h2><ol class="rail">${items}</ol>`);
  }
  /* ============================================================
   Service Explorer (Tabs) — /js/runtime.js (append)
   - A11y: role="tablist"/"tab"/"tabpanel", klavye (← → Home/End)
   - PE: JS yoksa tüm paneller görünür, JS geldiğinde gizleme yapılır
   - URL State: #service-explorer:<key> (veya ?tab=<key>) senkron
   - i18n: lang:change tetiklendiğinde aktif sekme korunur
   - DOM: <section id="service-explorer" data-component="tabs"> ... </section>
   ============================================================ */
(() => {
  const SELECTOR = '#service-explorer[data-component="tabs"]';

  function initServiceExplorer(root = document) {
    const section = root.querySelector(SELECTOR);
    if (!section || section.dataset.bootedTabs === '1') return;
    section.dataset.bootedTabs = '1';

    const tablist = section.querySelector('[role="tablist"]');
    const tabs = Array.from(section.querySelectorAll('[role="tab"]'));
    const panels = Array.from(section.querySelectorAll('[role="tabpanel"]'));
    if (!tablist || tabs.length === 0 || panels.length === 0) return;

    // --- helpers ---
    const keyOfPanel = (p) => p?.dataset?.panel || (p?.id || '').replace(/^tab-/, '');
    const btnForPanel = (p) => tabs.find(t => t.getAttribute('aria-controls') === p.id);
    const panelForBtn = (t) => panels.find(p => p.id === t.getAttribute('aria-controls'));
    const panelMap = new Map(panels.map(p => [keyOfPanel(p), p]));
    const keys = Array.from(panelMap.keys());

    const getKeyFromURL = () => {
      const url = new URL(location.href);
      const q = url.searchParams.get('tab');
      if (q && panelMap.has(q)) return q;

      const h = url.hash || '';
      // desteklenen formatlar: #tab-<key> veya #service-explorer:<key>
      const m1 = h.match(/#tab-([a-z0-9\-]+)/i);
      if (m1 && panelMap.has(m1[1])) return m1[1];
      const m2 = h.match(/service-explorer:([a-z0-9\-]+)/i);
      if (m2 && panelMap.has(m2[1])) return m2[1];

      return null;
    };

    const setURLKey = (key, replace = true) => {
      const url = new URL(location.href);
      // query'yi temizle, hash’i canonical formda yaz
      url.searchParams.delete('tab');
      url.hash = `service-explorer:${key}`;
      if (replace) history.replaceState(null, '', url);
      else history.pushState(null, '', url);
    };

    function activate(key, { focus = false, updateURL = true } = {}) {
      const panel = panelMap.get(key);
      if (!panel) return;

      panels.forEach((p) => {
        const active = p === panel;
        p.hidden = !active;                  // JS ile gizleme (PE dostu)
        p.classList.toggle('is-active', active);
        const btn = btnForPanel(p);
        if (btn) {
          btn.setAttribute('aria-selected', active ? 'true' : 'false');
          btn.setAttribute('tabindex', active ? '0' : '-1');
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-controls', p.id);
        }
      });

      if (focus) {
        const btn = btnForPanel(panel);
        btn && btn.focus({ preventScroll: true });
      }
      if (updateURL) setURLKey(key, true);

      section.dataset.active = key;
      section.dispatchEvent(new CustomEvent('tabs:change', { detail: { key } }));
    }

    // --- boot ---
    // Başlangıç key’i: URL → aria-selected=true olan → ilk panel
    const preSelected = tabs.find(t => t.getAttribute('aria-selected') === 'true');
    let initialKey =
      getKeyFromURL() ||
      keyOfPanel(preSelected ? panelForBtn(preSelected) : panels[0]) ||
      keys[0];

    // JS devreye girince tüm panelleri kapat, sonra aktif olanı aç
    panels.forEach(p => { if (keyOfPanel(p) !== initialKey) p.hidden = true; });
    tabs.forEach(t => t.setAttribute('tabindex', '-1'));
    activate(initialKey, { focus: false, updateURL: false });

    // --- mouse/touch tıklama ---
    tabs.forEach((t) => {
      t.addEventListener('click', (e) => {
        e.preventDefault();
        const key = keyOfPanel(panelForBtn(t));
        activate(key, { focus: false, updateURL: true });
      });
    });

    // --- klavye navigasyon ---
    tablist.addEventListener('keydown', (e) => {
      const current = document.activeElement;
      const idx = tabs.indexOf(current);
      if (idx === -1) return;

      let targetIdx = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') targetIdx = (idx + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') targetIdx = (idx - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') targetIdx = 0;
      else if (e.key === 'End') targetIdx = tabs.length - 1;

      if (targetIdx != null) {
        e.preventDefault();
        const targetBtn = tabs[targetIdx];
        const key = keyOfPanel(panelForBtn(targetBtn));
        activate(key, { focus: true, updateURL: true });
      }
    });

    // --- URL senkronizasyonu (geri/ileri + hash değişimi) ---
    const syncFromURL = () => {
      const k = getKeyFromURL();
      if (k && k !== section.dataset.active) activate(k, { focus: false, updateURL: false });
    };
    window.addEventListener('popstate', syncFromURL);
    window.addEventListener('hashchange', syncFromURL);

    // --- Dil değişiminde state’i koru (metinler dışarıdaki i18n mekanizmasıyla güncellenir) ---
    window.addEventListener('lang:change', () => {
      const k = section.dataset.active || initialKey;
      activate(k, { focus: false, updateURL: false });
    });
  }

  // Otomatik başlat
  document.addEventListener('DOMContentLoaded', () => initServiceExplorer(document));

  // Gerekirse dışarı aç
  window.initServiceExplorer = initServiceExplorer;
})();
