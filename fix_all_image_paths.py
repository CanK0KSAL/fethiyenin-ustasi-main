#!/usr/bin/env python3
"""
Tüm HTML sayfalarındaki görsel referanslarını detaylıca kontrol eder ve düzeltir:
- JPG/PNG/GIF referanslarını WebP ile değiştirir (WebP versiyonu varsa)
- Path'leri normalize eder ve düzenler
- Source etiketlerindeki type'ları günceller
"""

import os
import re
from pathlib import Path

def find_image_extensions_in_content(content):
    """
    İçerikteki tüm görsel uzantılarını bulur.
    """
    # Tüm görsel referanslarını bul
    patterns = [
        r'src=["\']([^"\']*\.(jpg|jpeg|png|gif|webp|bmp))["\']',
        r'srcset=["\']([^"\']*\.(jpg|jpeg|png|gif|webp|bmp))["\']',
        r'href=["\']([^"\']*\.(jpg|jpeg|png|gif|webp|bmp))["\']',
        r'content=["\']([^"\']*\.(jpg|jpeg|png|gif|webp|bmp))["\']',
    ]
    
    images = []
    for pattern in patterns:
        for match in re.finditer(pattern, content, re.IGNORECASE):
            img_path = match.group(1)
            ext = match.group(2) if len(match.groups()) > 1 else None
            images.append((img_path, ext, match))
    
    return images

def check_webp_version(image_path, html_file_path):
    """
    Görselin WebP versiyonunun var olup olmadığını kontrol eder.
    """
    root_dir = Path('.')
    html_dir = html_file_path.parent
    
    # URL'leri atla
    if image_path.startswith('http://') or image_path.startswith('https://'):
        return None
    
    # Path'i normalize et
    if image_path.startswith('/'):
        # Mutlak path
        test_path = root_dir / image_path[1:]
    elif image_path.startswith('../'):
        # Relatif path (üst dizin)
        test_path = html_dir / image_path
    elif image_path.startswith('./'):
        # Relatif path (mevcut dizin)
        test_path = html_dir / image_path[2:]
    else:
        # Relatif path
        test_path = html_dir / image_path
    
    # Orijinal dosyayı bul
    if test_path.exists() and test_path.is_file():
        original_file = test_path
    else:
        # Farklı yerlerde ara
        possible_paths = [
            root_dir / image_path.lstrip('/'),
            root_dir / image_path,
        ]
        original_file = None
        for path in possible_paths:
            if path.exists() and path.is_file():
                original_file = path
                break
        
        if not original_file:
            return None
    
    # WebP versiyonunu kontrol et
    webp_file = original_file.with_suffix('.webp')
    if webp_file.exists():
        # HTML'e göre relatif path hesapla
        try:
            rel_webp = os.path.relpath(webp_file, html_dir)
            if not rel_webp.startswith('.'):
                rel_webp = './' + rel_webp
            return rel_webp.replace('\\', '/')
        except:
            # Mutlak path kullan
            if image_path.startswith('/'):
                return '/' + str(webp_file.relative_to(root_dir)).replace('\\', '/')
            return str(webp_file.relative_to(root_dir)).replace('\\', '/')
    
    return None

def normalize_path(path, html_file_path, is_webp=False):
    """
    Path'i normalize eder ve HTML dosyasına göre relatif yapar.
    """
    root_dir = Path('.')
    html_dir = html_file_path.parent
    
    # URL'leri olduğu gibi bırak
    if path.startswith('http://') or path.startswith('https://'):
        return path
    
    # Path formatını koru ama normalize et
    if path.startswith('/'):
        # Mutlak path - olduğu gibi bırak ama normalize et
        normalized = '/' + path.lstrip('/').replace('\\', '/')
        return normalized
    elif path.startswith('../'):
        # Relatif path (üst dizin) - normalize et
        normalized = path.replace('\\', '/')
        return normalized
    elif path.startswith('./'):
        # Relatif path - normalize et
        normalized = './' + path[2:].replace('\\', '/')
        return normalized
    else:
        # Relatif path - normalize et
        normalized = path.replace('\\', '/')
        # Eğer / ile başlamıyorsa ve assets/media gibi bir path ise ./ ekle
        if 'assets/' in normalized or 'media/' in normalized:
            if not normalized.startswith('./') and not normalized.startswith('/'):
                normalized = './' + normalized
        return normalized

def fix_html_file(html_file):
    """
    HTML dosyasındaki tüm görsel referanslarını düzeltir.
    """
    try:
        with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"Hata ({html_file}): {e}")
        return False, content
    
    html_path = Path(html_file)
    original_content = content
    changes = []
    
    # Tüm görsel referanslarını bul
    image_refs = find_image_extensions_in_content(content)
    
    # Her referansı kontrol et ve güncelle
    for img_path, ext, match_obj in image_refs:
        # Logo dosyalarını atla (logo.png gibi)
        if 'logo' in img_path.lower() and not img_path.lower().endswith('.webp'):
            continue
        
        # Zaten WebP ise sadece path'i normalize et
        if img_path.lower().endswith('.webp'):
            normalized = normalize_path(img_path, html_path, is_webp=True)
            if normalized != img_path:
                content = content.replace(img_path, normalized, 1)
                changes.append(f"Path normalize edildi: {img_path} -> {normalized}")
            continue
        
        # JPG/PNG/GIF ise WebP versiyonunu kontrol et
        if ext and ext.lower() in ['jpg', 'jpeg', 'png', 'gif', 'bmp']:
            webp_path = check_webp_version(img_path, html_path)
            
            if webp_path:
                # WebP versiyonu var - değiştir
                # Orijinal path formatını koru
                if img_path.startswith('/'):
                    new_path = '/' + webp_path.lstrip('/').lstrip('./')
                elif img_path.startswith('../'):
                    # ../ sayısını koru
                    depth = len(img_path) - len(img_path.lstrip('../'))
                    new_path = '../' * depth + webp_path.lstrip('./')
                elif img_path.startswith('./'):
                    new_path = './' + webp_path.lstrip('./')
                else:
                    new_path = webp_path
                
                # İçeriği güncelle
                content = content.replace(img_path, new_path, 1)
                changes.append(f"WebP'ye dönüştürüldü: {img_path} -> {new_path}")
            else:
                # WebP yok - sadece path'i normalize et
                normalized = normalize_path(img_path, html_path)
                if normalized != img_path:
                    content = content.replace(img_path, normalized, 1)
                    changes.append(f"Path normalize edildi: {img_path} -> {normalized}")
    
    # Source etiketlerindeki type'ları güncelle
    # type="image/jpeg" veya type="image/png" -> type="image/webp" (eğer srcset WebP ise)
    def update_source_type(match):
        source_tag = match.group(0)
        srcset_match = re.search(r'srcset=["\']([^"\']+)["\']', source_tag, re.IGNORECASE)
        if srcset_match and srcset_match.group(1).lower().endswith('.webp'):
            # type="image/jpeg" veya type="image/png" -> type="image/webp"
            updated = re.sub(
                r'type=["\']image/(jpeg|jpg|png)["\']',
                'type="image/webp"',
                source_tag,
                flags=re.IGNORECASE
            )
            if updated != source_tag:
                changes.append("Source type güncellendi: image/webp")
            return updated
        return source_tag
    
    content = re.sub(
        r'<source[^>]*srcset=["\'][^"\']*\.webp[^"\']*["\'][^>]*>',
        update_source_type,
        content,
        flags=re.IGNORECASE
    )
    
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
                print(f"\nGüncellendi: {rel_path}")
                if len(changes) <= 5:
                    for change in changes:
                        print(f"  - {change}")
                else:
                    print(f"  ({len(changes)} değişiklik yapıldı)")
            except UnicodeEncodeError:
                print(f"\nGüncellendi: {str(html_file)} ({len(changes)} değişiklik)")
    
    print("\n" + "=" * 80)
    print(f"İşlem tamamlandı!")
    print(f"  Toplam HTML dosyası: {len(html_files)}")
    print(f"  Güncellenen dosya: {updated_count}")
    print(f"  Toplam değişiklik: {total_changes}")

if __name__ == '__main__':
    main()

