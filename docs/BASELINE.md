# FethiyeninUstası — Master Roadmap & SOP v2.1

Bu doküman tüm sohbetlerin aynı kurguya bağlanması, görevlerin önceliklendirilmesi ve teslim biçimlerinin standartlaşması için **tek kaynak**tır.

---

## 0) Proje hedefleri (sabit)

* **Yerel odak:** Fethiye ve çevresi. 3 dil: **TR/EN/RU**.
* **Stack:** Klasik **HTML+CSS+vanilla JS** (Node/DB yok). Plesk, .htaccess ile cache+sıkıştırma+rewrite.
* **Hız:** LCP ≤ **2.5s** (mobil), CLS ≤ **0.02**, Perf ≥ **95** (LH). Toplam **CSS+JS ≤ 180KB** (gz/brotli), critical CSS minimal.
* **Görsel:** AVIF/WebP öncelikli, responsive, hero `fetchpriority="high"`, diğerleri `loading=lazy`.
* **Bilgi mimarisi:** Hizmetler altında **4 ana grup** (alt dropdown yok):

  1. Altyapı & Tesisat  2) Yüzeyler & Kaplamalar  3) İç Mimari & Marangozluk  4) Dış Cephe & Yalıtım

---

## 1) Klasör yapısı (v2.1, kanonik)

```
/assets
  /brand/                 (logo, favicon)
  /hero/                  (hizmet-kod bazlı hero: avif/webp/jpg)
  /gallery/               (hizmet-kod; 800/1280/1920)
  /css/
    base.css              (reset, tipografi, utility)
    layout.css            (header, footer, grid, helpers)
    theme.css             (renk değişkenleri, dark/light; aktif dil stilleri)
    app.css               (küçük ortak bileşenler: btn, card)
    home.css              (ana sayfa)
    category.css          (kategori landing)
    service.css           (tüm hizmet sayfaları ortak)
    areas.css             (bölgeler)
    contact.css           (iletişim)
  /js/
    /core/
      dom.js              (qs, qsa, setText, setHTML…)
      storage.js          (getLang, setLang, getTheme, setTheme)
      i18n.core.js        (I18N merge + applyI18n/t)
    nav.js                (dropdown + mobile sheet; sadece 4 ana grup)
    gallery.js            (filtre + lightbox <dialog>)
    contact.js            (form doğrulama + gönderim; Formspree/PHP)
    boot.js               (tema+dil+i18n+nav+lazy başlangıcı)
    /pages/
      home.js, areas.js, service.js
  /i18n/
    nav.i18n.js, home.i18n.js, category.i18n.js, service.i18n.js, areas.i18n.js

/tr   (dil klasörleri — /en, /ru aynı ağaç)
  index.html
  /hizmetler
    /altyapi-tesisat/index.html     (kategori landing)
    /ipek-siva/index.html           (hizmet sayfası)
    ...
  /bolgeler/{fethiye,calis,ovacik,gocek}.html
  iletisim.html
/.htaccess  /sitemap.xml  /robots.txt
```

**Not — Mevcut CSS eşlemesi:**

* `app.css` → **/assets/css/app.css** (koru)
* `main-page.css` → **home.css**
* `areas.css` → **areas.css**
* `blog.css` → (ops.) `category.css` veya `blog.css` ekle
* `about.css` → (ops.) `about.css` ekle
* `ipek-sıva.css` → **service.css** + /tr/hizmetler/ipek-siva/ sayfa-özel bloklar

---

## 2) Sohbet rolleri ve entegrasyon protokolü

* **Ana Akış (Master)** — Bu dokümandaki tek kaynağı kullanır; görev öncelikleri, kabul kriterleri, sürüm notları burada tutulur.
* **CSS Studio** — Sadece stil üretir/günceller. `base/layout/theme/app + sayfa-özel` ayrımını bozmadan çalışır.
* **JS Studio** — Davranış/i18n/başlatma. `core/*`, `nav.js`, `boot.js`, `pages/*` sınırlarına uyar.
* **(Ops.) Content & SEO** — Metin, hreflang, schema, OG/Twitter, meta-title/description.

**Her yeni sohbetin ilk satırı (preamble):**

```
Bu sohbet FethiyeninUstası projesidir. "FethiyeninUstası — Master Roadmap & SOP v2.1" referans alınsın.
Kanonik klasör yapısı v2.1 ve /docs/BASELINE.md geçerlidir. Çıktılar buna uyacak.
```

---

## 3) Teslim biçimi (Handover şablonu)

```
# Başlık: FU-XXXX — Kısa açıklama

## Kapsam
- Değişen dosyalar: /assets/css/theme.css, /assets/js/nav.js
- Etkilenen sayfalar: /tr/index.html, /tr/hizmetler/ipek-siva/index.html

## Kabul Kriterleri
- LCP ≤ 2.5s (mobil), CLS ≤ 0.02
- Hizmetler dropdown 4 ana grup, alt dropdown yok
- Dil butonu aktif rengi görünüyor

## Test Planı
- Chrome DevTools: Fast 3G, 4x CPU throttle
- Viewport: 360×780, 1280×800
- Lighthouse: Perf ≥ 95, SEO ≥ 95

## Notlar
- `?v=2025.10.17` versiyon artırıldı
```

---

## 4) SEO + Performans SOP (özet)

* **Meta & hreflang:** Her dil sayfası kendi canonical’ı; `alternate` hreflang üçlü (tr/en/ru + x-default).
* **Schema:** `Organization` + `WebSite(SearchAction)` — ana sayfa; hizmet sayfalarında `Service`/`LocalBusiness` gerekirse.
* **Kritik CSS:** `base.css` preload; diğerleri normal. JS her zaman `defer`.
* **Görseller:** Hero `fetchpriority=high`, boyutlar `width/height`; diğerleri `loading=lazy`, `decoding=async`. AVIF/WebP, fallback jpg.
* **Cache:** 1 yıl, `immutable`; sürümleme `?v=YYYY.MM.DD`.

---

## 5) Yol haritası (v2.1 — öncelik sırası)

1. **Nav/i18n altyapı sabitleme** — `nav.js`, `core/i18n.core.js`, `i18n/*.js`, `theme.css` (aktif dil rengi).
2. **Ana sayfa (main only)** — Hero, 4 hizmet grubu kartları, CTA blok; `home.css`, `home.js`.
3. **Service ortakları** — `service.css`, `pages/service.js`; ipek-siva sayfası ilk örnek.
4. **Areas** — `areas.css`, `pages/areas.js`; 4 ilçe sayfası.
5. **Contact** — `contact.css`, `contact.js`; schema+map+form.
6. **Blog/Category** — yapı hazırla (ops.).
7. **.htaccess + sitemap/robots** — yayın seti.

---

## 6) Tanımlar / isimlendirme

* **Görev kodu:** `FU-0001` biçimi.
* **CSS sınıfları:** BEM-benzeri; sayfa blokları `home-`, `service-`, `areas-` ön ekleri.
* **JS:** Global çakışma yok; `window.Namespace` (IIFE) patern; sadece vanilla.

---

## 7) Yayın notları

* Prod’a çıkarken sadece `?v=` parametresi güncellenir. CDN/Plesk cache purge.
* Hız testleri (mobil) ekran görüntüsü eklenir.
