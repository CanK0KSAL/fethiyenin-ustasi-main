// ==============================
// NAV I18N (etiket metinleri)
// ==============================
window.NAV_I18N = {
  tr: {
    hizmetler: "Hizmetler",
    portfoy: "Portföy",
    bolgeler: "Bölgeler",
    blog: "Blog",
    hakkimizda: "Hakkımızda",
    iletisim: "İletişim",
    // Kategoriler
    cat: {
      infra: "Altyapı & Tesisat",
      surfaces: "Yüzeyler & Kaplamalar",
      interior: "İç Mimari & Marangozluk",
      exterior: "Dış Cephe & Yalıtım"
    },
    // Alt hizmetler
    svc: {
      electric: "Elektrik",
      plumbing: "Su & Kanalizasyon",
      hvac: "Isıtma & Soğutma",
      gas: "Doğalgaz & Bacalar",

      silk: "İpek Sıva",
      paint: "Boya (iç/dış)",
      plaster: "Sıva (klasik)",
      tile: "Fayans & Seramik",
      epoxy: "Epoksi Zemin",
      wallpaper: "Duvar Kağıdı",

      kitchenbath: "Mutfak & Banyo yenileme",
      wardrobes: "Dolap & Gömme dolap",
      doorswindows: "Kapı & Pencere (ahşap/PVC)",
      drywall: "Alçıpan & Asma Tavan",

      insulation: "Mantolama (ısı yalıtımı)",
      facadepaint: "Cephe Boyası",
      roofing: "Çatı Kaplama & Su Yalıtımı",
      gutters: "Yağmur Olukları"
    },
    areas: { fethiye:"Fethiye", calis:"Çalış", ovacik:"Ovacık", gocek:"Göcek" }
  },

  en: {
    hizmetler: "Services",
    portfoy: "Portfolio",
    bolgeler: "Areas",
    blog: "Blog",
    hakkimizda: "About",
    iletisim: "Contact",
    cat: {
      infra: "Infrastructure & Installation",
      surfaces: "Surfaces & Coatings",
      interior: "Interior Architecture & Carpentry",
      exterior: "Exterior & Insulation"
    },
    svc: {
      electric: "Wiring",
      plumbing: "Water & Sewage",
      hvac: "Heating & Cooling",
      gas: "Gas & Flues",

      silk: "Silk Plaster",
      paint: "Painting (interior/exterior)",
      plaster: "Plaster",
      tile: "Tiles & Ceramics",
      epoxy: "Epoxy Floor",
      wallpaper: "Wallpaper",

      kitchenbath: "Kitchen & Bathroom",
      wardrobes: "Wardrobes / Built-ins",
      doorswindows: "Doors & Windows",
      drywall: "Drywall & Suspended Ceiling",

      insulation: "External Insulation",
      facadepaint: "Facade Paint",
      roofing: "Roofing & Waterproofing",
      gutters: "Gutter Systems"
    },
    areas: { fethiye:"Fethiye", calis:"Calis", ovacik:"Ovacik", gocek:"Gocek" }
  },

  ru: {
    hizmetler: "Услуги",
    portfoy: "Портфолио",
    bolgeler: "Районы",
    blog: "Блог",
    hakkimizda: "О нас",
    iletisim: "Контакты",
    cat: {
      infra: "Инфраструктура и сети",
      surfaces: "Поверхности и отделка",
      interior: "Интерьер и столярные работы",
      exterior: "Фасад и утепление"
    },
    svc: {
      electric: "Электрика",
      plumbing: "Вода и канализация",
      hvac: "Отопление и охлаждение",
      gas: "Газ и дымоходы",

      silk: "Шелковая штукатурка",
      paint: "Покраска (инт/экст)",
      plaster: "Штукатурка",
      tile: "Плитка и керамика",
      epoxy: "Эпоксидный пол",
      wallpaper: "Обои",

      kitchenbath: "Кухня и ванная",
      wardrobes: "Шкафы / встроенные",
      doorswindows: "Двери и окна",
      drywall: "ГКЛ и подвесной потолок",

      insulation: "Наружное утепление",
      facadepaint: "Покраска фасада",
      roofing: "Кровля и гидроизоляция",
      gutters: "Водосточные системы"
    },
    areas: { fethiye:"Fethiye", calis:"Calis", ovacik:"Ovacik", gocek:"Gocek" }
  }
};

// =============================================
// SLUG HARİTASI (dil klasörü hariç, sade slug)
// =============================================
window.NAV_SLUGS = {
  tr: {
    home: "",
    // sayfalar
    portfolio: "portfoy/",
    blog: "blog/",
    about: "hakkimizda.html",
    contact: "iletisim.html",
    // bölgeler
    "area.fethiye": "bolgeler/fethiye.html",
    "area.calis":   "bolgeler/calis.html",
    "area.ovacik":  "bolgeler/ovacik.html",
    "area.gocek":   "bolgeler/gocek.html",
    // kategoriler
    "cat.infra":    "hizmetler/altyapi-tesisat/",
    "cat.surfaces": "hizmetler/yuzeyler-kaplamalar/",
    "cat.interior": "hizmetler/ic-mimari-marangozluk/",
    "cat.exterior": "hizmetler/dis-cephe-yalitim/",
    // hizmetler
    "svc.electric":     "hizmetler/altyapi-tesisat/elektrik/",
    "svc.plumbing":     "hizmetler/altyapi-tesisat/su-kanalizasyon/",
    "svc.hvac":         "hizmetler/altyapi-tesisat/isitma-sogutma/",
    "svc.gas":          "hizmetler/altyapi-tesisat/dogalgaz-bacalar/",
    "svc.silk":         "hizmetler/yuzeyler-kaplamalar/ipek-siva/",
    "svc.paint":        "hizmetler/yuzeyler-kaplamalar/boya/",
    "svc.plaster":      "hizmetler/yuzeyler-kaplamalar/siva/",
    "svc.tile":         "hizmetler/yuzeyler-kaplamalar/fayans-seramik/",
    "svc.epoxy":        "hizmetler/yuzeyler-kaplamalar/epoksi-zemin/",
    "svc.wallpaper":    "hizmetler/yuzeyler-kaplamalar/duvar-kagidi/",
    "svc.kitchenbath":  "hizmetler/ic-mimari-marangozluk/mutfak-banyo/",
    "svc.wardrobes":    "hizmetler/ic-mimari-marangozluk/dolap-gomme/",
    "svc.doorswindows": "hizmetler/ic-mimari-marangozluk/kapi-pencere/",
    "svc.drywall":      "hizmetler/ic-mimari-marangozluk/alcipan-asma-tavan/",
    "svc.insulation":   "hizmetler/dis-cephe-yalitim/mantolama/",
    "svc.facadepaint":  "hizmetler/dis-cephe-yalitim/cephe-boyasi/",
    "svc.roofing":      "hizmetler/dis-cephe-yalitim/cati-kaplama-su-yalitimi/",
    "svc.gutters":      "hizmetler/dis-cephe-yalitim/yagmur-oluklari/"
  },

  en: {
    home: "",
    portfolio: "portfolio/",
    blog: "blog/",
    about: "about.html",
    contact: "contact.html",
    "area.fethiye": "areas/fethiye.html",
    "area.calis":   "areas/calis.html",
    "area.ovacik":  "areas/ovacik.html",
    "area.gocek":   "areas/gocek.html",
    "cat.infra":    "services/infrastructure-installation/",
    "cat.surfaces": "services/surfaces-coatings/",
    "cat.interior": "services/interior-architecture/",
    "cat.exterior": "services/exterior-insulation/",
    "svc.electric":     "services/infrastructure-utilities/wiring/",
    "svc.plumbing":     "services/infrastructure-utilities/water-sewage/",
    "svc.hvac":         "services/infrastructure-utilities/heating-cooling/",
    "svc.gas":          "services/infrastructure-utilities/gas-flues/",
    "svc.silk":         "services/surfaces-finishes/silk-plaster/",
    "svc.paint":        "services/surfaces-finishes/painting/",
    "svc.plaster":      "services/surfaces-finishes/plaster/",
    "svc.tile":         "services/surfaces-finishes/tiles-ceramics/",
    "svc.epoxy":        "services/surfaces-finishes/epoxy-floor/",
    "svc.wallpaper":    "services/surfaces-finishes/wallpaper/",
    "svc.kitchenbath":  "services/interior-carpentry/kitchen-bathroom/",
    "svc.wardrobes":    "services/interior-carpentry/wardrobes/",
    "svc.doorswindows": "services/interior-carpentry/doors-windows/",
    "svc.drywall":      "services/interior-carpentry/drywall-suspended-ceiling/",
    "svc.insulation":   "services/facade-insulation/external-insulation/",
    "svc.facadepaint":  "services/facade-insulation/facade-paint/",
    "svc.roofing":      "services/facade-insulation/roofing-waterproofing/",
    "svc.gutters":      "services/facade-insulation/gutter-systems/"
  },

  ru: {
    home: "ru/",
    portfolio: "portfolio/",
    blog: "blog/",
    about: "o-nas/",
    contact: "kontakty",
    "area.fethiye": "rayony/fethiye.html",
    "area.calis":   "rayony/calis.html",
    "area.ovacik":  "rayony/ovacik.html",
    "area.gocek":   "rayony/gocek.html",
    "cat.infra":    "uslugi/infrastruktura-kommunikacii/",
    "cat.surfaces": "uslugi/poverhnosti-otdelka/",
    "cat.interior": "uslugi/interer-stolyarnye-raboty/",
    "cat.exterior": "uslugi/fasad-uteplenie/",
    "svc.electric":     "uslugi/infrastruktura-kommunikacii/elektrika/",
    "svc.plumbing":     "uslugi/infrastruktura-kommunikacii/voda-kanalizaciya/",
    "svc.hvac":         "uslugi/infrastruktura-kommunikacii/otoplenie-ohlazhdenie/",
    "svc.gas":          "uslugi/infrastruktura-kommunikacii/gaz-dymohody/",
    "svc.silk":         "uslugi/poverhnosti-otdelka/shelkovaya-shtukaturka/",
    "svc.paint":        "uslugi/poverhnosti-otdelka/okraska/",
    "svc.plaster":      "uslugi/poverhnosti-otdelka/shtukaturka/",
    "svc.tile":         "uslugi/poverhnosti-otdelka/plitka-keramika/",
    "svc.epoxy":        "uslugi/poverhnosti-otdelka/epoksi-pol/",
    "svc.wallpaper":    "uslugi/poverhnosti-otdelka/oboi/",
    "svc.kitchenbath":  "uslugi/interer-stolyarnye-raboty/kuhnya-vannaya/",
    "svc.wardrobes":    "uslugi/interer-stolyarnye-raboty/shkafy-vstroennye/",
    "svc.doorswindows": "uslugi/interer-stolyarnye-raboty/dveri-okna/",
    "svc.drywall":      "uslugi/interer-stolyarnye-raboty/gkl-podvesnye-potolki/",
    "svc.insulation":   "uslugi/fasad-uteplenie/uteplenie/",
    "svc.facadepaint":  "uslugi/fasad-uteplenie/pokraska-fasada/",
    "svc.roofing":      "uslugi/fasad-uteplenie/krovlya-gidroizolyaciya/",
    "svc.gutters":      "uslugi/fasad-uteplenie/vodostochnye-sistemy/"
  }
};

// ============================================================
// URL OLUŞTURUCU — TR Kökte, EN/RU kendi alt dizinlerinde
// ============================================================
(function () {
  // <<< ÖNEMLİ DEĞİŞİKLİK: TR ARTIK KÖKTE >>>
  const BASE = { tr: '/', en: '/en/', ru: '/ru/' };

  function getLocaleFromPath() {
    const path = (typeof location !== 'undefined' ? location.pathname : '') || '';
    const m = path.match(/^\/(en|ru)(?:\/|$)/i);
    return m ? m[1].toLowerCase() : 'tr'; // TR varsayılan ve KÖKTE
  }

  function normalize(base, slug) {
    const b = base.endsWith('/') ? base : base + '/';
    const s = (slug || '').replace(/^\/+/, '');
    return s ? (b + s) : b;
  }

  // Nihai URL üret
  window.navBuild = function navBuild(locale, key) {
    const loc = (locale || 'tr').toLowerCase();
    const map = window.NAV_SLUGS[loc] || {};
    const slug = map[key] || '';

    // HOME: dil temel kök
    if (key === 'home') return BASE[loc] || '/';

    // Diğerleri: temel + slug
    return normalize(BASE[loc] || '/', slug);
  };

  // Mevcut sayfanın diline göre kısa yardımcı
  window.navURL = function navURL(key) {
    return window.navBuild(getLocaleFromPath(), key);
  };
})();

// ==============================
// FOOTER I18N (aynen bırakıldı)
// ==============================
// === FOOTER I18N — TR / EN / RU (sıfırdan) ===
window.I18N = window.I18N || {};

// ---------------- TR ----------------
window.I18N.tr = Object.assign({}, window.I18N.tr, {
  footer: {
    brand: {
      name: "Fethiye’nin <span class=\"footer__gold\">Ustası</span>",
      alt:  "Fethiye’nin Ustası logosu",
      tag:  "Premium doku ve temiz uygulama standartları."
    },
    cols: {
      services: {
        title: "HİZMETLER",
        items: {
          infra:    "Altyapı & Tesisat",
          surfaces: "Yüzeyler & Kaplamalar",
          interior: "İç Mimari & Marangozluk",
          exterior: "Dış Cephe & Yalıtım"
        }
      },
      areas: {
        title: "BÖLGELER",
        items: {
          fethiye: "Fethiye",
          calis:   "Çalış",
          ovacik:  "Ovacık",
          gocek:   "Göcek"
        }
      },
      corp: {
        title: "KURUMSAL",
        items: {
          "main-page": "Ana Sayfa",
          portfolio:    "Portföy",
          blog:         "Blog",
          about:        "Hakkımızda",
          contact:      "İletişim"
        }
      },
      contact: {
        title:        "İLETİŞİM",
        phone:        "Telefon",
        phoneNumber:  "+90 506 022 29 00",
        mail:         "E-posta",
        emailAddress: "info@fethiyeninustasi.com"
      }
    },
    rights: "Tüm hakları saklıdır.",
    policies: {
      kvkk:    "KVKK",
      privacy: "Gizlilik",
      terms:   "Kullanım Şartları"
    },
    social: { whatsapp: "WhatsApp" }
  },
  soon: "Yakında"
});

// ---------------- EN ----------------
window.I18N.en = Object.assign({}, window.I18N.en, {
  footer: {
    brand: {
      name: "Fethiye’s <span class=\"footer__gold\">Master</span>",
      alt:  "Fethiye’s Master logo",
      tag:  "Premium textures and clean craftsmanship standards."
    },
    cols: {
      services: {
        title: "SERVICES",
        items: {
          infra:    "Infrastructure & Installation",
          surfaces: "Surfaces & Coatings",
          interior: "Interior Architecture & Carpentry",
          exterior: "Exterior & Insulation"
        }
      },
      areas: {
        title: "AREAS",
        items: {
          fethiye: "Fethiye",
          calis:   "Çalış",
          ovacik:  "Ovacık",
          gocek:   "Göcek"
        }
      },
      corp: {
        title: "CORPORATE",
        items: {
          "main-page": "Home",
          portfolio:    "Portfolio",
          blog:         "Blog",
          about:        "About",
          contact:      "Contact"
        }
      },
      contact: {
        title:        "CONTACT",
        phone:        "Phone",
        phoneNumber:  "+90 506 022 29 00",
        mail:         "E-mail",
        emailAddress: "info@fethiyeninustasi.com"
      }
    },
    rights: "All rights reserved.",
    policies: {
      kvkk:    "KVKK",
      privacy: "Privacy",
      terms:   "Terms of Use"
    },
    social: { whatsapp: "WhatsApp" }
  },
  soon: "Coming soon"
});

// ---------------- RU ----------------
window.I18N.ru = Object.assign({}, window.I18N.ru, {
  footer: {
    brand: {
      name: "Мастер <span class=\"footer__gold\">Фетхие</span>",
      alt:  "Логотип «Мастер Фетхие»",
      tag:  "Премиальные фактуры и аккуратное выполнение работ."
    },
    cols: {
      services: {
        title: "УСЛУГИ",
        items: {
          infra:    "Инфраструктура и монтаж",
          surfaces: "Поверхности и покрытия",
          interior: "Дизайн интерьера и столярные работы",
          exterior: "Фасад и утепление"
        }
      },
      areas: {
        title: "РАЙОНЫ",
        items: {
          fethiye: "Фетхие",
          calis:   "Чалыш",
          ovacik:  "Оваджик",
          gocek:   "Гёджек"
        }
      },
      corp: {
        title: "О КОМПАНИИ",
        items: {
          "main-page": "Главная",
          portfolio:    "Портфолио",
          blog:         "Блог",
          about:        "О нас",
          contact:      "Контакты"
        }
      },
      contact: {
        title:        "КОНТАКТЫ",
        phone:        "Телефон",
        phoneNumber:  "+90 506 022 29 00",
        mail:         "E-mail",
        emailAddress: "info@fethiyeninustasi.com"
      }
    },
    rights: "Все права защищены.",
    policies: {
      kvkk:    "KVKK",
      privacy: "Конфиденциальность",
      terms:   "Условия использования"
    },
    social: { whatsapp: "WhatsApp" }
  },
  soon: "Скоро"
});
