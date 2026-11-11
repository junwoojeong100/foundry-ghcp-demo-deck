// Number and time formatting shared by the English edition.

// 161.8 -> "2:42"
function mmss(sec) {
  const t = Math.round(sec);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

// 161.8 -> "2 min 42 s", 300 -> "5 min", 45 -> "45 s"
function minSec(sec) {
  const t = Math.round(sec);
  const m = Math.floor(t / 60), s = t % 60;
  if (!m) return `${s} s`;
  return s ? `${m} min ${s} s` : `${m} min`;
}

// 1280 -> "1,280"
const thousands = (n) => Math.round(n).toLocaleString("en-US");

module.exports = { mmss, minSec, thousands };
