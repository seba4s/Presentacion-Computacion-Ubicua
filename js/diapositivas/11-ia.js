/* ======================= 11 · Semana con anomalías ======================= */
(function week() {
  const { $, G, reduced, hooks } = Deck;
  const s = $("#s11");
  if (!s) return;
  const svg = $(".js-week", s), panel = $(".anom", s), btn = $(".js-detect", s), btnT = $(".js-detect-t", s);
  const NS = "http://www.w3.org/2000/svg";
  const el = (n, a, p = svg) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  const X0 = 40, X1 = 630, Y0 = 242, Y1 = 34;
  const x = (h) => X0 + (X1 - X0) * h / 168, y = (v) => Y0 - (Y0 - Y1) * v / 100;
  const g = (h, c, w) => Math.exp(-((h - c) * (h - c)) / w);
  const data = [];
  for (let d = 0; d < 7; d++) for (let h = 0; h < 24; h++) {
    let v = 2 + 52 * g(h, 7, 2.2) + 20 * g(h, 13, 3) + 66 * g(h, 20, 3.2) + 5 * (1 + Math.sin(h * 2.1 + d * 1.7)) + (d > 4 ? 10 * g(h, 11, 6) : 0);
    if (d === 2 && h <= 5) v += 26;
    if ((d === 4 && h >= 12) || (d === 5 && h < 12)) v = 0;
    data.push(Math.min(96, v));
  }
  const defs = el("defs", {});
  const lg = el("linearGradient", { id: "sigFill", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  el("stop", { offset: 0, "stop-color": "#2EDBFF", "stop-opacity": 0.3 }, lg);
  el("stop", { offset: 1, "stop-color": "#2EDBFF", "stop-opacity": 0 }, lg);
  const grid = el("g", { class: "grid" });
  [0, 50, 100].forEach((v) => { el("line", { x1: X0, x2: X1, y1: y(v), y2: y(v) }, grid); el("text", { x: X0 - 8, y: y(v) + 4, "text-anchor": "end" }).textContent = v; });
  el("text", { x: X0 - 8, y: Y1 - 12, "text-anchor": "end" }).textContent = "L/h";
  const days = el("g", { class: "days" });
  ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].forEach((n, d) => {
    if (d) el("line", { x1: x(d * 24), x2: x(d * 24), y1: Y1, y2: Y0 }, days);
    el("text", { x: x(d * 24 + 12), y: Y0 + 20, "text-anchor": "middle" }).textContent = n;
  });
  let d = `M${x(0)},${y(data[0]).toFixed(1)}`;
  data.forEach((v, i) => { if (i) d += ` L${x(i).toFixed(1)},${y(v).toFixed(1)}`; });
  el("path", { class: "warea", d: `${d} L${x(167)},${Y0} L${x(0)},${Y0} Z` });
  const line = el("path", { class: "wline", d });
  const flags = [
    { a: 48, b: 54, t: "Madrugada alta: posible fuga", ty: Y1 - 6, tx: 51 },
    { a: 108, b: 132, t: "Consumo en cero: medidor dañado o fraude", ty: Y1 - 6, tx: 120 },
  ];
  flags.forEach((f) => {
    const gr = el("g", { class: "flag" });
    el("rect", { x: x(f.a) - 2, y: Y1 + 4, width: x(f.b) - x(f.a) + 4, height: Y0 - Y1 - 4, rx: 5 }, gr);
    el("text", { x: x(f.tx), y: f.ty, "text-anchor": "middle" }, gr).textContent = f.t;
  });
  btn.addEventListener("click", () => {
    const on = btn.getAttribute("aria-pressed") !== "true";
    btn.setAttribute("aria-pressed", String(on));
    panel.classList.toggle("is-on", on);
    btnT.textContent = on ? "Ocultar anomalías" : "Detectar anomalías";
  });
  hooks.s11 = {
    enter() {
      if (!G || reduced()) return;
      const L = line.getTotalLength();
      G.fromTo(line, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 2, ease: "power1.inOut", delay: 0.5, clearProps: "strokeDasharray,strokeDashoffset" });
    },
  };
})();
