// pptxgenjs 출력 보정: (0) 그림 대체 텍스트(descr)가 로컬 경로 또는 "preencoded.png" 이면 비움(경로 노출 방지·장식 아이콘), (1) 멀티 런 문단의 중복 <a:pPr> 제거(문단당 첫 pPr만 유지), (2) presentation.xml의 notesMasterIdLst 위치, (3) 슬라이드 안에서 겹치는 도형 id(영상 "Media 0"과 첫 텍스트가 모두 id=3) 재부여, (4) 슬라이드 마스터와 노트 마스터가 같은 theme 파트를 공유하면 PowerPoint for the web 이 파일을 열지 못하므로 노트 마스터에 theme 복사본을 따로 부여, (5) [Content_Types].xml 의 존재하지 않는 파트 Override 제거, (6) 패키지를 [Content_Types].xml → _rels/.rels 순서·폴더 엔트리 없이 다시 묶음. 영상/이미지는 재압축하지 않고 STORE.
const fs = require("fs");
const JSZip = require("jszip");

(async () => {
  const file = process.argv[2];
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  let removed = 0, renumbered = 0, scrubbed = 0, themeSplit = 0, dangling = 0;
  for (const name of Object.keys(zip.files)) {
    if (/^ppt\/(slides|notesSlides)\/[^/]+\.xml$/.test(name)) {
      let xml = await zip.file(name).async("string");
      xml = xml.replace(/<a:p>([\s\S]*?)<\/a:p>/g, (m, inner) => {
        let seen = 0;
        const fixed = inner.replace(/<a:pPr\b[^>]*?(?:\/>|>[\s\S]*?<\/a:pPr>)/g, (pm) => (seen++ === 0 ? pm : (removed++, "")));
        return "<a:p>" + fixed + "</a:p>";
      });
      if (/^ppt\/slides\//.test(name)) {
        xml = xml.replace(/ descr="([^"]*)"/g, (m, d) => (/^(?:\/|[A-Za-z]:[\\/])|^preencoded\.png$/.test(d) ? (scrubbed++, ' descr=""') : m));
        const ids = [...xml.matchAll(/<p:cNvPr id="(\d+)"/g)].map((m) => +m[1]);
        let next = Math.max(0, ...ids) + 1;
        const seenIds = new Set();
        xml = xml.replace(/<p:cNvPr id="(\d+)"/g, (m, id) => {
          if (!seenIds.has(id)) { seenIds.add(id); return m; }
          renumbered++;
          return `<p:cNvPr id="${next++}"`;
        });
      }
      zip.file(name, xml);
    } else if (name === "ppt/presentation.xml") {
      // 스키마 순서: sldMasterIdLst → notesMasterIdLst → sldIdLst (pptxgenjs는 notesMasterIdLst를 sldIdLst 뒤에 출력)
      let xml = await zip.file(name).async("string");
      const m = xml.match(/<p:notesMasterIdLst>[\s\S]*?<\/p:notesMasterIdLst>/);
      if (m) {
        xml = xml.replace(m[0], "").replace("</p:sldMasterIdLst>", "</p:sldMasterIdLst>" + m[0]);
        zip.file(name, xml);
      }
    } else if (/^ppt\/media\/.+\.(mp4|png|jpe?g)$/i.test(name)) {
      zip.file(name, await zip.file(name).async("nodebuffer"), { compression: "STORE" });
    }
  }

  // (4) 노트 마스터 전용 theme
  const themeOf = async (rels) => {
    const f = zip.file(rels);
    const m = f && (await f.async("string")).match(/Target="\.\.\/theme\/(theme\d+\.xml)"/);
    return m ? m[1] : null;
  };
  let ct = await zip.file("[Content_Types].xml").async("string");
  const nmRels = "ppt/notesMasters/_rels/notesMaster1.xml.rels";
  const nmTheme = await themeOf(nmRels);
  if (nmTheme && nmTheme === (await themeOf("ppt/slideMasters/_rels/slideMaster1.xml.rels"))) {
    let k = 2;
    while (zip.file(`ppt/theme/theme${k}.xml`)) k++;
    const copy = `theme${k}.xml`;
    zip.file(`ppt/theme/${copy}`, await zip.file(`ppt/theme/${nmTheme}`).async("nodebuffer"));
    zip.file(nmRels, (await zip.file(nmRels).async("string")).replace(`../theme/${nmTheme}`, `../theme/${copy}`));
    const ov = ct.match(new RegExp(`<Override [^>]*PartName="/ppt/theme/${nmTheme}"[^>]*/>`));
    if (ov) ct = ct.replace(ov[0], ov[0] + ov[0].replace(nmTheme, copy));
    themeSplit++;
  }
  // (5) 존재하지 않는 파트를 가리키는 Override 제거 (pptxgenjs 는 슬라이드 수만큼 slideMaster Override 를 남김)
  ct = ct.replace(/<Override [^>]*\/>/g, (o) => {
    const part = (o.match(/PartName="\/?([^"]+)"/) || [])[1];
    return part && !zip.file(part) ? (dangling++, "") : o;
  });
  zip.file("[Content_Types].xml", ct);

  // (6) 정리된 순서로 다시 묶기
  const out = new JSZip();
  const first = ["[Content_Types].xml", "_rels/.rels"];
  const names = Object.keys(zip.files).filter((n) => !zip.files[n].dir);
  for (const n of [...first, ...names.filter((n) => !first.includes(n))]) {
    out.file(n, await zip.file(n).async("nodebuffer"), { createFolders: false, compression: /\.(mp4|png|jpe?g)$/i.test(n) ? "STORE" : "DEFLATE", compressionOptions: { level: 6 } });
  }
  const buf = await out.generateAsync({ type: "nodebuffer", platform: "UNIX" });
  fs.writeFileSync(file, buf);
  console.log("fix_pptx: removed duplicate pPr =", removed, "| renumbered duplicate shape ids =", renumbered, "| scrubbed alt-text paths =", scrubbed, "| notes-master theme split =", themeSplit, "| dangling overrides removed =", dangling);
})();
