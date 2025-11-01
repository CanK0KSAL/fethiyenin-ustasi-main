# Changelog — FethiyeninUstası

## 2025-01-25 — SEO & Dil Geçişi İyileştirmeleri

### ✨ Yeni Özellikler
- **Gelişmiş Dil Geçişi Sistemi**: Hreflang etiketleri ve path çevirisi ile çok dilli sayfa geçişleri
- **Path Translation Mapping**: Türkçe-İngilizce path segmentleri arasında otomatik çeviri
- **Blog Path Çevirisi**: Blog sayfaları için özel dosya adı eşleştirme sistemi

### 🐛 Düzeltmeler
- **Dil Geçişi Sorunları**: EN sayfalardan TR'ye geçişte ana sayfaya yönlendirme sorunu çözüldü
- **TR Sayfalardan EN'ye Geçiş**: Blog ve hizmet sayfalarından İngilizce'ye geçiş sorunları düzeltildi
- **Yüzeyler ve Kaplamalar Sayfası**: İngilizce butonuna basınca doğru sayfaya yönlendirme düzeltildi
- **Hreflang Doğrulama**: Hreflang etiketlerinin doğruluğu kontrol ediliyor, yanlışsa path çevirisi kullanılıyor

### 📝 SEO İyileştirmeleri
- **Gelişmiş robots.txt**: Bot bazlı optimizasyonlar, crawl-delay ayarları, spam bot koruması
- **Sitemap.xml Güncellemeleri**:
  - Doğalgaz sayfası eklendi
  - Hakkımızda/About sayfası eklendi
  - Blog sayfaları eklendi (9 TR + 10 EN)
  - Yanlış EN path'leri düzeltildi (interior-architecture-carpentry → interior-architecture)
  - Tüm hizmet sayfaları için hreflang etiketleri eklendi

### 🔧 Teknik İyileştirmeler
- **translateCurrentUrl Fonksiyonu**: 
  - Hreflang etiketlerinden URL okuma
  - Beklenen path ile karşılaştırma ve doğrulama
  - Birden fazla hreflang varsa doğru olanı seçme
  - Path çevirisi fallback sistemi
- **translateBlogPath Fonksiyonu**: Blog dosya adları için özel çeviri
- **PATH_TRANSLATIONS Mapping**: Kategori ve hizmet path'leri için çeviri tablosu
- **BLOG_FILE_TRANSLATIONS Mapping**: Blog dosya adları için çeviri tablosu

### 📄 Değiştirilen Dosyalar
- `assets/js/layout.js` - Dil geçişi ve path çevirisi fonksiyonları
- `sitemap.xml` - Eksik sayfalar eklendi, yanlış path'ler düzeltildi
- `robots.txt` - SEO odaklı gelişmiş yapılandırma

