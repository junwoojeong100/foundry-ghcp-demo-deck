#!/bin/bash
# 빌드 → PDF → PNG (QA용). Malgun Gothic은 PowerPoint 번들 글꼴을 LibreOffice 프로필에 넣어 실제 PowerPoint와 같은 글꼴로 렌더한다.
# 사용: ./render.sh   |  OUT=out2 ./render.sh   (LibreOffice 렌더에는 영상 대신 포스터 이미지가 보인다)
set -e
export PATH=/usr/local/bin:/opt/homebrew/bin:$PATH
cd "$(dirname "$0")"
OUT="${OUT:-out}"
mkdir -p "$OUT"
node build.js "$OUT/deck.pptx" && node fix_pptx.js "$OUT/deck.pptx"
PROFILE="$PWD/lo_profile"
FONTS="$PROFILE/user/fonts"
mkdir -p "$FONTS"
D="/Applications/Microsoft PowerPoint.app/Contents/Resources/DFonts"
cp -n "$D/malgun.ttf" "$D/malgunbd.ttf" "$FONTS/" 2>/dev/null || true
URI="$(python3 -c 'import sys,pathlib; print(pathlib.Path(sys.argv[1]).resolve().as_uri())' "$PROFILE")"
rm -f "$OUT/deck.pdf" "$OUT"/slide-*.png
SAL_USE_VCLPLUGIN=svp soffice "-env:UserInstallation=$URI" --headless --convert-to pdf --outdir "$OUT" "$OUT/deck.pptx" >/dev/null 2>&1
pdftoppm -png -r ${DPI:-110} "$OUT/deck.pdf" "$OUT/slide"
ls "$OUT" | head -40
