#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RU klasorundeki dosya/klasor adlarini sitemap.xml'deki Rusca path'lere gore yeniden adlandirir
"""
import os
import sys
import shutil

# Windows console encoding'i düzelt
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Mapping: İngilizce/mevcut ad -> Rusça yeni ad
RENAME_MAP = {
    # Ana klasörler
    "services": "услуги",
    "areas": "регионы",
    
    # Infrastructure Installation
    "infrastructure-installation": "установка-инфраструктуры",
    "electric": "электрический",
    "water-sewerage": "вода-канализация",
    "heating": "обогрев",
    "gas": "газ",
    
    # Surfaces & Coatings
    "surfaces-coatings": "поверхности-покрытия",
    "silk-plaster": "шелк-шива",
    "paint": "краска",
    "stone-plaster": "каменная-штукатурка",
    "italian-plaster": "итальянская-штукатурка",
    "wall-fabric": "тканевые-обои",
    
    # Interior Architecture
    "interior-architecture": "внутренняя-архитектура-плотницкие",
    "kitchen-cabinets": "кухонные-шкафы",
    "walk-in-closet-wardrobe": "гардеробная-шкаф",
    "bathroom-vanity-cabinet": "тумба-для-ванной",
    "tv-unit-wall-panel": "тв-тумба-стеновая-панель",
    "interior-doors-joinery": "межкомнатные-двери-столярные",
    "staircase-cladding-storage": "облицовка-лестницы-хранение",
    "acoustic-panel": "акустические-панели-ламбри",
    
    # Exterior Insulation
    "exterior-insulation": "внешняя-изоляция",
    "sheathing": "обшивка",
    "exterior-paint": "фасадная-краска",
    "silicone-acrylic": "силикон-акриловая-штукатурка",
    "stone-composite": "каменная-композитная-облицовка",
    
    # Dosyalar
    "contact.html": "kontakt.html",
    "about.html": "о-нас.html",
    
    # Blog dosyaları (EN -> RU)
    "silk-siva-guide-2025.html": "rukovodstvo-po-shelkovoy-shtukaturke-2025.html",
    "tv-unit-wall-panel-trends.html": "trendy-tv-yunitsy-nastennoy-paneli.html",
    "wardrobe-planning-tips.html": "sovety-po-planirovaniyu-garderoba.html",
    "interior-door-joining-models.html": "modeli-mezhkomnatnyh-dverey-stolyarnyh.html",
    "stone-composite-coating-maintenance-guide.html": "rukovodstvo-po-uhodu-za-kamennym-kompozitnym-pokrytiem.html",
    "exterior-paint-color-selection-fethiye.html": "vybor-tsveta-fasadnoy-kraski-fethiye.html",
    "insulation-cost-fethiye-2025.html": "stoimost-utepleniya-fethiye-2025.html",
    "italian-plaster-venetian-plaster-guide.html": "rukovodstvo-po-italyanskoy-shtukaturke-venetsianskoy-2025.html",
    "stone-plaster-or-wall-fabric.html": "kamennaya-shtukaturka-ili-tkanevye-oboi.html",
}

# Script'in bulunduğu dizini bul
if __file__:
    BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ru")
else:
    # Fallback: workspace root'tan bul
    BASE_DIR = os.path.join(r"C:\Users\ASUS\Desktop\Fethiyenin-Ustası full", "ru")

def rename_item(base_path, old_name, new_name):
    """Dosya veya klasörü yeniden adlandır"""
    old_path = os.path.join(base_path, old_name)
    new_path = os.path.join(base_path, new_name)
    
    if not os.path.exists(old_path):
        print(f"Bulunamadi: {old_path}")
        return False
    
    if os.path.exists(new_path):
        print(f"Zaten var: {new_path}")
        return False
    
    try:
        # Windows'ta bazen shutil.move daha iyi çalışır
        if sys.platform == "win32":
            shutil.move(old_path, new_path)
        else:
            os.rename(old_path, new_path)
        print(f"Yeniden adlandirildi: {old_name} -> {new_name}")
        return True
    except PermissionError as e:
        print(f"Izin hatasi ({old_name}): Dosya/klasor acik olabilir veya izin yetersiz")
        return False
    except Exception as e:
        print(f"Hata ({old_name}): {type(e).__name__}")
        return False

def rename_recursive(path, mapping):
    """Klasörleri recursive olarak yeniden adlandır"""
    # Önce bu dizindeki öğeleri kontrol et
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        
        # Eğer mapping'de varsa yeniden adlandır
        if item in mapping:
            new_name = mapping[item]
            rename_item(path, item, new_name)
            # Yeni ad ile devam et
            item = new_name
            item_path = os.path.join(path, item)
        
        # Eğer klasör ise recursive devam et
        if os.path.isdir(item_path):
            rename_recursive(item_path, mapping)

def main():
    print("RU klasorundeki dosyalar yeniden adlandiriliyor...\n")
    
    if not os.path.exists(BASE_DIR):
        print(f"RU klasoru bulunamadi: {BASE_DIR}")
        return
    
    # Ana klasörler (ru/ altında)
    print("Ana klasorler yeniden adlandiriliyor...")
    rename_item(BASE_DIR, "services", "услуги")
    rename_item(BASE_DIR, "areas", "регионы")
    rename_item(BASE_DIR, "contact.html", "kontakt.html")
    rename_item(BASE_DIR, "about.html", "о-нас.html")
    
    # Services alt klasörleri
    services_dir = os.path.join(BASE_DIR, "услуги")
    if os.path.exists(services_dir):
        print("\nServices alt klasorleri yeniden adlandiriliyor...")
        rename_recursive(services_dir, RENAME_MAP)
    
    # Blog dosyaları
    blog_dir = os.path.join(BASE_DIR, "blog")
    if os.path.exists(blog_dir):
        print("\nBlog dosyalari yeniden adlandiriliyor...")
        rename_recursive(blog_dir, RENAME_MAP)
    
    print("\nYeniden adlandirma tamamlandi!")

if __name__ == "__main__":
    main()

