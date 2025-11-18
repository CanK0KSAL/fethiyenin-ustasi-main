// ==============================
// NAV I18N (etiket metinleri)
// ==============================
window.NAV_I18N = {
  tr: {
    hizmetler: "Hizmetler",
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
    bolgeler: "Регионы",
    blog: "Блог",
    hakkimizda: "О нас",
    iletisim: "Контакты",
    cat: {
      infra: "Установка инфраструктуры",
      surfaces: "Поверхности и покрытия",
      interior: "Внутренняя архитектура и плотницкие",
      exterior: "Внешняя изоляция"
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
    "svc.gutters":      "hizmetler/dis-cephe-yalitim/yagmur-oluklari/",
    "footer.policies.kvkk": "kvkk.html",
    "footer.policies.privacy": "gizlilik.html",
    "footer.policies.terms": "kullanim.html"
  },

  en: {
    home: "",
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
    "svc.gutters":      "services/facade-insulation/gutter-systems/",
    "footer.policies.kvkk": "en/kvkk.html",
    "footer.policies.privacy": "en/privacy.html",
    "footer.policies.terms": "en/terms.html"  
  },

  ru: {
    home: "",
    blog: "blog/",
    about: "о-нас.html",
    contact: "kontakt.html",
    "area.fethiye": "регионы/fethiye.html",
    "area.calis":   "регионы/calis.html",
    "area.ovacik":  "регионы/ovacik.html",
    "area.gocek":   "регионы/gocek.html",
    "cat.infra":    "услуги/установка-инфраструктуры/",
    "cat.surfaces": "услуги/поверхности-покрытия/",
    "cat.interior": "услуги/внутренняя-архитектура-плотницкие/",
    "cat.exterior": "услуги/внешняя-изоляция/",
    "svc.electric":     "услуги/установка-инфраструктуры/электрический/",
    "svc.plumbing":     "услуги/установка-инфраструктуры/вода-канализация/",
    "svc.hvac":         "услуги/установка-инфраструктуры/обогрев/",
    "svc.gas":          "услуги/установка-инфраструктуры/газ/",
    "svc.silk":         "услуги/поверхности-покрытия/шелк-шива/",
    "svc.paint":        "услуги/поверхности-покрытия/краска/",
    "svc.plaster":      "услуги/поверхности-покрытия/каменная-штукатурка/",
    "svc.tile":         "услуги/поверхности-покрытия/тканевые-обои/",
    "svc.epoxy":        "услуги/поверхности-покрытия/",
    "svc.wallpaper":    "услуги/поверхности-покрытия/тканевые-обои/",
    "svc.kitchenbath":  "услуги/внутренняя-архитектура-плотницкие/кухонные-шкафы/",
    "svc.wardrobes":    "услуги/внутренняя-архитектура-плотницкие/гардеробная-шкаф/",
    "svc.doorswindows": "услуги/внутренняя-архитектура-плотницкие/межкомнатные-двери-столярные/",
    "svc.drywall":      "услуги/внутренняя-архитектура-плотницкие/акустические-панели-ламбри/",
    "svc.insulation":   "услуги/внешняя-изоляция/обшивка/",
    "svc.facadepaint":  "услуги/внешняя-изоляция/фасадная-краска/",
    "svc.roofing":      "услуги/внешняя-изоляция/",
    "svc.gutters":      "услуги/внешняя-изоляция/",
    "footer.policies.kvkk": "ru/kvkk.html",
    "footer.policies.privacy": "ru/gizlilik.html",
    "footer.policies.terms": "ru/kullanim.html"
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
          infra:    "Установка инфраструктуры",
          surfaces: "Поверхности и покрытия",
          interior: "Внутренняя архитектура и плотницкие",
          exterior: "Внешняя изоляция"
        }
      },
      areas: {
        title: "РЕГИОНЫ",
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
