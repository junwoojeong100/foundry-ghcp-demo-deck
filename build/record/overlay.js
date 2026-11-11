/* Recording overlay for the English Foundry clips: numbered caption pill (bottom-left), virtual cursor,
 * click ripple and an optional spotlight ring. Injected with context.addInitScript() into every page,
 * so it survives navigations (the caption is restored from sessionStorage).
 * The pill style follows the Korean clips (dark rounded pill with a coloured number badge).
 */
(() => {
  if (window.__rec) return;
  const css = `
  #__cap { position: fixed; left: 20px; bottom: 20px; z-index: 2147483000; display: none; align-items: center; gap: 10px;
    padding: 7px 20px 7px 8px; border-radius: 999px; background: rgba(12,16,30,.95); color: #fff; pointer-events: none;
    font: 700 16px/1.25 -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Arial, sans-serif; letter-spacing: .005em;
    box-shadow: 0 6px 18px rgba(0,0,0,.35); max-width: 1000px; }
  #__cap b { flex: none; min-width: 26px; height: 26px; padding: 0 3px; box-sizing: border-box; border-radius: 13px; display: grid; place-items: center;
    font: 800 14px/1 -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Arial, sans-serif; background: var(--c, #2F7CF6); color: #fff; }
  #__cur { position: fixed; left: 0; top: 0; width: 28px; height: 28px; z-index: 2147483600; pointer-events: none; transform: translate(-100px,-100px);
    filter: drop-shadow(0 3px 4px rgba(0,0,0,.35)); }
  .__rip { position: fixed; z-index: 2147483500; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%; border: 3px solid #2F7CF6;
    background: rgba(47,124,246,.25); pointer-events: none; animation: __rip .55s ease-out forwards; }
  @keyframes __rip { to { transform: scale(4.2); opacity: 0; } }
  .__spot { position: fixed; z-index: 2147483400; border: 3px solid #f59e0b; border-radius: 12px; pointer-events: none;
    box-shadow: 0 0 0 4px rgba(245,158,11,.25); animation: __spot 1.4s ease-in-out infinite; }
  @keyframes __spot { 50% { box-shadow: 0 0 0 9px rgba(245,158,11,.18); } }
  `;
  const mount = () => {
    if (document.getElementById('__cap')) return;
    const st = document.createElement('style'); st.textContent = css; document.documentElement.appendChild(st);
    const cap = Object.assign(document.createElement('div'), { id: '__cap' });
    cap.innerHTML = '<b></b><span></span>';
    const cur = Object.assign(document.createElement('div'), { id: '__cur' });
    cur.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24"><path d="M5 3l14 7-6 2-2 6z" fill="#fff" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    document.documentElement.append(cap, cur);
    const saved = sessionStorage.getItem('__cap');
    if (saved) { try { const s = JSON.parse(saved); window.__rec.caption(s.n, s.text, s.color); } catch (e) { /* ignore */ } }
    const m = sessionStorage.getItem('__mouse');
    if (m) { try { const p = JSON.parse(m); cur.style.transform = `translate(${p.x - 5}px,${p.y - 3}px)`; } catch (e) { /* ignore */ } }
  };
  const $ = (id) => document.getElementById(id);
  window.addEventListener('mousemove', (e) => {
    const c = $('__cur'); if (c) c.style.transform = `translate(${e.clientX - 5}px,${e.clientY - 3}px)`;
    try { sessionStorage.setItem('__mouse', JSON.stringify({ x: e.clientX, y: e.clientY })); } catch (err) { /* ignore */ }
  }, true);
  window.addEventListener('mousedown', (e) => {
    const r = document.createElement('div'); r.className = '__rip'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
    document.documentElement.appendChild(r); setTimeout(() => r.remove(), 600);
  }, true);
  window.__rec = {
    caption(n, text, color) {
      const c = $('__cap'); if (!c) return;
      if (!text) { c.style.display = 'none'; sessionStorage.removeItem('__cap'); return; }
      c.querySelector('b').textContent = n; c.querySelector('b').style.setProperty('--c', color || '#2F7CF6');
      c.querySelector('span').textContent = text; c.style.display = 'flex';
      try { sessionStorage.setItem('__cap', JSON.stringify({ n, text, color })); } catch (e) { /* ignore */ }
    },
    spot(el, pad = 8) {
      this.unspot();
      if (!el) return false;
      const r = el.getBoundingClientRect(); const d = document.createElement('div'); d.className = '__spot';
      Object.assign(d.style, { left: r.left - pad + 'px', top: r.top - pad + 'px', width: r.width + 2 * pad + 'px', height: r.height + 2 * pad + 'px' });
      document.documentElement.appendChild(d); return true;
    },
    unspot() { document.querySelectorAll('.__spot').forEach((e) => e.remove()); },
  };
  // Privacy: blur any text that contains one of window.__REDACT (set from REDACT_TERMS by the recorder, never stored in the repo).
  const redact = () => {
    const terms = window.__REDACT || [];
    if (!terms.length || !document.body) return;
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode, p = n.parentElement;
      if (p && !p.dataset.__red && terms.some((t) => n.nodeValue.toLowerCase().includes(t.toLowerCase()))) { p.dataset.__red = '1'; p.style.filter = 'blur(7px)'; }
    }
  };
  new MutationObserver(redact).observe(document, { childList: true, subtree: true, characterData: true });
  setInterval(redact, 400);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  new MutationObserver(() => { if (!document.getElementById('__cap') && document.documentElement) mount(); }).observe(document, { childList: true, subtree: false });
})();
