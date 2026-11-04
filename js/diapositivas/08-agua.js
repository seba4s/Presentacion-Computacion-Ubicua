/* ======================= 8 · Curva de 24 horas ======================= */
(function chart() {
  const { $, $$, G, reduced, hooks } = Deck;
  const s = $("#s8");
  if (!s) return;
  const svg = $(".js-chart", s), panel = $(".chart", s);
  const A2 = [14, 12, 11, 10, 11, 16, 38, 70, 78, 64, 55, 52, 56, 58, 52, 48, 50, 58, 68, 72, 62, 46, 30, 20, 14];
  const B2 = A2.map((v) => v + 16);
  const NS = "http://www.w3.org/2000/svg";
  const el = (n, a, p = svg) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  let X0 = 40, X1 = 628, Y0 = 170, Y1 = 16, t = 0, line, area, lead, pt, lab, lastW = 0, lastH = 0;
  const x = (h) => X0 + (X1 - X0) * h / 24, y = (v) => Y0 - (Y0 - Y1) * v / 100;
  function smooth(v) {
    const P = v.map((val, i) => [x(i), y(val)]);
    let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }
  function render(k) {
    const v = A2.map((a, i) => a + (B2[i] - a) * k);
    const d = smooth(v);
    line.setAttribute("d", d);
    area.setAttribute("d", `${d} L${x(24)},${Y0} L${x(0)},${Y0} Z`);
    pt.setAttribute("cx", x(3)); pt.setAttribute("cy", y(v[3]));
    lab.setAttribute("x", x(3) - 4); lab.setAttribute("y", Y1 - 5);
    lead.setAttribute("x1", x(3)); lead.setAttribute("x2", x(3)); lead.setAttribute("y1", Y1 + 2); lead.setAttribute("y2", y(v[3]) - 7);
    lab.textContent = `${Math.round(v[3])} m³/h a las 3 a. m.${k > 0.5 ? ": hay una fuga" : ""}`;
    panel.classList.toggle("is-leak", k > 0.5);
  }
  /* El dibujo usa la medida real del recuadro, así la curva ocupa todo el ancho del panel. */
  function build() {
    const r = svg.getBoundingClientRect();
    const W = Math.round(r.width) || 640, H = Math.round(r.height) || 200;
    if (W === lastW && H === lastH) return;
    lastW = W; lastH = H;
    const fs = parseFloat(getComputedStyle(svg.querySelector("text") || svg).fontSize) || 12;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.textContent = "";
    X0 = Math.round(fs * 3.2); X1 = W - 8; Y1 = Math.round(fs * 1.9); Y0 = H - Math.round(fs * 2.1);
    const defs = el("defs", {});
    const lg = el("linearGradient", { id: "aguaFill", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el("stop", { offset: 0, "stop-color": "#27B4FF", "stop-opacity": 0.4 }, lg);
    el("stop", { offset: 1, "stop-color": "#27B4FF", "stop-opacity": 0 }, lg);
    el("rect", { class: "night", x: x(1.5), y: Y1, width: x(4.5) - x(1.5), height: Y0 - Y1, rx: 4 });
    const grid = el("g", { class: "grid" });
    [0, 25, 50, 75, 100].forEach((v) => {
      el("line", { x1: X0, x2: X1, y1: y(v), y2: y(v) }, grid);
      el("text", { x: X0 - 10, y: y(v) + 4, "text-anchor": "end" }).textContent = v;
    });
    [0, 3, 6, 12, 18, 24].forEach((h) => { el("text", { x: x(h), y: Y0 + fs * 1.6, "text-anchor": h === 24 ? "end" : "middle" }).textContent = h === 3 ? "3 a. m." : h + " h"; });
    el("text", { x: X1, y: Y1 - 5, "text-anchor": "end" }).textContent = "m³/h";
    area = el("path", { class: "area" }); line = el("path", { class: "line" });
    lead = el("line", { class: "lead", "stroke-dasharray": "2 4" });
    pt = el("circle", { class: "pt", r: 5.5 }); lab = el("text", { class: "pt-label", "text-anchor": "start" });
    render(t);
  }
  el("text", {}).textContent = "0";
  build();
  new ResizeObserver(() => build()).observe(svg);
  $$(".js-leak button", s).forEach((b) => b.addEventListener("click", () => {
    const to = +b.dataset.s;
    $$(".js-leak button", s).forEach((x2) => x2.setAttribute("aria-pressed", String(x2 === b)));
    if (!G || reduced()) { t = to; render(t); return; }
    const o = { k: t };
    G.to(o, { k: to, duration: 0.9, ease: "power2.inOut", onUpdate() { t = o.k; render(t); } });
  }));
  hooks.s8 = {
    enter() {
      if (!G || reduced()) return;
      const L = line.getTotalLength();
      G.fromTo(line, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", delay: 0.5, clearProps: "strokeDasharray,strokeDashoffset" });
      G.fromTo(area, { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 1.4 });
    },
  };
})();
