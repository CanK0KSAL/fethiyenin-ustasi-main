
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('projects');
  if (!root) { console.warn('[gallery] #projects bulunamadı'); return; }

  const filterBar = root.querySelector('.projects__filter');
  const chips = Array.from(filterBar.querySelectorAll('.chip'));
  const items = Array.from(root.querySelectorAll('.grid .project'));

  const getTags = el =>
    (el.dataset.tags || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

  function setActive(filterKey) {
    const f = (filterKey || 'all').toLowerCase();

    // Kartları göster/gizle
    items.forEach(item => {
      const match = f === 'all' ? true : getTags(item).includes(f);
      item.toggleAttribute('hidden', !match);
      item.classList.toggle('is-hidden', !match);
    });

    // Chip durumları (a11y)
    chips.forEach(btn => {
      const active = (btn.dataset.filter || '').toLowerCase() === f;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('is-active', active);
    });
  }

  // Delegation: chip tıklandığında
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn || !filterBar.contains(btn)) return;
    setActive(btn.dataset.filter || 'all');
  });

  // İlk yükleme: URL #hash varsa onu kullan (örn. #tas-siva), yoksa Tümü
  const hash = (location.hash || '').slice(1).toLowerCase();
  const valid = chips.some(c => (c.dataset.filter||'').toLowerCase() === hash);
  setActive(valid ? hash : 'all');
});
