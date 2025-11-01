/* ==========================================================================
   FU-7002 — Blog filtre/arama/sıralama (TR) — v2 (pages klasörüne uyarlanmış)
   Hedef: /tr/blog/ (blog hub). Bağımlılık yok (vanilla).
   Değişiklikler:
   - render(): replaceChildren ile DOM'u tamamen yeniden yazar (sıralama garanti).
   - parseDate(): dayanıklı tarih okuyucu (time[datetime] → slug fallback).
   - URL senkronizasyonu + canlı sayaç + a11y.
   ========================================================================== */

(() => {
  'use strict';

  // ---------- Helpers ----------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const debounce = (fn, wait = 200) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };

  const toKebab = (s) => (s || '').toString().trim().toLowerCase()
    .normalize('NFKD').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  const parseTags = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(v => toKebab(v));
    return val.split(',').map(v => toKebab(v));
  };

  // Dayanıklı tarih okuyucu:
  function parseDate(el) {
    // 1) itemprop=datePublished öncelikli
    let t = el.querySelector('time[itemprop="datePublished"][datetime]');
    if (!t) t = el.querySelector('.post__meta time[datetime], time[datetime]');
    if (t) {
      const d = new Date(t.getAttribute('datetime'));
      if (!Number.isNaN(+d)) return +d;
    }
    // 2) URL/slug'dan yıl-ay-gün yakala (…/2025-10-15.html gibi)
    const link = el.querySelector('a[href]');
    const href = link ? link.getAttribute('href') : '';
    const m = href && href.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const d = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00`);
      if (!Number.isNaN(+d)) return +d;
    }
    return 0;
  }

  const estimateReadMins = (el) => {
    const explicit = el.querySelector('[data-read-mins]');
    if (explicit) {
      const v = parseInt(explicit.getAttribute('data-read-mins'), 10);
      if (!Number.isNaN(v) && v > 0) return v;
    }
    const title = el.querySelector('.post__title')?.textContent || '';
    const excerpt = el.querySelector('.post__excerpt')?.textContent || '';
    const words = (title + ' ' + excerpt).trim().split(/\s+/).filter(Boolean).length;
    return Math.max(3, Math.round(words / 180 * 5)); // yaklaşık
  };

  const getPopularity = (el) => {
    const p = parseInt(el.getAttribute('data-pop'), 10);
    return Number.isNaN(p) ? null : p;
  };

  // ---------- Blog Hub ----------
  function initBlogHub() {
    // yalnız blog index'te çalış
    const isBlogIndex = document.body?.querySelector('.blog.blog--index');
    if (!isBlogIndex) return;

    const root = document.querySelector('[data-component="blog-filters"]');
    const resultsWrap = document.querySelector('[data-role="results"]');
    if (!root || !resultsWrap) return;

    // Kartları topla (.post[data-cat][data-tags])
    const items = $$('.post', resultsWrap).map(el => {
      const cat = toKebab(el.getAttribute('data-cat'));
      const tags = parseTags(el.getAttribute('data-tags'));
      const date = parseDate(el);
      const read = estimateReadMins(el);
      const pop = getPopularity(el);
      const title = (el.querySelector('.post__title')?.textContent || '').toLowerCase();
      const excerpt = (el.querySelector('.post__excerpt')?.textContent || '').toLowerCase();
      return { el, cat, tags, date, read, pop, title, excerpt };
    });

    // State
    const state = { q: '', cat: null, tags: new Set(), sort: 'new' };

    // Controls
    const inputQ = $('#q', root);
    const selectSort = $('#sort', root);
    const chips = $$('[data-filter]', root);

    // Live sonuç sayacı
    let live = $('#results-live', root);
    if (!live) {
      live = document.createElement('p');
      live.id = 'results-live';
      live.className = 'results__count';
      live.setAttribute('role', 'status');
      live.setAttribute('aria-live', 'polite');
      root.appendChild(live);
    }

    // URL → state
    const params = new URLSearchParams(location.search);
    const qp = (k) => params.get(k);
    if (qp('q')) state.q = qp('q').toLowerCase();
    if (qp('cat')) state.cat = toKebab(qp('cat'));
    if (qp('sort')) state.sort = qp('sort');
    if (qp('tags')) parseTags(qp('tags')).forEach(t => state.tags.add(t));

    // UI'yı state'e göre işaretle
    if (inputQ && state.q) inputQ.value = state.q;
    if (selectSort && state.sort) selectSort.value = state.sort;
    chips.forEach(btn => {
      const [type, value] = (btn.getAttribute('data-filter') || '').split(':');
      const v = toKebab(value);
      const active = type === 'cat' ? state.cat === v : state.tags.has(v);
      btn.classList.toggle('is-active', !!active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // ---- Core ----
    function updateURL() {
      const p = new URLSearchParams();
      if (state.q) p.set('q', state.q);
      if (state.cat) p.set('cat', state.cat);
      if (state.tags.size) p.set('tags', Array.from(state.tags).join(','));
      if (state.sort && state.sort !== 'new') p.set('sort', state.sort);
      const qs = p.toString();
      history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
    }

    function filterItems() {
      const q = state.q, cat = state.cat, tags = state.tags;
      return items.filter(it => {
        if (cat && it.cat !== cat) return false;
        if (tags.size) {
          // Çoklu etiket için OR
          const ok = it.tags.some(t => tags.has(t));
          if (!ok) return false;
        }
        if (q && !(it.title.includes(q) || it.excerpt.includes(q))) return false;
        return true;
      });
    }

    function sortItems(list) {
      const mode = state.sort;
      if (mode === 'read') {
        list.sort((a, b) => a.read - b.read || b.date - a.date || a.title.localeCompare(b.title));
      } else if (mode === 'pop') {
        list.sort((a, b) => {
          const ap = a.pop ?? -Infinity;
          const bp = b.pop ?? -Infinity;
          if (ap === bp) return b.date - a.date || a.title.localeCompare(b.title);
          return bp - ap;
        });
      } else {
        // 'new'
        list.sort((a, b) => b.date - a.date || a.title.localeCompare(b.title));
      }
      return list;
    }

    function render(list) {
      // replaceChildren → görünür sıralama garanti
      const nodes = list.map(it => it.el);
      if (resultsWrap.replaceChildren) {
        resultsWrap.replaceChildren(...nodes);
      } else {
        resultsWrap.innerHTML = '';
        nodes.forEach(n => resultsWrap.appendChild(n));
      }
      live.textContent = `${list.length} yazı bulundu`;
    }

    function apply() {
      updateURL();
      const filtered = filterItems();
      sortItems(filtered);
      render(filtered);
    }

    // ---- Events ----
    if (inputQ) inputQ.addEventListener('input', debounce(e => {
      state.q = (e.target.value || '').trim().toLowerCase();
      apply();
    }, 200));

    if (selectSort) selectSort.addEventListener('change', e => {
      state.sort = e.target.value;
      apply();
    });

    chips.forEach(btn => {
      btn.setAttribute('role', 'button');
      btn.addEventListener('click', e => {
        e.preventDefault();
        const [type, value] = (btn.getAttribute('data-filter') || '').split(':');
        const v = toKebab(value);
        if (type === 'cat') {
          const willActivate = state.cat !== v;
          state.cat = willActivate ? v : null;
          // tüm kategori chiplerini güncelle
          chips.forEach(b => {
            if ((b.getAttribute('data-filter') || '').startsWith('cat:')) {
              const _v = toKebab((b.getAttribute('data-filter') || '').split(':')[1]);
              const active = willActivate && _v === v;
              b.classList.toggle('is-active', active);
              b.setAttribute('aria-pressed', active ? 'true' : 'false');
            }
          });
        } else if (type === 'tag') {
          if (state.tags.has(v)) {
            state.tags.delete(v);
            btn.classList.remove('is-active');
            btn.setAttribute('aria-pressed', 'false');
          } else {
            state.tags.add(v);
            btn.classList.add('is-active');
            btn.setAttribute('aria-pressed', 'true');
          }
        }
        apply();
      });
    });

    // İlk çalıştırma
    apply();

    // Geri/ileri navigasyonunda state’i yenile
    window.addEventListener('popstate', () => {
      const p = new URLSearchParams(location.search);
      state.q = (p.get('q') || '').toLowerCase();
      state.cat = p.get('cat') ? toKebab(p.get('cat')) : null;
      state.tags = new Set(parseTags(p.get('tags')));
      state.sort = p.get('sort') || 'new';
      if (inputQ) inputQ.value = state.q;
      if (selectSort) selectSort.value = state.sort;
      chips.forEach(btn => {
        const [type, value] = (btn.getAttribute('data-filter') || '').split(':');
        const v = toKebab(value);
        const active = type === 'cat' ? state.cat === v : state.tags.has(v);
        btn.classList.toggle('is-active', !!active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      apply();
    });
  }

  // ---------- Basit Carousel (eğer varsa) ----------
  function initFeaturedCarousel() {
    const car = document.querySelector('[data-component="carousel"]');
    if (!car) return;
    const track = car.querySelector('[data-role="track"]');
    if (!track) return;
    const prev = car.parentElement?.querySelector('[data-action="carousel:prev"]');
    const next = car.parentElement?.querySelector('[data-action="carousel:next"]');
    const step = () => Math.max(240, Math.floor(track.clientWidth * 0.9));
    const doPrev = () => track.scrollBy({ left: -step(), behavior: 'smooth' });
    const doNext = () => track.scrollBy({ left: step(), behavior: 'smooth' });
    prev && prev.addEventListener('click', e => { e.preventDefault(); doPrev(); });
    next && next.addEventListener('click', e => { e.preventDefault(); doNext(); });

    let isDown = false, startX = 0, startLeft = 0;
    track.addEventListener('pointerdown', e => {
      isDown = true; startX = e.clientX; startLeft = track.scrollLeft;
      track.setPointerCapture(e.pointerId); track.classList.add('is-dragging');
    });
    const drag = e => { if (isDown) track.scrollLeft = startLeft - (e.clientX - startX); };
    const end = e => { if (!isDown) return; isDown = false; track.classList.remove('is-dragging'); try { track.releasePointerCapture(e.pointerId); } catch(_) {} };
    track.addEventListener('pointermove', drag);
    track.addEventListener('pointerup', end);
    track.addEventListener('pointercancel', end);
    track.addEventListener('pointerleave', end);
  }

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', () => {
    initBlogHub();
    initFeaturedCarousel();
  });
})();
