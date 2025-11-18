#!/usr/bin/env python3
"""
Logo dışındaki görsellerin WebP versiyonlarını kontrol eder ve 
WebP versiyonu varsa orijinal dosyaları (JPG, PNG, vb.) siler.
"""

import os
from pathlib import Path

def find_image_pairs(root_dir):
    """
    Tüm görsel dosyalarını bulur ve WebP eşleşmelerini kontrol eder.
    """
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp'}
    root_path = Path(root_dir)
    
    images_to_check = []
    webp_images = set()
    
    # Önce tüm WebP dosyalarını topla
    for root, dirs, files in os.walk(root_path / 'assets' / 'media'):
        # .git ve node_modules gibi klasörleri atla
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__'}]
        
        for file in files:
            if file.lower().endswith('.webp'):
                webp_path = Path(root) / file
                # Orijinal dosya adını bul (uzantı olmadan)
                original_name = file.rsplit('.', 1)[0]
                rel_path = webp_path.relative_to(root_path / 'assets' / 'media')
                webp_images.add((str(rel_path.parent / original_name), str(rel_path)))
    
    # Şimdi orijinal görselleri bul ve WebP eşleşmesi var mı kontrol et
    pairs_to_remove = []
    images_without_webp = []
    
    for root, dirs, files in os.walk(root_path / 'assets' / 'media'):
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__'}]
        
        for file in files:
            file_path = Path(root) / file
            ext = file_path.suffix.lower()
            
            # Logo dosyalarını atla
            if 'logo' in str(file_path).lower():
                continue
            
            # WebP dosyalarını atla
            if ext == '.webp':
                continue
            
            # Sadece görsel dosyalarını kontrol et
            if ext in image_extensions:
                rel_path = file_path.relative_to(root_path / 'assets' / 'media')
                file_name_no_ext = file_path.stem
                parent_dir = rel_path.parent
                
                # WebP versiyonunu kontrol et
                webp_path = file_path.with_suffix('.webp')
                
                # Farklı path formatlarını kontrol et
                found_webp = False
                webp_match = None
                
                # Doğrudan aynı yerde WebP var mı?
                if webp_path.exists():
                    found_webp = True
                    webp_match = webp_path
                else:
                    # WebP listesinde var mı kontrol et
                    search_key = str(parent_dir / file_name_no_ext)
                    for webp_key, webp_rel in webp_images:
                        if webp_key.lower() == search_key.lower():
                            found_webp = True
                            webp_match = root_path / 'assets' / 'media' / webp_rel
                            break
                
                if found_webp:
                    pairs_to_remove.append((file_path, webp_match))
                else:
                    images_without_webp.append(file_path)
    
    return pairs_to_remove, images_without_webp

def main():
    root_dir = Path('.')
    
    print("Görseller kontrol ediliyor...")
    print("=" * 80)
    
    pairs_to_remove, images_without_webp = find_image_pairs(root_dir)
    
    print(f"\nWebP versiyonu OLAN görseller (silinecek): {len(pairs_to_remove)}")
    print(f"WebP versiyonu OLMAYAN görseller (korunacak): {len(images_without_webp)}")
    
    if images_without_webp:
        print("\n" + "=" * 80)
        print("UYARI: WebP versiyonu olmayan görseller (bunlar silinmeyecek):")
        print("=" * 80)
        for img in images_without_webp:
            rel_path = img.relative_to(root_dir)
            print(f"  - {rel_path}")
    
    if pairs_to_remove:
        print("\n" + "=" * 80)
        print("WebP versiyonu olan görseller (orijinalleri silinecek):")
        print("=" * 80)
        for original, webp in pairs_to_remove:
            rel_original = original.relative_to(root_dir)
            rel_webp = webp.relative_to(root_dir)
            print(f"  Orijinal: {rel_original}")
            print(f"  WebP:     {rel_webp}")
            print()
        
        # Otomatik olarak sil
        print("=" * 80)
        print(f"\n{len(pairs_to_remove)} orijinal görsel siliniyor...")
        print("=" * 80)
        
        deleted_count = 0
        failed_count = 0
        
        for original, webp in pairs_to_remove:
            try:
                original.unlink()
                deleted_count += 1
                rel_path = original.relative_to(root_dir)
                try:
                    print(f"Silindi: {rel_path}")
                except UnicodeEncodeError:
                    print(f"Silindi: {str(rel_path)}")
            except Exception as e:
                failed_count += 1
                rel_path = original.relative_to(root_dir)
                try:
                    print(f"Hata ({rel_path}): {e}")
                except UnicodeEncodeError:
                    print(f"Hata: {str(rel_path)}")
        
        print("\n" + "=" * 80)
        print(f"İşlem tamamlandı!")
        print(f"  Silinen: {deleted_count}")
        print(f"  Hata: {failed_count}")
    else:
        print("\nSilinecek görsel bulunamadı.")

if __name__ == '__main__':
    main()

