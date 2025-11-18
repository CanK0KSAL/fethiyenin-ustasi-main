// --------------------------------------------
// /assets/js/nav.js
// --------------------------------------------

const SUPPORTED = ["tr","en","ru"];
const DEFAULT_LANG = "tr"; // TR kök (prefixsiz) — EN/RU prefixli

function getLangFromPath(){
  const seg = (location.pathname.split("/").filter(Boolean)[0] || "").toLowerCase();
  return SUPPORTED.includes(seg) ? seg : DEFAULT_LANG;
}
function setHtmlLang(code){ document.documentElement.lang = code; }

// TR için "/" kök; EN/RU için "/en/" "/ru/". Rest’in başındaki "/" temizlenir.
function buildUrl(lang, rest){
  const base = (lang === DEFAULT_LANG) ? "/" : `/${lang}/`;
  const clean = (rest || "").replace(/^\/+/, "");
  return base + clean;
}
function currentRestPath(){
  const parts = location.pathname.split("/").filter(Boolean);
  const afterLang = SUPPORTED.includes(parts[0]) ? parts.slice(1) : parts;
  return afterLang.join("/") + (location.pathname.endsWith("/") ? "/" : "");
}

// Reverse index (aynı sayfanın diğer dil URL'si)
function makeReverseIndex(){
  const idx = { tr:{}, en:{}, ru:{} };
  for(const lang of SUPPORTED){
    const map = (window.NAV_SLUGS && window.NAV_SLUGS[lang]) || {};
    for(const [key, rest] of Object.entries(map)){
      idx[lang][rest] = key;
      if(!rest.endsWith(".html") && rest.endsWith("/")) idx[lang][rest.slice(0,-1)] = key;
    }
  }
  return idx;
}
const REVERSE = makeReverseIndex();

// Path segment çevirisi için mapping tabloları
const PATH_TRANSLATIONS = {
  // Kategori çevirileri
  "hizmetler": "services",
  "altyapi-tesisat": "infrastructure-installation",
  "yuzeyler-kaplamalar": "surfaces-coatings",
  "ic-mimari-marangozluk": "interior-architecture",
  "dis-cephe-yalitim": "exterior-insulation",
  // Alt hizmet çevirileri
  "elektrik": "electric",
  "su-kanalizasyon": "water-sewerage",
  "isitma": "heating",
  "dogalgaz": "gas",
  "ipek-siva": "silk-plaster",
  "italyan-siva": "italian-plaster",
  "boya": "paint",
  "tas-siva": "stone-plaster",
  "duvar-kumasi": "wall-fabric",
  "mutfak-dolaplari": "kitchen-cabinets",
  "banyo-dolabi": "bathroom-vanity-cabinet",
  "tv-unitesi-duvar-paneli": "tv-unit-wall-panel",
  "ic-kapi-dograma": "interior-doors-joinery",
  "merdiven-kaplama-depolama": "staircase-cladding-storage",
  "giyinme-odasi-gardrop": "walk-in-closet-wardrobe",
  "akustik-panel-lambri": "acoustic-panel",
  "mantolama": "sheathing",
  "silikon-akrilik-kaplama": "silicone-acrylic",
  "tas-kompozit-kaplama": "stone-composite",
  "dis-cephe-boya": "exterior-paint"
};

// Blog dosya isimleri çevirisi (tam dosya adı eşleştirmesi)
const BLOG_FILE_TRANSLATIONS = {
  // TR -> EN
  "ipek-siva-rehberi-2025.html": "silk-siva-guide-2025.html",
  "tv-unitesi-duvar-panel-trendleri.html": "tv-unit-wall-panel-trends.html",
  "gardrop-planlama-ipuclari.html": "wardrobe-planning-tips.html",
  "ic-kapi-dograma-modelleri.html": "interior-door-joining-models.html",
  "tas-kompozit-kaplama-bakim-rehberi.html": "stone-composite-coating-maintenance-guide.html",
  "dis-cephe-boya-renk-secimi-fethiye.html": "exterior-paint-color-selection-fethiye.html",
  "mantolama-maliyeti-fethiye-2025.html": "insulation-cost-fethiye-2025.html",
  "italyan-siva-venetian-plaster-rehberi.html": "italian-plaster-venetian-plaster-guide.html",
  "tas-siva-mi-duvar-kumasi-mi.html": "stone-plaster-or-wall-fabric.html"
};

// Path bazlı eşleştirme için yardımcı fonksiyonlar
function translatePathSegment(segment){
  return PATH_TRANSLATIONS[segment] || segment;
}

// Contact sayfaları için özel mapping
const CONTACT_PAGE_TRANSLATIONS = {
  // TR -> EN
  "iletisim.html": "contact.html",
  // EN -> TR
  "contact.html": "iletisim.html",
  // TR -> RU
  "iletisim.html": "kontakt.html",
  // RU -> TR
  "kontakt.html": "iletisim.html",
  // EN -> RU
  "contact.html": "kontakt.html",
  // RU -> EN
  "kontakt.html": "contact.html"
};

function translatePathToTargetLang(path, fromLang, toLang){
  if(fromLang === toLang) return path;
  
  // Contact sayfaları için özel işleme - önce bu kontrol edilmeli
  // Path'in son segmentini kontrol et
  const segments = path.split("/").filter(Boolean);
  const lastSegment = segments.length > 0 ? segments[segments.length - 1] : "";
  
  if(lastSegment === "iletisim.html" || lastSegment === "contact.html" || lastSegment === "kontakt.html"){
    // Contact sayfası için direkt dosya adını değiştir
    if(lastSegment === "iletisim.html"){
      if(toLang === "en") return "contact.html";
      if(toLang === "ru") return "kontakt.html";
    }
    if(lastSegment === "contact.html"){
      if(toLang === "tr") return "iletisim.html";
      if(toLang === "ru") return "kontakt.html";
    }
    if(lastSegment === "kontakt.html"){
      if(toLang === "tr") return "iletisim.html";
      if(toLang === "en") return "contact.html";
    }
    // Eğer yukarıdaki return'lar çalışmadıysa (aynı dil gibi), path'i segment'lerle güncelle
    const newSegments = [...segments];
    if(lastSegment === "iletisim.html"){
      newSegments[newSegments.length - 1] = (toLang === "en") ? "contact.html" : "kontakt.html";
    } else if(lastSegment === "contact.html"){
      newSegments[newSegments.length - 1] = (toLang === "tr") ? "iletisim.html" : "kontakt.html";
    } else if(lastSegment === "kontakt.html"){
      newSegments[newSegments.length - 1] = (toLang === "tr") ? "iletisim.html" : "contact.html";
    }
    return newSegments.join("/") + (path.endsWith("/") ? "/" : "");
  }
  
  // Blog path'leri için özel işleme
  if(path.includes("/blog/") || path.startsWith("blog/")){
    return translateBlogPath(path, fromLang, toLang);
  }
  
  // Türkçe'den İngilizce'ye çeviri
  if(fromLang === "tr" && toLang === "en"){
    const segments = path.split("/").filter(Boolean);
    const translated = segments.map(translatePathSegment).join("/");
    return translated + (path.endsWith("/") ? "/" : "");
  }
  
  // İngilizce'den Türkçe'ye çeviri
  if(fromLang === "en" && toLang === "tr"){
    // Reverse lookup
    const reverseMap = {};
    for(const [trKey, enValue] of Object.entries(PATH_TRANSLATIONS)){
      reverseMap[enValue] = trKey;
    }
    const segments = path.split("/").filter(Boolean);
    const translated = segments.map(seg => reverseMap[seg] || seg).join("/");
    return translated + (path.endsWith("/") ? "/" : "");
  }
  
  
  return null;
}

// Blog path'leri için özel çeviri fonksiyonu
function translateBlogPath(path, fromLang, toLang){
  const segments = path.split("/").filter(Boolean);
  
  // Blog dizinini bul
  const blogIndex = segments.findIndex(s => s === "blog" || s.includes("blog"));
  
  if(blogIndex === -1) return null;
  
  // Türkçe'den İngilizce'ye
  if(fromLang === "tr" && toLang === "en"){
    const newSegments = [...segments];
    
    // Blog dizini "blog" -> "blog" (aynı kalır, sadece önüne /en/ eklenir buildUrl ile)
    
    // Dosya adını çevir (eğer varsa)
    const lastSegment = newSegments[newSegments.length - 1];
    if(lastSegment && lastSegment.endsWith(".html") && BLOG_FILE_TRANSLATIONS[lastSegment]){
      newSegments[newSegments.length - 1] = BLOG_FILE_TRANSLATIONS[lastSegment];
    } else if(lastSegment && lastSegment.endsWith(".html")){
      // Eğer mapping'de yoksa, segment segment çevir
      const fileName = lastSegment.replace(".html", "");
      const translatedName = fileName.split("-").map(translatePathSegment).join("-");
      newSegments[newSegments.length - 1] = translatedName + ".html";
    }
    
    return newSegments.join("/") + (path.endsWith("/") ? "/" : "");
  }
  
  // İngilizce'den Türkçe'ye
  if(fromLang === "en" && toLang === "tr"){
    // Reverse lookup for blog files
    const reverseBlogMap = {};
    for(const [trKey, enValue] of Object.entries(BLOG_FILE_TRANSLATIONS)){
      reverseBlogMap[enValue] = trKey;
    }
    
    const newSegments = [...segments];
    
    // Dosya adını çevir (eğer varsa)
    const lastSegment = newSegments[newSegments.length - 1];
    if(lastSegment && lastSegment.endsWith(".html")){
      if(reverseBlogMap[lastSegment]){
        newSegments[newSegments.length - 1] = reverseBlogMap[lastSegment];
      } else {
        // Eğer mapping'de yoksa, segment segment çevir
        const reversePathMap = {};
        for(const [trKey, enValue] of Object.entries(PATH_TRANSLATIONS)){
          reversePathMap[enValue] = trKey;
        }
        const fileName = lastSegment.replace(".html", "");
        const translatedName = fileName.split("-").map(seg => reversePathMap[seg] || seg).join("-");
        newSegments[newSegments.length - 1] = translatedName + ".html";
      }
    }
    
    return newSegments.join("/") + (path.endsWith("/") ? "/" : "");
  }
  
  return null;
}

function findKeyByPath(lang, path){
  // Contact sayfaları için özel kontrol
  if(path === "iletisim.html" || path === "contact.html" || path === "kontakt.html" || 
     path.endsWith("/iletisim.html") || path.endsWith("/contact.html") || path.endsWith("/kontakt.html")){
    return "contact";
  }
  
  // Önce tam eşleşme
  if(REVERSE[lang][path]) return REVERSE[lang][path];
  if(REVERSE[lang][path.replace(/\/?$/,"/")]) return REVERSE[lang][path.replace(/\/?$/,"/")];
  
  // Path segmentlerine ayır ve parent path'leri dene
  const segments = path.split("/").filter(Boolean);
  
  // Parent path'leri sırayla dene (en uzun önce)
  for(let i = segments.length; i > 0; i--){
    const parentPath = segments.slice(0, i).join("/") + "/";
    if(REVERSE[lang][parentPath]) return REVERSE[lang][parentPath];
    const parentPathNoSlash = segments.slice(0, i).join("/");
    if(REVERSE[lang][parentPathNoSlash]) return REVERSE[lang][parentPathNoSlash];
  }
  
  // Kategori eşleştirmeleri için pattern matching
  // services/infrastructure-installation/electric -> cat.infra veya svc.electric
  if(lang === "en" && path.startsWith("services/")){
    if(path.includes("infrastructure-installation")) return "cat.infra";
    if(path.includes("surfaces-coatings")) return "cat.surfaces";
    if(path.includes("interior-architecture")) return "cat.interior";
    if(path.includes("exterior-insulation")) return "cat.exterior";
  }
  if(lang === "tr" && path.startsWith("hizmetler/")){
    if(path.includes("altyapi-tesisat")) return "cat.infra";
    if(path.includes("yuzeyler-kaplamalar")) return "cat.surfaces";
    if(path.includes("ic-mimari-marangozluk")) return "cat.interior";
    if(path.includes("dis-cephe-yalitim")) return "cat.exterior";
  }
  
  return null;
}

function translateCurrentUrl(targetLang){
  const curLang = getLangFromPath();
  const rest = currentRestPath();
  
  // Contact sayfaları için özel kontrol - önce bu
  const restSegments = rest.split("/").filter(Boolean);
  const lastRestSegment = restSegments.length > 0 ? restSegments[restSegments.length - 1] : "";
  if(lastRestSegment === "iletisim.html" || lastRestSegment === "contact.html" || lastRestSegment === "kontakt.html"){
    const contactKey = "contact";
    const targetRest = (window.NAV_SLUGS[targetLang] || {})[contactKey] || "";
    if(targetRest){
      return buildUrl(targetLang, targetRest);
    }
  }
  
  // Önce beklenen path'i hesapla
  const expectedPath = translatePathToTargetLang(rest, curLang, targetLang);
  const expectedUrl = expectedPath ? buildUrl(targetLang, expectedPath) : null;
  
  // Hreflang etiketlerinden hedef URL'yi oku (en güvenilir yöntem)
  // head içindeki link'ler arasından doğru olanı bul
  const allHreflangLinks = document.querySelectorAll(`head link[rel="alternate"][hreflang="${targetLang}"]`);
  let hreflangLink = null;
  
  // Eğer birden fazla varsa, beklenen path'e uygun olanı seç
  if(allHreflangLinks.length > 0){
    if(allHreflangLinks.length === 1){
      hreflangLink = allHreflangLinks[0];
    } else {
      // Birden fazla varsa, beklenen URL'ye en yakın olanı bul
      if(expectedUrl){
        for(const link of allHreflangLinks){
          const href = link.getAttribute("href") || "";
          try {
            const url = new URL(href);
            const linkPath = url.pathname.replace(/\/$/, "") || "/";
            const expectedPathNormalized = expectedUrl.replace(/\/$/, "") || "/";
            if(linkPath === expectedPathNormalized){
              hreflangLink = link;
              break;
            }
          } catch(e){}
        }
      }
      // Uygun bulunamazsa ilkini kullan
      if(!hreflangLink) hreflangLink = allHreflangLinks[0];
    }
  }
  
  if(hreflangLink){
    const href = hreflangLink.getAttribute("href");
    if(href){
      try {
        const url = new URL(href);
        let pathname = url.pathname;
        // Eğer hreflang'deki path'te Türkçe kelime varsa (hizmetler gibi) ama EN'ye gidiyorsak, düzelt
        // Örnek: /en/hizmetler/... -> /en/services/...
        if(targetLang === "en" && pathname.includes("/hizmetler/")){
          // Path çevirisi ile düzelt
          const corrected = translatePathToTargetLang(rest, curLang, targetLang);
          if(corrected){
            return buildUrl(targetLang, corrected);
          }
        }
        // Eğer hreflang'deki path'te İngilizce kelime varsa ama TR'ye gidiyorsak, düzelt
        if(targetLang === "tr" && (pathname.includes("/services/") || pathname.includes("/en/hizmetler/"))){
          const corrected = translatePathToTargetLang(rest, curLang, targetLang);
          if(corrected){
            return buildUrl(targetLang, corrected);
          }
        }
        // Path'in mevcut sayfaya uygun olup olmadığını kontrol et
        // Normalize edilmiş path'leri karşılaştır
        const normalizedHreflang = pathname.replace(/\/$/, "") || "/";
        if(expectedUrl){
          const normalizedExpected = expectedUrl.replace(/\/$/, "") || "/";
          if(normalizedHreflang !== normalizedExpected){
            // Hreflang path'i beklenen path'le uyuşmuyor, beklenen path'i kullan
            return expectedUrl;
          }
        }
        return pathname;
      } catch(e){
        // URL parse hatası, pathname'i direkt kullan
        if(href.startsWith("/")) {
          // Hatalı path'leri düzeltmeye çalış
          if((targetLang === "en" && href.includes("/hizmetler/")) || 
             (targetLang === "tr" && (href.includes("/services/") || href.includes("/en/hizmetler/")))){
            const corrected = translatePathToTargetLang(rest, curLang, targetLang);
            if(corrected){
              return buildUrl(targetLang, corrected);
            }
          }
          return href;
        }
        if(href.startsWith("http")){
          try {
            return new URL(href).pathname;
          } catch(e2){}
        }
      }
    }
  }
  
  // Hreflang yoksa veya hatalıysa, path çevirisi yap
  const translatedPath = translatePathToTargetLang(rest, curLang, targetLang);
  if(translatedPath){
    // Çevrilen path'in NAV_SLUGS'te olup olmadığını kontrol et
    const targetKey = findKeyByPath(targetLang, translatedPath);
    if(targetKey){
      const targetRest = (window.NAV_SLUGS[targetLang] || {})[targetKey] || "";
      return buildUrl(targetLang, targetRest);
    }
    // Çevrilen path'i direkt kullan (belki NAV_SLUGS'te yok ama dosya var)
    return buildUrl(targetLang, translatedPath);
  }
  
  // Path çevirisi de çalışmadıysa, NAV_SLUGS tabanlı çeviri yap
  let key = findKeyByPath(curLang, rest);
  
  // Eğer hala bulunamadıysa, alternatif path formatlarını dene
  if(!key){
    key = REVERSE[curLang][rest] || 
          REVERSE[curLang][rest.replace(/\/?$/,"/")] || 
          REVERSE[curLang][rest.replace(/\/$/, "")];
  }
  
  // Hala bulunamadıysa parent kategoriye düş
  if(!key){
    // Eğer services/ veya hizmetler/ içindeyse kategori key'i kullan
    if(rest.includes("services/infrastructure-installation") || rest.includes("hizmetler/altyapi-tesisat")){
      key = "cat.infra";
    } else if(rest.includes("services/surfaces-coatings") || rest.includes("hizmetler/yuzeyler-kaplamalar")){
      key = "cat.surfaces";
    } else if(rest.includes("services/interior-architecture") || rest.includes("hizmetler/ic-mimari-marangozluk")){
      key = "cat.interior";
    } else if(rest.includes("services/exterior-insulation") || rest.includes("hizmetler/dis-cephe-yalitim")){
      key = "cat.exterior";
    } else {
      key = "home";
    }
  }
  
  const targetRest = (window.NAV_SLUGS[targetLang] || {})[key] || "";
  return buildUrl(targetLang, targetRest);
}

// ---- Nav Model (4 ana kategori) ----
function urlFor(lang, key){ return buildUrl(lang, ((window.NAV_SLUGS[lang] || {})[key]) || ""); }
function navModel(lang, L){
  return [
    {
      label: L.hizmetler,
      items: [
        { label: L.cat.infra,    href: urlFor(lang, "cat.infra") },
        { label: L.cat.surfaces, href: urlFor(lang, "cat.surfaces") },
        { label: L.cat.interior, href: urlFor(lang, "cat.interior") },
        { label: L.cat.exterior, href: urlFor(lang, "cat.exterior") }
      ]
    },
    {
      label: L.bolgeler,
      items: [
        { label: L.areas.fethiye, href: urlFor(lang,"area.fethiye") },
        { label: L.areas.calis,   href: urlFor(lang,"area.calis") },
        { label: L.areas.ovacik,  href: urlFor(lang,"area.ovacik") },
        { label: L.areas.gocek,   href: urlFor(lang,"area.gocek") }
      ]
    },
    { label: L.blog,       href: urlFor(lang, "blog") },
    { label: L.hakkimizda, href: urlFor(lang, "about") },
    { label: L.iletisim,   href: urlFor(lang, "contact") }
  ];
}

// ---- Render: Desktop ----
function normalize(href){
  try{
    const u = new URL(href, location.origin);
    let p = u.pathname.replace(/index\.html$/, "");
    if(!p.endsWith("/") && !p.match(/\.[a-zA-Z0-9]+$/)) p += "/";
    return p;
  }catch{ return href; }
}
function renderNav(){
  const lang = getLangFromPath();
  const L = window.NAV_I18N[lang];
  const model = navModel(lang, L);
  const ul = document.getElementById("nav-root");
  if(!ul) return;
  ul.innerHTML = "";
  const curPath = location.pathname;

  for(const item of model){
    if(item.items){
      const li = document.createElement("li");
      li.className = "menu-group";
      li.setAttribute("role","none");

      const btn = document.createElement("button");
      btn.className = "nav-link";
      btn.type = "button";
      btn.setAttribute("role","menuitem");
      btn.setAttribute("aria-haspopup","menu");
      btn.textContent = item.label;
      li.appendChild(btn);

      const dd = document.createElement("div");
      dd.className = "dropdown";
      const list = document.createElement("ul");

      for(const sub of item.items){
        const liSub = document.createElement("li");
        const a = document.createElement("a");
        a.href = sub.href;
        a.textContent = sub.label;
        if (normalize(curPath) === normalize(a.href)) a.classList.add("active");
        liSub.appendChild(a);
        list.appendChild(liSub);
      }
      dd.appendChild(list);
      li.appendChild(dd);
      ul.appendChild(li);
    }else{
      const li = document.createElement("li");
      li.setAttribute("role","none");
      const a = document.createElement("a");
      a.className = "nav-link";
      a.href = item.href;
      a.setAttribute("role","menuitem");
      a.textContent = item.label;
      if (normalize(curPath) === normalize(a.href)) a.classList.add("nav-link-active");
      li.appendChild(a);
      ul.appendChild(li);
    }
  }
}

// ---- Render: Mobile ----
function renderMobileNav(){
  const lang = getLangFromPath();
  const L = window.NAV_I18N[lang];
  const model = navModel(lang, L);
  const root = document.getElementById("mobile-nav-root");
  if(!root) return;

  root.innerHTML = "";
  for(const item of model){
    if(item.items){
      const details = document.createElement("details");
      details.className = "mobile-details";

      const summary = document.createElement("summary");
      summary.className = "mobile-summary";
      summary.innerHTML = `<span>${item.label}</span><svg width="16" height="16" viewBox="0 0 24 24" class="chev"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>`;
      details.appendChild(summary);

      const list = document.createElement("ul");
      list.className = "mobile-list";

      for(const sub of item.items){
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "mobile-link";
        a.href = sub.href;
        a.textContent = sub.label;
        a.addEventListener("click", closeMobile);
        li.appendChild(a);
        list.appendChild(li);
      }
      details.appendChild(list);
      root.appendChild(details);
    }else{
      const a = document.createElement("a");
      a.className = "mobile-link";
      a.href = item.href;
      a.textContent = item.label;
      a.addEventListener("click", closeMobile);
      root.appendChild(a);
    }
  }
}

// ---- Hover gecikmesi (desktop) ----
const HOVER_CLOSE_DELAY = 220;
function wireDesktopDropdowns(){
  const isDesktop = window.matchMedia("(min-width:1024px)").matches;
  document.querySelectorAll(".menu-group").forEach(group => {
    if(group.dataset.wired === "1") return;
    group.dataset.wired = "1";

    const dropdown = group.querySelector(".dropdown");
    let closeTimer = null;
    const open = () => { clearTimeout(closeTimer); group.classList.add("open"); };
    const scheduleClose = () => { clearTimeout(closeTimer); closeTimer = setTimeout(() => group.classList.remove("open"), HOVER_CLOSE_DELAY); };

    if(isDesktop){
      group.addEventListener("mouseenter", open);
      group.addEventListener("mouseleave", scheduleClose);
      if (dropdown){
        dropdown.addEventListener("mouseenter", open);
        dropdown.addEventListener("mouseleave", scheduleClose);
      }
      group.addEventListener("focusin", open);
      group.addEventListener("focusout", scheduleClose);
    }
  });
}

// ---- Mobile panel ----
let releaseFocus = null;
function trapFocus(el){
  const SEL = 'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
  const nodes = el.querySelectorAll(SEL);
  if(!nodes.length) return () => {};
  const first = nodes[0], last = nodes[nodes.length-1];
  const onKey = (e) => {
    if(e.key !== "Tab") return;
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  };
  el.addEventListener("keydown", onKey);
  return () => el.removeEventListener("keydown", onKey);
}

function openMobile(){
  const layer = ensureRootLayer();
  if(!layer) return;

  layer.hidden = false;
  setTimeout(() => layer.classList.add("open"), 10);

  lockBodyScroll();

  const burger = document.getElementById("burger");
  if (burger) burger.setAttribute("aria-expanded","true");

  const main = document.querySelector("main, .site-main");
  if(main){
    main.setAttribute("aria-hidden","true");
    try{ main.inert = true; }catch{}
  }

  const sheet = layer.querySelector(".mobile-sheet");
  if(sheet){
    sheet.setAttribute("tabindex","-1");
    sheet.focus();
    releaseFocus = trapFocus(sheet);
  }
}


function closeMobile(){
  const layer = document.getElementById("mobile-layer");
  if(!layer) return;

  layer.classList.remove("open");

  const burger = document.getElementById("burger");
  if (burger) burger.setAttribute("aria-expanded","false");

  const main = document.querySelector("main, .site-main");
  if(main){
    main.removeAttribute("aria-hidden");
    try{ main.inert = false; }catch{}
  }

  if(releaseFocus){ releaseFocus(); releaseFocus = null; }

  setTimeout(() => { layer.hidden = true; unlockBodyScroll(); }, 200);
}


// ---- Header scroll & logo ----
function handleScroll(){
  const scrolled = window.scrollY > 8;
  const hdr = document.getElementById("site-header");
  if(hdr) hdr.classList.toggle("scrolled", scrolled);
}
function setupLogoFallback(){
  const img = document.getElementById("brand-logo");
  const fb = document.getElementById("brand-fallback");
  if(!img || !fb) return;
  img.addEventListener("error", () => {
    img.classList.add("hidden");
    img.setAttribute("aria-hidden","true");
    fb.classList.add("show");
  });
}

// ---- Aktif dil işaretleme (kapsül) ----
function markActiveLang(){
  const cur = getLangFromPath();
  document.querySelectorAll("[data-lang]").forEach(el => {
    const code = (el.getAttribute('data-lang') || '').toLowerCase();
    const on = code === cur;
    el.classList.toggle("active-lang", on);
    el.classList.toggle("active", on);
    el.setAttribute("aria-current", on ? "true" : "false");
    el.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

// ---- Boot ----
document.addEventListener("DOMContentLoaded", () => {
  const lang = getLangFromPath();
  setHtmlLang(lang);

  renderNav();
  renderMobileNav();
  wireDesktopDropdowns();
  setupLogoFallback();
  handleScroll();
  markActiveLang();

  const burger = document.getElementById("burger");
  if (burger) burger.addEventListener("click", () => {
    burger.getAttribute("aria-expanded") === "true" ? closeMobile() : openMobile();
  });
  const closeBtn = document.getElementById("burger-close");
  if (closeBtn) closeBtn.addEventListener("click", closeMobile);
  const dim = document.getElementById("mobile-dim");
  if (dim) dim.addEventListener("click", closeMobile);
  document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeMobile(); });

  document.body.addEventListener("click", (e) => {
    const t = e.target && e.target.closest("[data-lang]");
    if(!t) return;
    e.preventDefault();
    const code = (t.getAttribute("data-lang") || "").toLowerCase();
    if(!SUPPORTED.includes(code)) return;
    location.assign(translateCurrentUrl(code));
  });

  window.addEventListener("scroll", handleScroll, { passive:true });
  window.addEventListener("resize", wireDesktopDropdowns);
});
let __scrollY = 0;

function ensureRootLayer() {
  const layer = document.getElementById("mobile-layer");
  if (!layer) return null;

  // Header içindeyse body’ye taşı ki fixed doğru çalışsın
  if (layer.parentElement !== document.body) {
    document.body.appendChild(layer);
  }
  // Mutlak güvenli sabitleme
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.zIndex = "1200";
  return layer;
}

function lockBodyScroll() {
  __scrollY = window.scrollY || document.documentElement.scrollTop || 0;
  document.body.classList.add("menu-open");
  // iOS için body'yi fixed yapıp mevcut scroll'u koru
  document.body.style.position = "fixed";
  document.body.style.top = `-${__scrollY}px`;
  document.body.style.width = "100%";
}

function unlockBodyScroll() {
  document.body.classList.remove("menu-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, __scrollY || 0);
}
// ==============================
// FOOTER — Header'a bağlı i18n URL kurulum
// (getLangFromPath, buildUrl ve window.NAV_SLUGS zaten global)  file:layout.js
// ==============================
(function(){
  // data-i18n → NAV_SLUGS key eşlemesi
  const I18N_TO_SLUGKEY = {
    // HİZMETLER
    "footer.cols.services.items.infra":    "cat.infra",
    "footer.cols.services.items.surfaces": "cat.surfaces",
    "footer.cols.services.items.interior": "cat.interior",
    "footer.cols.services.items.exterior": "cat.exterior",
    // BÖLGELER
    "footer.cols.areas.items.fethiye": "area.fethiye",
    "footer.cols.areas.items.calis":   "area.calis",
    "footer.cols.areas.items.ovacik":  "area.ovacik",
    "footer.cols.areas.items.gocek":   "area.gocek",
    // KURUMSAL
    "footer.cols.corp.items.main-page": "home",
    "footer.cols.corp.items.blog":      "blog",
    "footer.cols.corp.items.about":     "about",
    "footer.cols.corp.items.contact":   "contact"
    // POLİTİKALAR: HTML'de zaten doğru href'ler var, bu yüzden mapping'e gerek yok
    // Policy linkleri wireFooterLinks() içinde .footer__policies kontrolü ile atlanıyor
  };

  function hrefFor(slugKey){
    const lang = (typeof getLangFromPath === 'function') ? getLangFromPath() : 'tr';
    const map  = (window.NAV_SLUGS && window.NAV_SLUGS[lang]) || {};
    const rest = map[slugKey] || "";
    if (typeof buildUrl === 'function') return buildUrl(lang, rest);
    const base = (lang === 'tr') ? '/' : `/${lang}/`;
    return base + (rest || '');
  }

  function resolveI18nKey(a){
    // <a data-i18n> olabilir veya içinde <span data-i18n> olabilir (mevcut HTML yapın böyle).
    const own = a.getAttribute("data-i18n");
    if (own) return own;
    const inner = a.querySelector("[data-i18n]");
    return inner ? inner.getAttribute("data-i18n") : null;
  }

  function wireFooterLinks(){
    const root = document.getElementById("footer");
    if(!root) return;

    // Marka linkini dil köküne bağla
    const brand = root.querySelector(".footer__brand");
    if (brand) brand.href = hrefFor("home");

    // Tel/Mail/WhatsApp harici tüm linkleri i18n anahtarından üret
    // ANCAK: Policy linkleri (KVKK, Gizlilik, Terms) zaten HTML'de doğru href'lere sahip,
    // bu yüzden onları atla
    root.querySelectorAll("a[href]").forEach(a => {
      const href = a.getAttribute("href") || "";
      // Tel/Mail/WhatsApp ve policy linklerini atla
      if (/^(tel:|mailto:|https?:\/\/wa\.me)/i.test(href)) return;
      // Policy linklerini atla (zaten doğru href'leri var)
      if (a.closest(".footer__policies")) return;

      const i18nKey = resolveI18nKey(a);
      const slugKey = i18nKey && I18N_TO_SLUGKEY[i18nKey];
      if (slugKey) a.setAttribute("href", hrefFor(slugKey));
    });
  }

  function setFooterYear(){
    const y = document.getElementById("footer-year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  // ---- FOOTER I18N ÇEVİRİLERİNİ UYGULA ----
  function applyFooterI18n() {
    const lang = (typeof getLangFromPath === 'function') ? getLangFromPath() : 'tr';
    
    // Debug için
    console.log('Footer i18n: Current lang =', lang);
    console.log('Footer i18n: window.I18N =', window.I18N);
    
    const i18nData = window.I18N && window.I18N[lang];
    if (!i18nData) {
      console.warn('Footer i18n: No I18N data for lang', lang);
      return;
    }
    if (!i18nData.footer) {
      console.warn('Footer i18n: No footer data in I18N for lang', lang);
      return;
    }
    
    const footer = document.getElementById("footer");
    if (!footer) {
      console.warn('Footer i18n: Footer element not found');
      return;
    }
    
    // Nested value getter helper
    function getValue(obj, path) {
      return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);
    }
    
    let appliedCount = 0;
    
    // data-i18n (textContent)
    footer.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const value = getValue(i18nData, key);
      if (value && typeof value === 'string') {
        el.textContent = value;
        appliedCount++;
      } else {
        console.warn('Footer i18n: No value for key', key);
      }
    });
    
    // data-i18n-html (innerHTML)
    footer.querySelectorAll("[data-i18n-html]").forEach(el => {
      const key = el.getAttribute("data-i18n-html");
      if (!key) return;
      const value = getValue(i18nData, key);
      if (value && typeof value === 'string') {
        el.innerHTML = value;
        appliedCount++;
      } else {
        console.warn('Footer i18n: No value for HTML key', key);
      }
    });
    
    // data-i18n-attr (format: "attrName:key")
    footer.querySelectorAll("[data-i18n-attr]").forEach(el => {
      const spec = el.getAttribute("data-i18n-attr");
      if (!spec || !spec.includes(':')) return;
      const [attrName, key] = spec.split(':').map(s => s.trim());
      const value = getValue(i18nData, key);
      if (value && typeof value === 'string' && attrName) {
        el.setAttribute(attrName, value);
        appliedCount++;
      }
    });
    
    console.log('Footer i18n: Applied', appliedCount, 'translations for language', lang);
  }

  // I18N yüklendikten sonra çalıştır
  function initFooterI18n() {
    function tryApply() {
      if (window.I18N && document.getElementById("footer")) {
        applyFooterI18n();
      }
    }

    // window.load'da kesinlikle çalıştır (tüm defer script'ler yüklendiğinde)
    window.addEventListener('load', tryApply);
    
    // DOMContentLoaded'da da dene (eğer I18N zaten yüklenmişse)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        // Hemen dene
        tryApply();
        // Eğer hazır değilse 200ms sonra tekrar dene
        setTimeout(tryApply, 200);
        setTimeout(tryApply, 500);
      });
    } else {
      // Zaten yüklendi
      setTimeout(tryApply, 100);
      setTimeout(tryApply, 300);
    }
  }

  // Mevcut DOMContentLoaded boot'unun yanına iliştir.  file:layout.js
  document.addEventListener("DOMContentLoaded", () => {
    wireFooterLinks();
    setFooterYear();
  });
  
  // Footer i18n'i başlat
  initFooterI18n();
})();
