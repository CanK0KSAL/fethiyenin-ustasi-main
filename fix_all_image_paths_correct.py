#!/usr/bin/env python3
"""
Tüm HTML dosyalarındaki görsel path'lerini düzeltir.
HTML dosyasının konumuna göre doğru relatif path'leri hesaplar.
"""

import os
import re
from pathlib import Path

def calculate_correct_path(image_path, html_file_path):
    """
    HTML dosyasının konumuna göre doğru görsel path'ini hesaplar.
    """
    root_dir = Path('.').resolve()
    html_dir = html_file_path.parent.resolve()
    
    # URL'leri olduğu gibi bırak
    if image_path.startswith('http://') or image_path.startswith('https://'):
        return image_path
    
    # Mutlak path'ler (/ ile başlayan) - olduğu gibi bırak
    if image_path.startswith('/'):
        return image_path
    
    # Görselin gerçek path'ini bul
    image_abs_path = None
    
    # Önce mevcut path'i dene
    test_paths = []
    
    if image_path.startswith('./'):
        test_paths.append(html_dir / image_path[2:])
    elif image_path.startswith('../'):
        test_paths.append(html_dir / image_path)
    else:
        # Relatif path
        test_paths.append(html_dir / image_path)
        # Root'tan da dene
        test_paths.append(root_dir / image_path.lstrip('/'))
    
    for test_path in test_paths:
        if test_path.exists() and test_path.is_file():
            image_abs_path = test_path.resolve()
            break
    
    # Eğer bulunamadıysa, assets/media içinde ara
    if not image_abs_path:
        image_name = os.path.basename(image_path)
        assets_media = root_dir / 'assets' / 'media'
        if assets_media.exists():
            for img_file in assets_media.rglob(image_name):
                if img_file.is_file():
                    image_abs_path = img_file.resolve()
                    break
    
    if not image_abs_path:
        # Dosya bulunamadı, orijinal path'i döndür
        return image_path
    
    # HTML dosyasına göre relatif path hesapla
    try:
        rel_path = os.path.relpath(image_abs_path, html_dir)
        # Windows path'lerini normalize et
        rel_path = rel_path.replace('\\', '/')
        
        # Root dizindeki dosyalar için ./ gereksiz, sadece assets/ kullan
        # Alt dizinlerdeki dosyalar için ../ kullan
        if html_dir == root_dir:
            # Root dizindeki dosya - ./ gereksiz
            if rel_path.startswith('./'):
                rel_path = rel_path[2:]
        else:
            # Alt dizindeki dosya - ../ veya ./ kullan
            if not rel_path.startswith('.'):
                rel_path = '../' + rel_path
        
        return rel_path
    except:
        # Hesaplanamazsa mutlak path kullan
        try:
            rel_to_root = image_abs_path.relative_to(root_dir)
            return '/' + str(rel_to_root).replace('\\', '/')
        except:
            return image_path

def fix_html_file(html_file):
    """
    HTML dosyasındaki tüm görsel path'lerini düzeltir.
    """
    try:
        with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"Hata ({html_file}): {e}")
        return False, []
    
    html_path = Path(html_file)
    original_content = content
    changes = []
    
    # Tüm görsel referanslarını bul ve düzelt
    patterns = [
        (r'src=["\']([^"\']*\.(jpg|jpeg|png|gif|webp|bmp))["\']', 'src'),
        (r'srcset=["\']([^"\']*\.(jpg|jpeg|png|gif|webp|bmp))["\']', 'srcset'),
        (r'href=["\']([^"\']*\.(jpg|jpeg|png|gif|webp|bmp))["\']', 'href'),
        (r'content=["\']([^"\']*\.(jpg|jpeg|png|gif|webp|bmp))["\']', 'content'),
    ]
    
    # Ters sırada işle (index'leri bozmamak için)
    all_matches = []
    for pattern, attr_type in patterns:
        for match in re.finditer(pattern, content, re.IGNORECASE):
            img_path = match.group(1)
            # URL'leri atla
            if img_path.startswith('http://') or img_path.startswith('https://'):
                continue
            all_matches.append((match.start(), match.end(), img_path, attr_type, match))
    
    # Ters sırada sırala
    all_matches.sort(reverse=True)
    
    for start, end, img_path, attr_type, match_obj in all_matches:
        # Logo dosyalarını atla (logo.png gibi, WebP değilse)
        if 'logo' in img_path.lower() and not img_path.lower().endswith('.webp'):
            # Ama logo.webp ise düzelt
            if not img_path.lower().endswith('.webp'):
                continue
        
        # Doğru path'i hesapla
        correct_path = calculate_correct_path(img_path, html_path)
        
        if correct_path != img_path:
            # İçeriği güncelle
            old_text = content[start:end]
            new_text = old_text.replace(img_path, correct_path, 1)
            content = content[:start] + new_text + content[end:]
            changes.append(f"{attr_type}: {img_path} -> {correct_path}")
    
    # Çift nokta sorunlarını düzelt (././ -> ./)
    content = re.sub(r'\./\./', './', content)
    content = re.sub(r'\./\./', './', content)  # Tekrar kontrol et
    
    # Değişiklik yapıldı mı?
    if content != original_content:
        try:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, changes
        except Exception as e:
            print(f"Yazma hatası ({html_file}): {e}")
            return False, []
    
    return False, []

def main():
    root_dir = Path('.')
    
    # Tüm HTML dosyalarını bul
    html_files = []
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__', 'tools'}]
        for file in files:
            if file.endswith('.html'):
                html_files.append(Path(root) / file)
    
    print(f"Toplam {len(html_files)} HTML dosyası bulundu.")
    print("=" * 80)
    
    updated_count = 0
    total_changes = 0
    
    for html_file in html_files:
        changed, changes = fix_html_file(html_file)
        
        if changed:
            updated_count += 1
            total_changes += len(changes)
            
            try:
                rel_path = html_file.relative_to(root_dir)
                if len(changes) <= 3:
                    print(f"\nGüncellendi: {rel_path}")
                    for change in changes:
                        print(f"  - {change}")
                else:
                    print(f"\nGüncellendi: {rel_path} ({len(changes)} değişiklik)")
            except UnicodeEncodeError:
                print(f"\nGüncellendi: {str(html_file)} ({len(changes)} değişiklik)")
    
    print("\n" + "=" * 80)
    print(f"İşlem tamamlandı!")
    print(f"  Toplam HTML dosyası: {len(html_files)}")
    print(f"  Güncellenen dosya: {updated_count}")
    print(f"  Toplam değişiklik: {total_changes}")

if __name__ == '__main__':
    main()

