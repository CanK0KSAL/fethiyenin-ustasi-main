#!/usr/bin/env python3
"""
HTML dosyalarında referans edilen ama fiziksel olarak mevcut olmayan görselleri bulur.
"""

import os
import re
from pathlib import Path

def find_image_references_in_html(html_file):
    """HTML dosyasındaki görsel referanslarını bulur."""
    try:
        with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # src, srcset, href attribute'larındaki görselleri bul
        patterns = [
            r'src=["\']([^"\']*\.(jpg|jpeg|png|gif|webp|bmp))["\']',
            r'srcset=["\']([^"\']*\.(jpg|jpeg|png|gif|webp|bmp))["\']',
            r'href=["\']([^"\']*\.(jpg|jpeg|png|gif|webp|bmp))["\']',
            r'content=["\']([^"\']*\.(jpg|jpeg|png|gif|webp|bmp))["\']',
        ]
        
        images = set()
        for pattern in patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                img_path = match[0] if isinstance(match, tuple) else match
                # Relatif path'leri düzelt
                if img_path.startswith('/'):
                    img_path = img_path[1:]
                elif img_path.startswith('./'):
                    img_path = img_path[2:]
                images.add(img_path)
        
        return images
    except Exception as e:
        print(f"Hata {html_file}: {e}")
        return set()

def main():
    root_dir = Path('.')
    
    # Tüm HTML dosyalarını bul
    html_files = []
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__'}]
        for file in files:
            if file.endswith('.html'):
                html_files.append(Path(root) / file)
    
    # Tüm görsel referanslarını topla
    all_referenced_images = set()
    for html_file in html_files:
        images = find_image_references_in_html(html_file)
        all_referenced_images.update(images)
    
    # Mevcut görselleri bul
    existing_images = set()
    for root, dirs, files in os.walk(root_dir / 'assets' / 'media'):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp')):
                rel_path = (Path(root) / file).relative_to(root_dir)
                existing_images.add(str(rel_path).replace('\\', '/'))
    
    # Eksik görselleri bul
    missing_images = []
    for img_ref in all_referenced_images:
        # assets/media ile başlayan görselleri kontrol et
        if 'assets/media' in img_ref or img_ref.startswith('media/'):
            # Farklı path formatlarını dene
            possible_paths = [
                img_ref,
                img_ref.replace('assets/media/', 'assets/media/'),
                img_ref.replace('/assets/media/', 'assets/media/'),
                img_ref.replace('media/', 'assets/media/'),
            ]
            
            found = False
            for path in possible_paths:
                full_path = root_dir / path
                if full_path.exists():
                    found = True
                    break
            
            if not found:
                missing_images.append(img_ref)
    
    # Sonuçları yazdır
    print("=" * 80)
    print("EKSİK GÖRSELLER (HTML'de referans edilen ama fiziksel olarak mevcut olmayan)")
    print("=" * 80)
    print(f"\nToplam referans edilen görsel: {len(all_referenced_images)}")
    print(f"Mevcut görsel: {len(existing_images)}")
    print(f"Eksik görsel: {len(missing_images)}\n")
    
    if missing_images:
        print("Eksik görseller:")
        for img in sorted(missing_images):
            print(f"  - {img}")
    else:
        print("Tüm referans edilen görseller mevcut!")
    
    print("\n" + "=" * 80)
    print("MEVCUT GÖRSELLER")
    print("=" * 80)
    for img in sorted(existing_images):
        print(f"  [OK] {img}")

if __name__ == '__main__':
    main()

