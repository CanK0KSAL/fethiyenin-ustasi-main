#!/usr/bin/env bash
set -euo pipefail
# FU-6003 — TR karakterli dosya adlarını RAPORLA (rename YAPMAZ)
# Arama kökleri: assets/css ve assets/js
# ÇIKTI:
#  - STDOUT: tablo
#  - tools/nonascii-mapping.txt : orijinal_yol|ascii_aday_yol

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CSS_ROOT="$ROOT/assets/css"
JS_ROOT="$ROOT/assets/js"
OUT="$ROOT/tools/nonascii-mapping.txt"

normalize_ascii() {
  # Türkçe karakterleri ASCII karşılıklarına indirger
  local s="$1"
  s="${s//İ/I}"; s="${s//İ/I}"        # olası birleşik nokta varyantı
  s="${s//ı/i}"
  s="${s//Ğ/G}"; s="${s//ğ/g}"
  s="${s//Ş/S}"; s="${s//ş/s}"
  s="${s//Ç/C}"; s="${s//ç/c}"
  s="${s//Ö/O}"; s="${s//ö/o}"
  s="${s//Ü/U}"; s="${s//ü/u}"
  printf '%s' "$s"
}

echo "# nonascii mapping (original_path|ascii_candidate_path)" > "$OUT"

scan_dir () {
  local dir="$1"
  [ -d "$dir" ] || return 0
  find "$dir" -type f \( -name "*.css" -o -name "*.js" \) -print0 | while IFS= read -r -d '' f; do
    base="$(basename "$f")"
    ascii="$(normalize_ascii "$base")"
    if [[ "$base" != "$ascii" ]]; then
      # sadece DOSYA ADINI normalize ediyoruz; klasör yapısı aynen kalır
      dirn="$(dirname "$f")"
      cand="$dirn/$ascii"
      printf '%s|%s\n' "$f" "$cand" | tee -a "$OUT"
    fi
  done
}

scan_dir "$CSS_ROOT"
scan_dir "$JS_ROOT"

echo
echo "== Özet =="
echo "Harita dosyası: tools/nonascii-mapping.txt"
echo "Bu dosyayı patch-html-refs.sh ile kullanın (rename YAPMAYIN)."
