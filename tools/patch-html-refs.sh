#!/usr/bin/env bash
set -euo pipefail
# FU-6003 — HTML referanslarını GERÇEK (TR karakterli) dosya adlarına çevir
# Kullanım:
#   tools/report-nonascii-filenames.sh
#   tools/patch-html-refs.sh
#
# Açıklama:
#   Eğer sayfalarda ascii-alternatif isimle (ipek-siva.css) link verilmişse
#   fakat dosyanın GERÇEK adı (ipek-sıva.css) ise, referansı düzeltir.
#
# NOT: Dosya/klasör adı değiştirilmez. Sadece HTML içindeki href/src güncellenir.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MAP="$ROOT/tools/nonascii-mapping.txt"

if [[ ! -f "$MAP" ]]; then
  echo "Harita bulunamadı: $MAP"
  echo "Önce: tools/report-nonascii-filenames.sh çalıştırın."
  exit 1
fi

# HTML kökleri
HTML_DIRS=( "$ROOT/tr" "$ROOT/en" "$ROOT/ru" )

# Her mapping satırı: original_path|ascii_candidate_path
# Bizim hedefimiz: ASCII aday referansı görürsek -> orijinal (TR) ada döndürmek
while IFS='|' read -r ORIG CAND; do
  [[ "$ORIG" =~ ^# ]] && continue
  [[ -z "$ORIG" || -z "$CAND" ]] && continue
  # İkisini de kök path'ten rölatifleştir
  RORIG="${ORIG#"$ROOT"}"
  RCAND="${CAND#"$ROOT"}"

  # HTML içinde RCAND geçen yerleri RORIG ile değiştir
  for d in "${HTML_DIRS[@]}"; do
    [ -d "$d" ] || continue
    # macOS ve GNU sed uyumlu inline replace
    find "$d" -type f -name "*.html" -print0 | while IFS= read -r -d '' h; do
      if grep -Iq . "$h"; then
        # yalnızca metin dosyalarda değiştir
        if grep -qF "$RCAND" "$h"; then
          # yedek oluşturma: .bak
          sed -e "s#${RCAND//\#/\\#}#${RORIG//\#/\\#}#g" "$h" > "$h.tmp" && mv "$h.tmp" "$h"
          cp "$h" "$h.bak"
          echo "[OK] $h : $RCAND  ->  $RORIG"
        fi
      fi
    done
  done

done < "$MAP"

echo "Tamamlandı. Değişiklikleri gözden geçirin ve test edin."
