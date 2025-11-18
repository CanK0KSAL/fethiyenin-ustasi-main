#!/usr/bin/env python3
"""
Tüm HTML sayfalarındaki görsel referanslarını kontrol eder ve düzeltir:
- Source etiketlerinde WebP olmayan görselleri WebP ile değiştirir
- Tüm görsel path'lerini kontrol eder ve düzenler
"""

import os
import re
from pathlib import Path
from collections import defaultdict

def find_all_image_references(html_file):
    """
    HTML dosyasındaki tüm görsel referanslarını bulur.
    """
    try:
        with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        references = []
        
        # <img src="..."> etiketleri
        img_pattern = r'<img([^>]*?)>'
        for match in re.finditer(img_pattern, content, re.IGNORECASE | re.DOTALL):
            img_tag = match.group(0)
            attrs = match.group(1)
            
            # src attribute
            src_match = re.search(r'src=["\']([^"\']+)["\']', attrs, re.IGNORECASE)
            if src_match:
                references.append({
                    'type': 'img_src',
                    'full_tag': img_tag,
                    'attr': 'src',
                    'path': src_match.group(1),
                    'match': src_match
                })
            
            # srcset attribute
            srcset_match = re.search(r'srcset=["\']([^"\']+)["\']', attrs, re.IGNORECASE)
            if srcset_match:
                references.append({
                    'type': 'img_srcset',
                    'full_tag': img_tag,
                    'attr': 'srcset',
                    'path': srcset_match.group(1),
                    'match': srcset_match
                })
        
        # <source srcset="..."> etiketleri
        source_pattern = r'<source([^>]*?)>'
        for match in re.finditer(source_pattern, content, re.IGNORECASE | re.DOTALL):
            source_tag = match.group(0)
            attrs = match.group(1)
            
            # srcset attribute
            srcset_match = re.search(r'srcset=["\']([^"\']+)["\']', attrs, re.IGNORECASE)
            if srcset_match:
                references.append({
                    'type': 'source_srcset',
                    'full_tag': source_tag,
                    'attr': 'srcset',
                    'path': srcset_match.group(1),
                    'match': srcset_match
                })
            
            # type attribute kontrolü
            type_match = re.search(r'type=["\']([^"\']+)["\']', attrs, re.IGNORECASE)
            ref_type = type_match.group(1) if type_match else None
            if references and references[-1]['type'] == 'source_srcset':
                references[-1]['mime_type'] = ref_type
        
        # <a href="..."> etiketleri (lightbox için)
        link_pattern = r'<a([^>]*?href=["\'][^"\']*\.(jpg|jpeg|png|gif|webp|bmp)[^"\']*["\'][^>]*?)>'
        for match in re.finditer(link_pattern, content, re.IGNORECASE):
            link_tag = match.group(0)
            attrs = match.group(1)
            
            href_match = re.search(r'href=["\']([^"\']+)["\']', attrs, re.IGNORECASE)
            if href_match:
                references.append({
                    'type': 'link_href',
                    'full_tag': link_tag,
                    'attr': 'href',
                    'path': href_match.group(1),
                    'match': href_match
                })
        
        # Meta etiketleri (og:image, etc.)
        meta_pattern = r'<meta([^>]*?content=["\'][^"\']*\.(jpg|jpeg|png|gif|webp|bmp)[^"\']*["\'][^>]*?)>'
        for match in re.finditer(meta_pattern, content, re.IGNORECASE):
            meta_tag = match.group(0)
            attrs = match.group(1)
            
            content_match = re.search(r'content=["\']([^"\']+)["\']', attrs, re.IGNORECASE)
            if content_match:
                references.append({
                    'type': 'meta_content',
                    'full_tag': meta_tag,
                    'attr': 'content',
                    'path': content_match.group(1),
                    'match': content_match
                })
        
        # Link preload etiketleri
        link_preload_pattern = r'<link([^>]*?rel=["\']preload["\'][^>]*?href=["\'][^"\']*\.(jpg|jpeg|png|gif|webp|bmp)[^"\']*["\'][^>]*?)>'
        for match in re.finditer(link_preload_pattern, content, re.IGNORECASE):
            link_tag = match.group(0)
            attrs = match.group(1)
            
            href_match = re.search(r'href=["\']([^"\']+)["\']', attrs, re.IGNORECASE)
            if href_match:
                references.append({
                    'type': 'link_preload',
                    'full_tag': link_tag,
                    'attr': 'href',
                    'path': href_match.group(1),
                    'match': href_match
                })
        
        return references, content
    except Exception as e:
        print(f"Hata ({html_file}): {e}")
        return [], ""

def check_webp_exists(image_path, html_file_path):
    """
    Görselin WebP versiyonunun var olup olmadığını kontrol eder.
    """
    root_dir = Path('.')
    html_dir = html_file_path.parent
    
    # Path'i normalize et
    if image_path.startswith('http://') or image_path.startswith('https://'):
        # URL'ler için WebP kontrolü yapılamaz
        return None, None
    
    # Farklı path formatlarını dene
    possible_paths = []
    
    # Mutlak path (/ ile başlayan)
    if image_path.startswith('/'):
        possible_paths.append(root_dir / image_path[1:])
    # Relatif path
    else:
        possible_paths.append(html_dir / image_path)
        possible_paths.append(root_dir / image_path)
        # ../ ile başlayan path'ler
        if image_path.startswith('../'):
            possible_paths.append(html_dir / image_path)
        elif image_path.startswith('./'):
            possible_paths.append(html_dir / image_path[2:])
    
    # Orijinal dosyayı bul
    original_file = None
    for path in possible_paths:
        if path.exists() and path.is_file():
            original_file = path
            break
    
    if not original_file:
        return None, None
    
    # WebP versiyonunu kontrol et
    webp_file = original_file.with_suffix('.webp')
    if webp_file.exists():
        # Relatif path'i hesapla
        try:
            rel_webp = webp_file.relative_to(root_dir)
            return str(rel_webp).replace('\\', '/'), original_file
        except:
            return str(webp_file), original_file
    
    return None, original_file

def fix_image_references(html_file):
    """
    HTML dosyasındaki görsel referanslarını düzeltir.
    """
    references, content = find_all_image_references(html_file)
    
    if not references:
        return False, content
    
    html_path = Path(html_file)
    changes_made = False
    updated_content = content
    
    # Değişiklikleri ters sırada yap (index'leri bozmamak için)
    for ref in reversed(references):
        image_path = ref['path']
        
        # Zaten WebP ise atla
        if image_path.lower().endswith('.webp'):
            continue
        
        # Logo dosyalarını atla
        if 'logo' in image_path.lower() and not image_path.lower().endswith('.webp'):
            continue
        
        # WebP versiyonunu kontrol et
        webp_path, original_file = check_webp_exists(image_path, html_path)
        
        if webp_path:
            # Path'i HTML'e göre relatif yap
            html_dir = html_path.parent
            root_dir = Path('.')
            
            try:
                webp_abs = (root_dir / webp_path).resolve()
                html_abs = html_dir.resolve()
                
                # Relatif path hesapla
                try:
                    rel_path = os.path.relpath(webp_abs, html_abs)
                    if not rel_path.startswith('.'):
                        rel_path = './' + rel_path
                    rel_path = rel_path.replace('\\', '/')
                except:
                    # Eğer relatif path hesaplanamazsa, mutlak path kullan
                    if webp_path.startswith('/'):
                        rel_path = webp_path
                    else:
                        rel_path = '/' + webp_path
            except:
                rel_path = webp_path
            
            # Orijinal path formatını koru
            if image_path.startswith('/'):
                new_path = '/' + webp_path.lstrip('/')
            elif image_path.startswith('../'):
                # ../ sayısını koru
                depth = len(image_path) - len(image_path.lstrip('../'))
                new_path = '../' * depth + webp_path.replace('\\', '/').lstrip('./')
            elif image_path.startswith('./'):
                new_path = './' + webp_path.replace('\\', '/').lstrip('./')
            else:
                new_path = rel_path
            
            # İçeriği güncelle
            old_ref = ref['match'].group(0)
            new_ref = old_ref.replace(image_path, new_path)
            updated_content = updated_content.replace(old_ref, new_ref, 1)
            changes_made = True
            
            # Source etiketlerinde type'ı da güncelle
            if ref['type'] == 'source_srcset':
                # type="image/jpeg" veya type="image/png" -> type="image/webp"
                updated_content = re.sub(
                    r'(<source[^>]*srcset=["\']' + re.escape(new_path) + r'["\'][^>]*type=["\'])image/(jpeg|jpg|png)(["\'])',
                    r'\1image/webp\3',
                    updated_content,
                    flags=re.IGNORECASE
                )
    
    return changes_made, updated_content

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
    total_refs_found = 0
    total_refs_fixed = 0
    
    for html_file in html_files:
        references, _ = find_all_image_references(html_file)
        total_refs_found += len(references)
        
        changes_made, updated_content = fix_image_references(html_file)
        
        if changes_made:
            # Dosyayı kaydet
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            
            # Kaç referans düzeltildi say
            _, old_content = find_all_image_references(html_file)
            fixed_count = 0
            for ref in references:
                if not ref['path'].lower().endswith('.webp') and 'logo' not in ref['path'].lower():
                    fixed_count += 1
            total_refs_fixed += fixed_count
            
            updated_count += 1
            try:
                rel_path = html_file.relative_to(root_dir)
                print(f"Güncellendi: {rel_path} ({fixed_count} referans düzeltildi)")
            except UnicodeEncodeError:
                print(f"Güncellendi: {str(html_file)} ({fixed_count} referans düzeltildi)")
    
    print("=" * 80)
    print(f"\nİşlem tamamlandı!")
    print(f"  Toplam HTML dosyası: {len(html_files)}")
    print(f"  Güncellenen dosya: {updated_count}")
    print(f"  Toplam görsel referansı: {total_refs_found}")
    print(f"  Düzeltilen referans: {total_refs_fixed}")

if __name__ == '__main__':
    main()

