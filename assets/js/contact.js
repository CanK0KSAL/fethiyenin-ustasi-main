/* ==========================================================================
   contact.js — İletişim formu (multipart + dosya yükleme)
   Kullanım: <script src="/js/contact.js?v=YYYY.MM.DD" defer></script>
   3rd-party yok. Header’a dokunmaz. Sadece <main> kapsamı.
   ========================================================================== */
(function () {
  "use strict";

  const MAIN = document.querySelector("#main-content");
  if (!MAIN) return;

  const form = MAIN.querySelector("#fu-contact-form");
  if (!form) return;

  // ---- Helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const setText = (el, text) => { if (el) el.textContent = text || ""; };
  const clean = (s) => (s || "").toString().replace(/\s+/g, " ").trim();
  const formatBytes = (n) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  };

  const fields = {
    name: $("#c-name", form),
    phone: $("#c-phone", form),
    email: $("#c-email", form),
    area: $("#c-area", form),
    service: $("#c-service", form),
    message: $("#c-message", form),
    consent: $("#c-consent", form),
    website: $("#c-website", form), // honeypot
    files: $("#c-files", form)
  };
  const errors = {
    name: $("#err-name", form),
    phone: $("#err-phone", form),
    email: $("#err-email", form),
    area: $("#err-area", form),
    service: $("#err-service", form),
    message: $("#err-message", form),
    consent: $("#err-consent", form),
    files: $("#files-err", form)
  };
  const statusEl = $("#form-status", form);
  const btnSubmit = $("#c-submit", form);
  const fileListEl = $("#c-files-list", form);

  // ---- Constants
  const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const rePhone = /^[0-9 +()\-]{10,20}$/;
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_TOTAL_SIZE = 12 * 1024 * 1024; // 12MB
  const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "avif", "pdf"];
  const ALLOWED_MIME = [
    "image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"
  ];

  // ---- File state
  /** @type {File[]} */
  let selectedFiles = [];

  function fileExt(name) {
    const m = (name || "").toLowerCase().match(/\.([a-z0-9]+)$/);
    return m ? m[1] : "";
  }
  function isAllowedType(file) {
    const ext = fileExt(file.name);
    if (!ALLOWED_EXT.includes(ext)) return false;
    // Some browsers may not set file.type for AVIF; accept empty if extension ok
    return !file.type || ALLOWED_MIME.includes(file.type) || ext === "avif";
  }
  function filesTotalSize(files) {
    return files.reduce((a, f) => a + (f?.size || 0), 0);
  }
  function findDupIndex(f) {
    return selectedFiles.findIndex(
      (x) => x.name === f.name && x.size === f.size && x.lastModified === f.lastModified
    );
  }

  function renderFileList() {
    fileListEl.innerHTML = "";
    if (!selectedFiles.length) return;

    selectedFiles.forEach((f, i) => {
      const li = document.createElement("li");
      li.className = "file-item";
      li.setAttribute("data-idx", String(i));

      const thumbWrap = document.createElement("div");
      thumbWrap.className = "file-thumb";

      // Thumbnail (images) or icon (pdf)
      if ((f.type && f.type.startsWith("image/")) || ["jpg","jpeg","png","webp","avif"].includes(fileExt(f.name))) {
        const img = document.createElement("img");
        img.alt = f.name;
        img.width = 64; img.height = 64;
        img.decoding = "async"; img.loading = "lazy";
        img.src = URL.createObjectURL(f);
        img.addEventListener("load", () => URL.revokeObjectURL(img.src), { once: true });
        thumbWrap.appendChild(img);
      } else {
        const span = document.createElement("span");
        span.className = "file-icon";
        span.textContent = "📄";
        thumbWrap.appendChild(span);
      }

      const meta = document.createElement("div");
      meta.className = "file-meta";
      meta.innerHTML = `<strong class="file-name">${f.name}</strong>
                        <small class="file-size">${formatBytes(f.size)}</small>`;

      const rm = document.createElement("button");
      rm.type = "button";
      rm.className = "file-remove";
      rm.setAttribute("aria-label", `${f.name} dosyasını kaldır`);
      rm.textContent = "Kaldır";
      rm.addEventListener("click", () => {
        selectedFiles.splice(i, 1);
        renderFileList();
        validate(); // yeniden değerlendir
      });

      li.appendChild(thumbWrap);
      li.appendChild(meta);
      li.appendChild(rm);
      fileListEl.appendChild(li);
    });
  }

  function handleFilesAdded(fileList) {
    let msg = [];
    for (const f of fileList) {
      if (selectedFiles.length >= MAX_FILES) {
        msg.push(`En fazla ${MAX_FILES} dosya eklenebilir.`);
        break;
      }
      if (!isAllowedType(f)) {
        msg.push(`${f.name}: izin verilmeyen tür.`);
        continue;
      }
      if (f.size > MAX_FILE_SIZE) {
        msg.push(`${f.name}: tek dosya limiti ${formatBytes(MAX_FILE_SIZE)}.`);
        continue;
      }
      if (findDupIndex(f) !== -1) {
        msg.push(`${f.name}: zaten eklendi.`);
        continue;
      }
      const nextTotal = filesTotalSize(selectedFiles) + f.size;
      if (nextTotal > MAX_TOTAL_SIZE) {
        msg.push(`${f.name}: toplam dosya limiti ${formatBytes(MAX_TOTAL_SIZE)} aşılıyor.`);
        continue;
      }
      selectedFiles.push(f);
    }
    renderFileList();
    setText(errors.files, msg.join(" "));
    validate(); // form genel geçerliliği tekrar değerlendir
  }

  // Input change → dosyaları karşı duruma kopyala (input'u sıfırla; tekrar aynı dosyayı seçebilsin)
  fields.files?.addEventListener("change", (e) => {
    const fl = e.target.files;
    if (fl && fl.length) handleFilesAdded(fl);
    e.target.value = ""; // reset
  });

  // Drag&drop (isteğe bağlı)
  if (fields.files) {
    const dropZone = fields.files.closest(".form-group");
    ["dragover","dragenter"].forEach(ev =>
      dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.classList.add("is-drag"); })
    );
    ["dragleave","drop"].forEach(ev =>
      dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.classList.remove("is-drag"); })
    );
    dropZone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length) handleFilesAdded(dt.files);
    });
  }

  // ---- Field validation
  function hasURL(s) { return /(https?:\/\/|www\.)/i.test(s || ""); }

  function validate() {
    let ok = true;

    // Name
    const name = clean(fields.name.value);
    if (name.length < 2) { setText(errors.name, "Lütfen ad soyad girin (min 2)."); ok = false; }
    else setText(errors.name, "");

    // Phone
    const phone = clean(fields.phone.value);
    if (!rePhone.test(phone)) { setText(errors.phone, "Lütfen geçerli bir telefon girin (min 10 karakter)."); ok = false; }
    else setText(errors.phone, "");

    // Email
    const email = clean(fields.email.value);
    if (!reEmail.test(email)) { setText(errors.email, "Geçerli bir e-posta girin."); ok = false; }
    else setText(errors.email, "");

    // Area
    if (!fields.area.value) { setText(errors.area, "Bölge seçin."); ok = false; }
    else setText(errors.area, "");

    // Service
    if (!fields.service.value) { setText(errors.service, "Hizmet seçin."); ok = false; }
    else setText(errors.service, "");

    // Message
    const msg = clean(fields.message.value);
    if (msg.length < 15) { setText(errors.message, "Mesaj en az 15 karakter olmalı."); ok = false; }
    else if (hasURL(msg)) { setText(errors.message, "Lütfen mesajda bağlantı paylaşmayın."); ok = false; }
    else setText(errors.message, "");

    // Consent
    if (!fields.consent.checked) { setText(errors.consent, "Devam etmek için onay kutusunu işaretleyin."); ok = false; }
    else setText(errors.consent, "");

    // Honeypot
    if (fields.website.value) { ok = false; setText(statusEl, "Gönderim engellendi (şüpheli istek)."); }

    // Files (limits)
    let fErr = "";
    if (selectedFiles.length > MAX_FILES) fErr = `En fazla ${MAX_FILES} dosya eklenebilir.`;
    if (filesTotalSize(selectedFiles) > MAX_TOTAL_SIZE) fErr = `Toplam dosya limiti ${formatBytes(MAX_TOTAL_SIZE)} aşıldı.`;
    setText(errors.files, fErr);
    if (fErr) ok = false;

    btnSubmit.disabled = !ok;
    return ok;
  }

  // Debounced validation on input
  let t;
  form.addEventListener("input", () => { clearTimeout(t); t = setTimeout(validate, 150); });
  form.addEventListener("change", validate);
  validate();

  // Submit throttle (30s)
  function tooSoon() {
    const last = parseInt(localStorage.getItem("__fu_contact_last") || "0", 10);
    const now = Date.now();
    return now - last < 30000;
  }
  function markSent() { localStorage.setItem("__fu_contact_last", Date.now().toString()); }

  // Submit handler (multipart FormData)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) { setText(statusEl, "Lütfen formdaki hataları düzeltin."); return; }
    if (tooSoon()) { setText(statusEl, "Çok hızlı tekrar deneme. Lütfen birkaç saniye sonra tekrar deneyin."); return; }

    btnSubmit.disabled = true;
    setText(statusEl, "Gönderiliyor…");

    // Build FormData
    const fd = new FormData();
    fd.set("name", clean(fields.name.value));
    fd.set("phone", clean(fields.phone.value));
    fd.set("email", clean(fields.email.value));
    fd.set("area", fields.area.value);
    fd.set("service", fields.service.value);
    fd.set("message", clean(fields.message.value));
    fd.set("website", fields.website.value || ""); // honeypot
    fd.set("page", location.pathname);
    fd.set("tz", Intl.DateTimeFormat().resolvedOptions().timeZone || "");
    fd.set("t", new Date().toISOString());
    // Files
    selectedFiles.forEach((f) => fd.append("files[]", f, f.name));

    try {
      console.log("[contact] Sending to Formspree:", form.action);
      
      // Formspree için ek header (spam koruması için)
      fd.append("_subject", "Yeni İletişim Talebi — FethiyeninUstası");
      fd.append("_format", "plain");
      fd.append("_captcha", "false");
      
      const res = await fetch(form.action, { 
        method: "POST", 
        body: fd,
        headers: {
          "Accept": "application/json"
        }
      });
      
      console.log("[contact] Response status:", res.status, res.statusText);
      
      // Formspree başarılı gönderimde 200 döner
      if (res.ok) {
        const contentType = res.headers.get("content-type") || "";
        
        // Formspree JSON dönebilir veya HTML redirect yapabilir
        if (contentType.includes("application/json")) {
          const data = await res.json();
          console.log("[contact] Formspree response:", data);
          
          // Formspree başarılı yanıtları: { next: "..." } veya { ok: true } şeklinde
          if (data.next || data.ok || res.status === 200) {
            markSent();
            form.reset();
            selectedFiles = [];
            renderFileList();
            validate();
            setText(statusEl, "Teşekkürler! Talebiniz alındı, kısa süre içinde dönüş yapacağız.");
            btnSubmit.disabled = true;
            return;
          }
          
          // Hata varsa
          if (data.error) {
            throw new Error(data.error);
          }
        } else {
          // HTML redirect durumu - başarılı sayılır
          markSent();
          form.reset();
          selectedFiles = [];
          renderFileList();
          validate();
          setText(statusEl, "Teşekkürler! Talebiniz alındı, kısa süre içinde dönüş yapacağız.");
          btnSubmit.disabled = true;
          return;
        }
      }
      
      // Başarısız yanıt
      const errorText = await res.text();
      console.error("[contact] Formspree error:", errorText);
      throw new Error(`Form gönderilemedi (HTTP ${res.status})`);
    } catch (err) {
      // Fallback: mailto
      const mailto = (form.getAttribute("data-fallback-mailto") || "").trim();
      const errorMsg = err.message || "Bağlantı hatası";
      console.error("[contact] Submit failed:", err);
      console.error("[contact] Error details:", {
        message: err.message,
        stack: err.stack,
        action: form.action
      });
      
      setText(
        statusEl,
        mailto
          ? `Form gönderilemedi (${errorMsg}). Alternatif: ${mailto} adresine e-posta gönderebilirsiniz.`
          : `Form gönderilemedi (${errorMsg}). Lütfen daha sonra tekrar deneyin.`
      );
      btnSubmit.disabled = false;
    }
  });
})();
