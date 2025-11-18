#!/usr/bin/env python3
"""
Görselleri kullanım yerlerine göre belirli boyutlara sabitleyerek WebP formatına dönüştürür.
"""

import os
import re
from pathlib import Path
from PIL import Image
import json

# Kullanım yerlerine göre boyut tanımlamaları
IMAGE_SIZES = {
    # Hero görselleri
    'hero': {
        'main-page/hero': (1920, 1560),
    },
    # Servis hero görselleri (kategori kartları)
    'service-hero': {
        'service/': (800, 560),
    },
    # Servis kart görselleri
    'service-card': {
        'service/': (800, 450),
    },
    # Logo görselleri
    'logo': {
        'logo/': None,  # Orijinal boyut korunur, sadece format değişir
    },
    # Galeri görselleri
    'gallery': {
        'gallery/': {
            '800': (800, 450),
            '1280': (1280, 720),
            '1920': (1920, 720),
            '400': (400, 225),
        }
    },
    # Hakkımızda sayfası görselleri
    'about': {
        'about/brands': (240, 120),
        'about/team': (400, 400),
    },
}

def get_image_size_from_path(image_path, html_files):
    """
    Görsel yoluna göre kullanım yerini ve boyutunu belirler.
    """
    image_path_str = str(image_path).replace('\\', '/')
    image_name = os.path.basename(image_path)
    
    # Hero görselleri
    if 'main-page/hero' in image_path_str or 'hero' in image_path_str and 'main-page' in image_path_str:
        return (1920, 1560)
    
    # Logo görselleri - orijinal boyut korunur
    if 'logo' in image_path_str.lower():
        return None
    
    # Galeri görselleri - klasör adından boyut belirlenir
    if 'gallery' in image_path_str.lower():
        parts = image_path_str.split('/')
        for part in parts:
            if part in ['800', '1280', '1920', '400']:
                size_map = {
                    '800': (800, 450),
                    '1280': (1280, 720),
                    '1920': (1920, 720),
                    '400': (400, 225),
                }
                return size_map.get(part, (800, 450))
        # Varsayılan galeri boyutu
        return (800, 450)
    
    # Hakkımızda görselleri
    if 'about' in image_path_str.lower() or '/media/about' in image_path_str:
        if 'brands' in image_path_str.lower() or 'brand' in image_name.lower():
            return (240, 120)
        if 'team' in image_path_str.lower():
            return (400, 400)
    
    # Servis görselleri - HTML'den boyut bilgisi al
    if 'service' in image_path_str.lower():
        # HTML dosyalarında bu görselin kullanımını ara
        for html_file in html_files:
            try:
                with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    # Görsel adını içeren img etiketini bul
                    # Farklı path formatlarını dene
                    patterns = [
                        image_name,
                        image_path_str.replace('\\', '/'),
                        os.path.basename(image_path_str),
                    ]
                    
                    for pattern in patterns:
                        # src attribute'unda görseli ara
                        escaped_pattern = re.escape(pattern)
                        img_pattern = rf'<img[^>]*src=["\']?[^"\']*{escaped_pattern}[^"\']*["\']?[^>]*>'
                        match = re.search(img_pattern, content, re.IGNORECASE)
                        if match:
                            img_tag = match.group(0)
                            # width ve height özelliklerini çıkar
                            width_match = re.search(r'width=["\']?(\d+)', img_tag, re.IGNORECASE)
                            height_match = re.search(r'height=["\']?(\d+)', img_tag, re.IGNORECASE)
                            if width_match and height_match:
                                return (int(width_match.group(1)), int(height_match.group(1)))
            except Exception as e:
                continue
        
        # HTML'de bulunamazsa, dosya adına göre tahmin et
        if 'hero' in image_name.lower() or 'hero' in image_path_str.lower():
            return (800, 560)
        return (800, 450)
    
    # Varsayılan: HTML'den boyut bilgisi al
    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                escaped_name = re.escape(image_name)
                img_pattern = rf'<img[^>]*src=["\']?[^"\']*{escaped_name}[^"\']*["\']?[^>]*>'
                match = re.search(img_pattern, content, re.IGNORECASE)
                if match:
                    img_tag = match.group(0)
                    width_match = re.search(r'width=["\']?(\d+)', img_tag, re.IGNORECASE)
                    height_match = re.search(r'height=["\']?(\d+)', img_tag, re.IGNORECASE)
                    if width_match and height_match:
                        return (int(width_match.group(1)), int(height_match.group(1)))
        except:
            continue
    
    # Varsayılan: orijinal boyut korunur
    return None

def resize_image(image, target_size):
    """
    Görseli hedef boyuta yeniden boyutlandırır (aspect ratio korunarak, crop ile).
    """
    if target_size is None:
        return image
    
    # Mevcut boyutlar
    current_width, current_height = image.size
    target_width, target_height = target_size
    
    # Aspect ratio'ları hesapla
    current_ratio = current_width / current_height
    target_ratio = target_width / target_height
    
    # Aspect ratio'ya göre resize ve crop
    if current_ratio > target_ratio:
        # Görsel daha geniş, yüksekliğe göre resize et
        new_height = target_height
        new_width = int(current_width * (target_height / current_height))
        image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        # Genişliği crop et
        left = (new_width - target_width) // 2
        image = image.crop((left, 0, left + target_width, target_height))
    else:
        # Görsel daha yüksek, genişliğe göre resize et
        new_width = target_width
        new_height = int(current_height * (target_width / current_width))
        image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        # Yüksekliği crop et
        top = (new_height - target_height) // 2
        image = image.crop((0, top, target_width, top + target_height))
    
    return image

def convert_to_webp(image_path, output_path, target_size=None, quality=85):
    """
    Görseli WebP formatına dönüştürür.
    """
    try:
        with Image.open(image_path) as img:
            # RGBA moduna çevir (transparency için)
            if img.mode in ('RGBA', 'LA', 'P'):
                if img.mode == 'P':
                    img = img.convert('RGBA')
            else:
                img = img.convert('RGB')
            
            # Boyutlandır
            if target_size:
                img = resize_image(img, target_size)
            
            # WebP olarak kaydet
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            save_kwargs = {
                'format': 'WEBP',
                'quality': quality,
                'method': 6,  # Yavaş ama daha iyi sıkıştırma
            }
            
            # Transparency varsa
            if img.mode in ('RGBA', 'LA'):
                save_kwargs['lossless'] = False
                img.save(output_path, **save_kwargs)
            else:
                img.save(output_path, **save_kwargs)
            
            return True
    except Exception as e:
        print(f"Hata: {image_path} -> {e}")
        return False

def find_all_images(root_dir):
    """
    Tüm görsel dosyalarını bulur.
    """
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp'}
    images = []
    
    for root, dirs, files in os.walk(root_dir):
        # .git ve node_modules gibi klasörleri atla
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__'}]
        
        for file in files:
            if Path(file).suffix.lower() in image_extensions:
                images.append(Path(root) / file)
    
    return images

def find_html_files(root_dir):
    """
    Tüm HTML dosyalarını bulur.
    """
    html_files = []
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__'}]
        for file in files:
            if file.endswith('.html'):
                html_files.append(Path(root) / file)
    return html_files

def update_html_references(html_file, image_mappings):
    """
    HTML dosyasındaki görsel referanslarını günceller.
    """
    try:
        with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        original_content = content
        
        # Her görsel eşleşmesi için güncelle
        for old_path, new_path in image_mappings.items():
            # Farklı path formatlarını dene
            old_path_normalized = old_path.replace('\\', '/')
            old_basename = os.path.basename(old_path)
            old_name_no_ext = os.path.splitext(old_basename)[0]
            
            patterns = [
                old_path_normalized,
                old_path_normalized.replace('assets/media/', ''),
                old_basename,
                old_name_no_ext,
            ]
            
            for pattern in patterns:
                if not pattern:
                    continue
                    
                escaped_pattern = re.escape(pattern)
                
                # src attribute'larını güncelle (sadece .jpg, .jpeg, .png, .gif uzantılı olanları)
                def replace_src(match):
                    full_match = match.group(0)
                    old_src = match.group(1)
                    # Eğer zaten .webp ise değiştirme
                    if old_src.lower().endswith('.webp'):
                        return full_match
                    return full_match.replace(old_src, new_path)
                
                content = re.sub(
                    rf'src=["\']([^"\']*{escaped_pattern}[^"\']*\.(jpg|jpeg|png|gif|bmp))["\']',
                    replace_src,
                    content,
                    flags=re.IGNORECASE
                )
                
                # srcset attribute'larını güncelle
                def replace_srcset(match):
                    full_match = match.group(0)
                    old_srcset = match.group(1)
                    if old_srcset.lower().endswith('.webp'):
                        return full_match
                    return full_match.replace(old_srcset, new_path)
                
                content = re.sub(
                    rf'srcset=["\']([^"\']*{escaped_pattern}[^"\']*\.(jpg|jpeg|png|gif|bmp))["\']',
                    replace_srcset,
                    content,
                    flags=re.IGNORECASE
                )
                
                # href attribute'larını güncelle (lightbox için)
                def replace_href(match):
                    full_match = match.group(0)
                    old_href = match.group(1)
                    if old_href.lower().endswith('.webp'):
                        return full_match
                    return full_match.replace(old_href, new_path)
                
                content = re.sub(
                    rf'href=["\']([^"\']*{escaped_pattern}[^"\']*\.(jpg|jpeg|png|gif|bmp))["\']',
                    replace_href,
                    content,
                    flags=re.IGNORECASE
                )
                
                # content attribute'larını güncelle (meta og:image için)
                def replace_content(match):
                    full_match = match.group(0)
                    old_content = match.group(1)
                    if old_content.lower().endswith('.webp'):
                        return full_match
                    return full_match.replace(old_content, new_path)
                
                content = re.sub(
                    rf'content=["\']([^"\']*{escaped_pattern}[^"\']*\.(jpg|jpeg|png|gif|bmp))["\']',
                    replace_content,
                    content,
                    flags=re.IGNORECASE
                )
                
                # preload href'lerini güncelle
                content = re.sub(
                    rf'<link[^>]*rel=["\']preload["\'][^>]*href=["\']([^"\']*{escaped_pattern}[^"\']*\.(jpg|jpeg|png|gif|bmp))["\']',
                    lambda m: m.group(0).replace(m.group(1), new_path),
                    content,
                    flags=re.IGNORECASE
                )
        
        # type="image/jpeg" veya type="image/png" olan source etiketlerini type="image/webp" yap
        content = re.sub(
            r'type=["\']image/(jpeg|jpg|png)["\']',
            'type="image/webp"',
            content,
            flags=re.IGNORECASE
        )
        
        if content != original_content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        try:
            print(f"HTML güncelleme hatası {html_file}: {e}")
        except UnicodeEncodeError:
            print(f"HTML güncelleme hatası: {str(html_file)}")
        return False

def main():
    root_dir = Path('.')
    
    print("Görseller aranıyor...")
    images = find_all_images(root_dir)
    print(f"{len(images)} görsel bulundu.")
    
    print("HTML dosyaları aranıyor...")
    html_files = find_html_files(root_dir)
    print(f"{len(html_files)} HTML dosyası bulundu.")
    
    image_mappings = {}  # Eski yol -> Yeni yol
    converted_count = 0
    failed_count = 0
    
    for image_path in images:
        # WebP zaten varsa atla
        if image_path.suffix.lower() == '.webp':
            continue
        
        # Kullanım yerine göre boyut belirle
        target_size = get_image_size_from_path(image_path, html_files)
        
        # WebP çıktı yolu
        webp_path = image_path.with_suffix('.webp')
        
        print(f"İşleniyor: {image_path} -> {webp_path} (Boyut: {target_size})")
        
        # Dönüştür
        if convert_to_webp(image_path, webp_path, target_size):
            # Eski yol -> Yeni yol eşleşmesi
            old_path = str(image_path).replace('\\', '/')
            new_path = str(webp_path).replace('\\', '/')
            
            # Başlangıçtaki ./ veya .\ karakterlerini kaldır
            if old_path.startswith('./'):
                old_path = old_path[2:]
            if new_path.startswith('./'):
                new_path = new_path[2:]
            
            image_mappings[old_path] = new_path
            image_mappings[os.path.basename(old_path)] = new_path
            
            converted_count += 1
        else:
            failed_count += 1
    
    print(f"\nDönüştürme tamamlandı: {converted_count} başarılı, {failed_count} başarısız")
    
    # HTML dosyalarını güncelle
    if image_mappings:
        print("\nHTML dosyaları güncelleniyor...")
        updated_count = 0
        for html_file in html_files:
            if update_html_references(html_file, image_mappings):
                updated_count += 1
                try:
                    print(f"Güncellendi: {html_file}")
                except UnicodeEncodeError:
                    print(f"Güncellendi: {str(html_file)}")
        
        print(f"\n{updated_count} HTML dosyası güncellendi.")
    
    print("\nİşlem tamamlandı!")

if __name__ == '__main__':
    main()

