#!/bin/bash
# English edition preview: build -> fix_pptx -> LibreOffice -> PDF -> PNG (layout QA).
# Usage (from anywhere): nice -n 10 build/en/render.sh
# Env:   OUT=out/en        output folder, relative to build/
#        DPI=110           PNG resolution
#        PREVIEW=1         poster images instead of videos: a small file and a much faster conversion (layout checks only)
# Aptos comes from the PowerPoint app bundle and is copied into a git-ignored LibreOffice profile, as ../render.sh does for the Korean font.
# Without it LibreOffice would substitute another font and the preview would say nothing about PowerPoint.
# LibreOffice draws the poster image instead of the video.
set -e
export PATH=/usr/local/bin:/opt/homebrew/bin:$PATH
cd "$(dirname "$0")/.."
OUT="${OUT:-out/en}"
mkdir -p "$OUT"
DEMO_LANG=en node en/build.js "$OUT/deck_en.pptx" > "$OUT/build.log" 2>&1 || { cat "$OUT/build.log"; exit 1; }
DEMO_LANG=en node fix_pptx.js "$OUT/deck_en.pptx"
PROFILE="$PWD/lo_profile"
FONTS="$PROFILE/user/fonts"
mkdir -p "$FONTS"
D="/Applications/Microsoft PowerPoint.app/Contents/Resources/DFonts"
for f in Aptos.ttf Aptos-Bold.ttf Aptos-Italic.ttf Aptos-Bold-Italic.ttf; do cp -n "$D/$f" "$FONTS/" 2>/dev/null || true; done
URI="$(python3 -c 'import sys,pathlib; print(pathlib.Path(sys.argv[1]).resolve().as_uri())' "$PROFILE")"
rm -f "$OUT/deck_en.pdf" "$OUT"/slide-*.png
SAL_USE_VCLPLUGIN=svp soffice "-env:UserInstallation=$URI" --headless --convert-to pdf --outdir "$OUT" "$OUT/deck_en.pptx" > /dev/null 2>&1
pdftoppm -png -r "${DPI:-110}" "$OUT/deck_en.pdf" "$OUT/slide"
echo "fonts used in the PDF:"; pdffonts "$OUT/deck_en.pdf" 2>/dev/null | awk 'NR>2 {print "  " $1}' | sed 's/^  [A-Z]*+/  /' | sort -u
ls "$OUT" | head -40
