# 🏗️ FethiyeninUstası — Web Sitesi

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Performance](https://img.shields.io/badge/Performance-95%2B-green?style=flat-square)](https://pagespeed.web.dev/)
[![SEO](https://img.shields.io/badge/SEO-Optimized-blue?style=flat-square)](https://developers.google.com/search)

**FethiyeninUstası**, Fethiye ve çevresinde tadilat, renovasyon ve yapı hizmetleri sunan bir işletmenin profesyonel web sitesidir. Modern web teknolojileri kullanılarak geliştirilmiş, performans odaklı, SEO uyumlu ve çok dilli bir platformdur.

---

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Proje Yapısı](#-proje-yapısı)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Performans](#-performans)
- [SEO](#-seo)
- [Çok Dilli Yapı](#-çok-dilli-yapı)
- [Geliştirme](#-geliştirme)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)
- [İletişim](#-iletisim)

---

## ✨ Özellikler

### 🎯 Temel Özellikler

- **🚀 Yüksek Performans**: LCP ≤ 2.5s (mobil), CLS ≤ 0.02, Lighthouse Performans ≥ 95
- **🌍 Çok Dilli Destek**: Türkçe (TR), İngilizce (EN), Rusça (RU) tam destek
- **📱 Tam Responsive**: Mobil, tablet ve masaüstü için optimize edilmiş tasarım
- **♿ Erişilebilirlik**: WCAG 2.1 AA standartlarına uygun, ARIA etiketleri
- **🔍 SEO Optimizasyonu**: Schema.org JSON-LD, Open Graph, hreflang, sitemap
- **🎨 Modern UI/UX**: Temiz, profesyonel ve kullanıcı dostu arayüz
- **📝 İletişim Formu**: Formspree entegrasyonu ile güvenli form gönderimi
- **🖼️ Görsel Optimizasyonu**: AVIF/WebP formatları, lazy loading, responsive images

### 📊 İşlevsel Özellikler

- **Hizmet Kategorileri**: 4 ana kategori (Altyapı & Tesisat, Yüzeyler & Kaplamalar, İç Mimari & Marangozluk, Dış Cephe & Yalıtım)
- **Bölge Sayfaları**: Fethiye, Çalış, Ovacık, Göcek için özel sayfalar
- **Blog Sistemi**: İçerik pazarlama için blog bölümü
- **Galeri**: Proje görselleri için lightbox galeri
- **Dil Değiştirme**: Anlık dil değişimi, localStorage ile tercih saklama
- **Hızlı Navigasyon**: Mobil hamburger menü, desktop dropdown menüler

---

## 🛠️ Teknolojiler

### Frontend Stack

| Teknoloji | Açıklama |
|-----------|----------|
| **HTML5** | Semantik markup, SEO dostu yapı |
| **CSS3** | Modern CSS, CSS Grid, Flexbox, Custom Properties |
| **Vanilla JavaScript** | Framework-free, performans odaklı |
| **Formspree** | Form gönderimi için harici servis |

### Performans & SEO

- **Resource Hints**: `preconnect`, `dns-prefetch`, `preload`
- **Lazy Loading**: Görseller ve non-critical kaynaklar
- **Critical CSS**: Above-the-fold içerik için inline CSS
- **Schema.org**: JSON-LD structured data
- **Sitemap.xml**: Otomatik sitemap generation
- **robots.txt**: Arama motoru optimizasyonu

### Görsel Formatları

- **AVIF**: Modern, yüksek sıkıştırma
- **WebP**: Yaygın destek, iyi sıkıştırma
- **JPEG**: Fallback format

---

## 📁 Proje Yapısı

```
Fethiyenin-Ustası-full/
│
├── assets/                      # Statik kaynaklar
│   ├── css/                     # Stil dosyaları
│   │   ├── base.css            # Reset, tipografi, utility
│   │   ├── layout.css          # Header, footer, grid
│   │   ├── home.css            # Ana sayfa stilleri
│   │   ├── contact.css         # İletişim sayfası
│   │   ├── services/           # Hizmet sayfaları stilleri
│   │   └── blog/               # Blog stilleri
│   │
│   ├── js/                      # JavaScript dosyaları
│   │   ├── layout.js           # Ana layout fonksiyonları
│   │   ├── contact.js          # İletişim formu
│   │   ├── gallery.js          # Galeri lightbox
│   │   ├── runtime.js          # Runtime utilities
│   │   ├── pages/              # Sayfa özel JS
│   │   └── i18n/               # Çok dilli içerik
│   │
│   └── media/                   # Görseller ve medya
│       ├── logo/               # Logo dosyaları
│       ├── main-page/          # Ana sayfa görselleri
│       ├── service/            # Hizmet görselleri
│       └── blog/               # Blog görselleri
│
├── blog/                        # Blog yazıları (TR)
│   └── *.html
│
├── bolgeler/                     # Bölge sayfaları (TR)
│   ├── fethiye.html
│   ├── calis.html
│   ├── ovacik.html
│   └── gocek.html
│
├── hizmetler/                    # Hizmet sayfaları (TR)
│   ├── altyapi-tesisat/
│   ├── yuzeyler-kaplamalar/
│   ├── ic-mimari-marangozluk/
│   └── dis-cephe-yalitim/
│
├── en/                           # İngilizce içerik
│   ├── index.html
│   ├── about.html
│   ├── contact.html
│   ├── services/
│   ├── areas/
│   └── blog/
│
├── ru/                           # Rusça içerik
│   ├── index.html
│   ├── о-нас.html
│   ├── kontakt.html
│   ├── услуги/
│   ├── регионы/
│   └── blog/
│
├── docs/                         # Dokümantasyon
│   ├── BASELINE.md             # Proje baseline
│   └── CHANGELOG.md            # Değişiklik geçmişi
│
├── tools/                        # Yardımcı scriptler
│   ├── patch-html-refs.sh
│   └── report-nonascii-filenames.sh
│
├── index.html                    # Ana sayfa (TR)
├── iletisim.html                # İletişim sayfası (TR)
├── hakkimizda.html              # Hakkımızda (TR)
├── sitemap.xml                   # XML sitemap
├── robots.txt                    # Robots dosyası
└── README.md                     # Bu dosya
```

---

## 🚀 Kurulum

### Gereksinimler

Bu proje **statik bir web sitesi**dir ve sunucu tarafı gerektirmez. Yerel geliştirme için:

- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- (Opsiyonel) Yerel sunucu (Python `http.server`, Node.js `http-server`, VS Code Live Server)

### Adımlar

1. **Depoyu klonlayın**
   ```bash
   git clone https://github.com/kullanici-adi/fethiyenin-ustasi.git
   cd fethiyenin-ustasi
   ```

2. **Dosyaları kontrol edin**
   Tüm dosyalar yerinde olmalıdır. Proje klasör yapısı yukarıdaki gibi olmalıdır.

3. **Yerel sunucu başlatın** (opsiyonel)
   
   **Python ile:**
   ```bash
   python -m http.server 8000
   ```
   
   **Node.js ile:**
   ```bash
   npx http-server -p 8000
   ```
   
   **VS Code Live Server:**
   - VS Code'da projeyi açın
   - `index.html` dosyasına sağ tıklayın
   - "Open with Live Server" seçin

4. **Tarayıcıda açın**
   ```
   http://localhost:8000
   ```

---

## 💻 Kullanım

### Temel Navigasyon

- **Ana Sayfa**: `/index.html` veya `/`
- **Hizmetler**: `/hizmetler/[kategori]/[hizmet]/`
- **Bölgeler**: `/bolgeler/[bolge].html`
- **Blog**: `/blog/`
- **İletişim**: `/iletisim.html`
- **Hakkımızda**: `/hakkimizda.html`

### Dil Değiştirme

- Sağ üst köşedeki dil butonları (TR/EN/RU) ile dil değiştirilebilir
- Seçilen dil `localStorage`'da saklanır
- URL yapısı: `/` (TR), `/en/` (EN), `/ru/` (RU)

### İletişim Formu

İletişim formu **Formspree** servisi ile çalışır:
- Form gönderimi JavaScript ile doğrulanır
- Başarılı gönderim sonrası kullanıcıya bildirim gösterilir
- Formspree webhook URL'si: `https://formspree.io/f/movpbdnl`

### Görsel Yükleme

- Hero görselleri: `fetchpriority="high"`, eager loading
- Diğer görseller: `loading="lazy"`, `decoding="async"`
- Responsive images: `srcset` ve `<picture>` elementleri

---

## ⚡ Performans

### Hedef Metrikler

| Metrik | Hedef | Açıklama |
|--------|-------|----------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | Mobil cihazlarda |
| **CLS** (Cumulative Layout Shift) | ≤ 0.02 | Layout stabilitesi |
| **FID** (First Input Delay) | ≤ 100ms | İnteraktivite |
| **Lighthouse Performans** | ≥ 95 | Genel performans skoru |
| **CSS+JS Boyutu** | ≤ 180KB (gzip) | Toplam kritik kaynaklar |

### Optimizasyon Teknikleri

1. **Critical CSS**: Above-the-fold içerik için inline CSS
2. **Resource Hints**: `preconnect`, `dns-prefetch`, `preload`
3. **Lazy Loading**: Görseller ve non-critical JavaScript
4. **Görsel Optimizasyonu**: AVIF/WebP formatları, responsive images
5. **Code Splitting**: Sayfa bazlı CSS/JS yükleme
6. **Minification**: Production'da CSS/JS minify edilmeli
7. **Caching**: Browser caching, CDN caching (.htaccess ile)

### Performans Testleri

```bash
# Lighthouse CLI ile test
npm install -g lighthouse
lighthouse https://fethiyeninustasi.com.tr --view
```

---

## 🔍 SEO

### Schema.org Markup

Proje aşağıdaki Schema.org türlerini kullanır:

- `Organization`: Şirket bilgileri
- `LocalBusiness`: Yerel işletme bilgileri
- `WebSite`: Site arama özelliği
- `Service`: Hizmet detayları
- `FAQPage`: SSS bölümü
- `BreadcrumbList`: Breadcrumb navigasyon
- `ItemList`: Hizmet listeleri

### Meta Tags

Her sayfada:
- `title`: Benzersiz, açıklayıcı başlık
- `description`: 150-160 karakter meta açıklama
- `keywords`: İlgili anahtar kelimeler
- `canonical`: Kanonik URL
- `og:title`, `og:description`, `og:image`: Open Graph etiketleri

### Hreflang Tags

Çok dilli yapı için `hreflang` etiketleri:
```html
<link rel="alternate" hreflang="tr" href="..."/>
<link rel="alternate" hreflang="en" href="..."/>
<link rel="alternate" hreflang="ru" href="..."/>
<link rel="alternate" hreflang="x-default" href="..."/>
```

### Sitemap

- **Sitemap URL**: `https://fethiyeninustasi.com.tr/sitemap.xml`
- Tüm diller için URL'ler dahil
- `lastmod`, `changefreq`, `priority` değerleri güncel

### robots.txt

- Googlebot, Bingbot, Yandex için optimize edilmiş
- CSS/JS dosyaları engellenmiş (crawl budget optimizasyonu)
- Media dosyaları izinli
- Spam botlar engellenmiş

---

## 🌐 Çok Dilli Yapı

### Desteklenen Diller

1. **Türkçe (TR)**: Ana dil, root URL: `/`
2. **İngilizce (EN)**: `/en/` altında
3. **Rusça (RU)**: `/ru/` altında

### i18n Sistemi

- **Dil Dosyaları**: `/assets/js/i18n/layout.i18n.js`
- **JavaScript ile Değiştirme**: `data-i18n` attribute'ları
- **LocalStorage**: Kullanıcı dil tercihi saklanır
- **URL Yapısı**: Her dil için ayrı klasör yapısı

### Dil Değiştirme Akışı

1. Kullanıcı dil butonuna tıklar
2. JavaScript `localStorage`'a kaydeder
3. Sayfa içeriği JavaScript ile güncellenir
4. (Opsiyonel) Sayfa yeniden yüklenebilir

---

## 🔧 Geliştirme

### Geliştirme Ortamı

1. **Editör**: VS Code önerilir
2. **Live Reload**: VS Code Live Server extension
3. **Linting**: HTMLHint, Stylelint (opsiyonel)
4. **Git**: Version control için Git kullanın

### Kod Standartları

- **HTML**: Semantik HTML5, WCAG uyumlu
- **CSS**: BEM-benzeri isimlendirme, CSS Custom Properties
- **JavaScript**: ES6+, vanilla JS, IIFE pattern
- **Dosya İsimlendirme**: kebab-case (örn: `contact-form.js`)

### Git Workflow

```bash
# Feature branch oluştur
git checkout -b feature/yeni-ozellik

# Değişiklikleri commit et
git add .
git commit -m "feat: yeni özellik eklendi"

# Main branch'e merge et
git checkout main
git merge feature/yeni-ozellik
```

### Versiyonlama

CSS/JS dosyaları için cache busting:
```html
<link rel="stylesheet" href="/assets/css/base.css?v=2025.10.25">
```

---

## 📝 İçerik Yönetimi

### Yeni Hizmet Sayfası Ekleme

1. İlgili klasörde HTML dosyası oluştur (örn: `/hizmetler/yuzeyler-kaplamalar/yeni-hizmet/`)
2. Header/Footer yapısını koru
3. Schema.org `Service` markup ekle
4. Görselleri `/assets/media/service/` altına ekle
5. `sitemap.xml`'e URL ekle

### Blog Yazısı Ekleme

1. `/blog/` altında HTML dosyası oluştur
2. Blog template yapısını kullan
3. Meta tags ve Schema.org `Article` markup ekle
4. Görselleri `/assets/media/blog/` altına ekle

### Çok Dilli İçerik Ekleme

Her dil için ayrı dosya oluştur:
- TR: `/hizmetler/[kategori]/[hizmet]/`
- EN: `/en/services/[category]/[service]/`
- RU: `/ru/услуги/[категория]/[услуга]/`

---

## 🤝 Katkıda Bulunma

### Katkı Süreci

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

### Pull Request Kriterleri

- ✅ Kod standartlarına uygun
- ✅ Performans metrikleri karşılanıyor
- ✅ SEO kurallarına uygun
- ✅ Mobil responsive
- ✅ Çok dilli içerik güncel
- ✅ Test edilmiş

---

## 📄 Lisans

Bu proje özel bir web sitesidir. Tüm hakları saklıdır.

© 2025 FethiyeninUstası — Tüm hakları saklıdır.

---

## 📞 İletişim

### Web Sitesi
🌐 **URL**: [https://fethiyeninustasi.com.tr](https://fethiyeninustasi.com.tr)

### İletişim Bilgileri
- 📧 **E-posta**: info@fethiyeninustasi.com.tr
- 📱 **Telefon**: +90 506 022 29 00
- 💬 **WhatsApp**: [WhatsApp İletişim](https://wa.me/905060222900)

### Hizmet Bölgeleri
- 🏘️ Fethiye (Merkez)
- 🏘️ Çalış
- 🏘️ Ovacık
- 🏘️ Göcek

---

## 📚 Ek Kaynaklar

### Dokümantasyon
- [BASELINE.md](docs/BASELINE.md) - Proje baseline ve standartlar
- [CHANGELOG.md](docs/CHANGELOG.md) - Değişiklik geçmişi

### Dış Kaynaklar
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Schema.org](https://schema.org/)
- [Web.dev](https://web.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 🎯 Gelecek Planları

- [ ] PWA (Progressive Web App) desteği
- [ ] Görsel lazy loading iyileştirmeleri
- [ ] Dark mode desteği
- [ ] Blog için CMS entegrasyonu
- [ ] Gelişmiş analytics
- [ ] A/B testing altyapısı

---

## 🙏 Teşekkürler

Bu projeyi geliştiren ve katkıda bulunan herkese teşekkürler!

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz, yıldız vermeyi unutmayın! ⭐**

Made with ❤️ for Fethiye

</div>

