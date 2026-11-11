// OCR helper for the English-edition QA (macOS Vision). Prints one JSON object per image: {"file":..., "lines":[...], "hangul":[...]}.
//   swiftc -O ocr_hangul.swift -o /tmp/ocr_hangul && /tmp/ocr_hangul frame1.png frame2.png ...
// Recognition languages are Korean + English, so Hangul that appears on screen is recognised as Hangul and reported in "hangul".
import Foundation
import Vision
import AppKit

// Number of Hangul characters in a line. A single stray Hangul-looking glyph is usually an icon misread by OCR,
// so only lines with two or more count as real Korean text ("hangul"); single ones are listed as "weak".
func hangulCount(_ s: String) -> Int {
    var n = 0
    for u in s.unicodeScalars {
        let v = u.value
        if (0xAC00...0xD7A3).contains(v) || (0x1100...0x11FF).contains(v) || (0x3130...0x318F).contains(v) { n += 1 }
    }
    return n
}

for path in CommandLine.arguments.dropFirst() {
    guard let img = NSImage(contentsOfFile: path), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        print("{\"file\":\"\(path)\",\"error\":\"cannot read\"}")
        continue
    }
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.usesLanguageCorrection = false
    req.recognitionLanguages = ["ko-KR", "en-US"]
    req.minimumTextHeight = 0.006
    let handler = VNImageRequestHandler(cgImage: cg, options: [:])
    do { try handler.perform([req]) } catch {
        print("{\"file\":\"\(path)\",\"error\":\"\(error)\"}")
        continue
    }
    var lines: [String] = []
    for o in (req.results ?? []) {
        if let c = o.topCandidates(1).first { lines.append(c.string) }
    }
    let hangul = lines.filter { hangulCount($0) >= 2 }
    let weak = lines.filter { hangulCount($0) == 1 }
    let obj: [String: Any] = ["file": path, "lines": lines, "hangul": hangul, "weak": weak]
    if let data = try? JSONSerialization.data(withJSONObject: obj), let s = String(data: data, encoding: .utf8) { print(s) }
}
