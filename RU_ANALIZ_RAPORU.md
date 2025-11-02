# RU/ KLASÖRÜ EKSİKLİK ANALİZ RAPORU
**Tarih:** 2025-01-XX
**Toplam Kontrol Edilen Dosya:** 41 HTML dosyası

---

## 🔴 KRİTİK SORUNLAR

### 1. YANLIŞ CANONICAL LİNKLER (11 DOSYA)
**Sorun:** Canonical linkler `en/` URL'lerini gösteriyor, `ru/` olmalı.

**Etkilenen Dosyalar:**
1. `ru/услуги/поверхности-покрытия/index.html`
2. `ru/услуги/поверхности-покрытия/шелк-шива/index.html`
3. `ru/услуги/поверхности-покрытия/итальянская-штукатурка/index.html`
4. `ru/услуги/поверхности-покрытия/каменная-штукатурка/index.html`
5. `ru/услуги/поверхности-покрытия/тканевые-обои/index.html`
6. `ru/услуги/поверхности-покрытия/краска/index.html`
7. `ru/услуги/внешняя-изоляция/index.html`
8. `ru/услуги/внешняя-изоляция/каменная-композитная-облицовка/index.html`
9. `ru/услуги/внешняя-изоляция/обшивка/index.html`
10. `ru/услуги/внешняя-изоляция/силикон-акриловая-штукатурка/index.html`
11. `ru/услуги/внешняя-изоляция/фасадная-краска/index.html`

**Örnek Hata:**
```html
<link rel="canonical" href="https://fethiyeninustasi.com.tr/en/services/surfaces-coatings/">
```

**Düzeltilmesi Gereken:**
```html
<link rel="canonical" href="https://fethiyeninustasi.com.tr/ru/услуги/поверхности-покрытия/">
```

---

### 2. EKSİK CANONICAL LİNKLER (4+ DOSYA)
**Sorun:** Bazı dosyalarda canonical link hiç yok.

**Etkilenen Dosyalar:**
- `ru/регионы/fethiye.html`
- `ru/регионы/calis.html`
- `ru/регионы/ovacik.html`
- `ru/регионы/gocek.html`
- `ru/kontakt.html`
- `ru/о-нас.html`
- `ru/index.html`

**Eklenmesi Gereken:**
```html
<link rel="canonical" href="https://fethiyeninustasi.com.tr/ru/регионы/fethiye.html">
<link rel="canonical" href="https://fethiyeninustasi.com.tr/ru/kontakt.html">
<link rel="canonical" href="https://fethiyeninustasi.com.tr/ru/о-нас.html">
<link rel="canonical" href="https://fethiyeninustasi.com.tr/ru/">
```

---

## 🟡 ORTA SEVİYE SORUNLAR

### 3. FOOTER ARIA-LABEL'LER İNGİLİZCE (7+ DOSYA)
**Sorun:** Footer navigasyon bölümlerinin aria-label'leri İngilizce.

**Etkilenen Dosyalar:**
- `ru/index.html`
- `ru/blog/index.html`
- Ve diğer sayfalar

**Örnek Hata:**
```html
<nav class="footer__col" aria-label="Services">
<nav class="footer__col" aria-label="Areas">
<nav class="footer__col" aria-label="Corporate">
<section class="footer__col" aria-label="Contact">
```

**Düzeltilmesi Gereken:**
```html
<nav class="footer__col" aria-label="Услуги">
<nav class="footer__col" aria-label="Районы">
<nav class="footer__col" aria-label="О компании">
<section class="footer__col" aria-label="Контакты">
```

---

### 4. FOOTER BAŞLIKLARI TÜRKÇE (3 DOSYA)
**Sorun:** Footer başlıkları Türkçe, Rusça olmalı.

**Etkilenen Dosyalar:**
- `ru/index.html`
- `ru/о-нас.html` (muhtemelen)
- Diğer sayfalar

**Örnek Hata:**
```html
<h3 class="footer__h" data-i18n="footer.cols.services.title">HİZMETLER</h3>
<h3 class="footer__h" data-i18n="footer.cols.areas.title">BÖLGELER</h3>
<h3 class="footer__h" data-i18n="footer.cols.corp.title">KURUMSAL</h3>
```

**Düzeltilmesi Gereken:**
```html
<h3 class="footer__h" data-i18n="footer.cols.services.title">УСЛУГИ</h3>
<h3 class="footer__h" data-i18n="footer.cols.areas.title">РАЙОНЫ</h3>
<h3 class="footer__h" data-i18n="footer.cols.corp.title">О КОМПАНИИ</h3>
```

---

### 5. LANGUAGE SELECTOR ARIA-LABEL İNGİLİZCE (2 DOSYA)
**Sorun:** Language selector'ın aria-label'i İngilizce.

**Etkilenen Dosyalar:**
- `ru/kontakt.html`
- `ru/index.html`

**Örnek Hata:**
```html
<div class="lang-pill" role="group" aria-label="Select language">
```

**Düzeltilmesi Gereken:**
```html
<div class="lang-pill" role="group" aria-label="Выберите язык">
```

---

### 6. RU/О-НАС.HTML VE RU/INDEX.HTML'DE YANLIŞ ARIA-PRESSED
**Sorun:** Language selector'da TR'ye `aria-pressed="true"` atanmış, RU'ya atanmalı.

**Etkilenen Dosyalar:**
- `ru/о-нас.html` (satır 47)
- `ru/kontakt.html` (satır 41)

**Örnek Hata:**
```html
<button data-lang="tr" class="lang-btn" aria-pressed="true">TR</button>
<button data-lang="ru" class="lang-btn">RU</button>
```

**Düzeltilmesi Gereken:**
```html
<button data-lang="tr" class="lang-btn">TR</button>
<button data-lang="ru" class="lang-btn" aria-pressed="true">RU</button>
```

---

## 🟢 KÜÇÜK SORUNLAR (İşlevsel Değil)

### 7. TÜRKÇE YORUM SATIRLARI
**Sorun:** HTML yorum satırlarında Türkçe metinler var (işlevsel değil, sadece temizlik için).

**Örnekler:**
```html
<!-- ALT HİZMETLER (5 kart) -->
<!-- İLGİLİ HİZMETLER -->
<!-- BÖLGELER -->
<!-- HİZMET BÖLGELERİ -->
<!-- EN ÇOK YAPILAN HİZMETLER -->
```

**Not:** Bu yorumlar işlevselliği etkilemez ama tutarlılık için Rusça veya İngilizce yapılabilir.

---

## ✅ DOĞRU OLANLAR

1. ✅ Tüm dosyalarda `lang="ru"` attribute'u doğru
2. ✅ Başlıklar (title) Rusça: "Мастер Фетхие"
3. ✅ Header/footer içerikleri çoğunlukla Rusça
4. ✅ İçerikler Rusça çevrilmiş
5. ✅ Hreflang linkleri doğru (TR, EN, RU)
6. ✅ Blog post sayfaları canonical linkleri doğru
7. ✅ `ru/услуги/установка-инфраструктуры/index.html` canonical doğru
8. ✅ `ru/услуги/внутренняя-архитектура-плотницкие/index.html` canonical doğru

---

## 📊 ÖZET İSTATİSTİKLER

- **Toplam Dosya:** 41
- **Kritik Sorunlu:** 11 (canonical linkler)
- **Eksik Canonical:** 7
- **Footer Sorunları:** ~10+ dosya
- **Language Selector Sorunları:** 2-3 dosya
- **Tamamen Doğru:** ~15-20 dosya (blog sayfaları + bazı servis sayfaları)

---

## 🎯 ÖNCELİK SIRASI

1. **YÜKSEK ÖNCELİK:**
   - Canonical linkleri düzelt (11 dosya)
   - Eksik canonical linkleri ekle (7 dosya)

2. **ORTA ÖNCELİK:**
   - Footer aria-label'leri düzelt
   - Footer başlıklarını düzelt
   - Language selector aria-label'leri düzelt
   - aria-pressed attribute'larını düzelt

3. **DÜŞÜK ÖNCELİK:**
   - Türkçe yorum satırlarını temizle (isteğe bağlı)

---

## 📝 ÖNERİLER

1. **Canonical Linkler:** SEO için kritik, hemen düzeltilmeli
2. **Accessibility:** aria-label'ler erişilebilirlik için önemli
3. **Tutarlılık:** Tüm Rusça sayfalarda footer başlıkları Rusça olmalı

