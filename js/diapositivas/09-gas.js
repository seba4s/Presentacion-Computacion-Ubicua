/* ======================= 9 · Ruta del gas e inventario ======================= */
(function gas() {
  const { $, $$, G, reduced, hooks, countUp } = Deck;
  const s = $("#s9");
  if (!s) return;
  const route = $(".route", s), road = $(".road", s), truck = $(".truck", s), risk = $(".risk", s);
  const L = road.getTotalLength();
  const RISK = 0.56, TW = +truck.getAttribute("width"), TH = +truck.getAttribute("height");
  const rp = road.getPointAtLength(L * RISK);
  risk.setAttribute("transform", `translate(${rp.x},${rp.y + 36})`);
  let raf = 0, t0 = 0, closed = false;
  function place(q) { const p = road.getPointAtLength(L * q); truck.setAttribute("x", (p.x - TW * 0.55).toFixed(1)); truck.setAttribute("y", (p.y - TH * 0.82).toFixed(1)); }
  place(0.3);
  function step(t) {
    if (!t0) t0 = t;
    let q = ((t - t0) / 9000) % 1;
    if (closed) q = Math.min(q, RISK - 0.07);
    place(q);
    raf = requestAnimationFrame(step);
  }
  hooks.s9 = {
    start() { if (reduced()) return; cancelAnimationFrame(raf); t0 = 0; raf = requestAnimationFrame(step); },
    stop() { cancelAnimationFrame(raf); },
    enter() { countUp($$(".js-count", s)); },
  };
  const inv = $(".inv", s), ring = $(".js-inv-ring", s), num = $(".js-inv", s), msg = $(".js-inv-msg", s), btn = $(".js-road", s), btnT = $(".js-road-t", s);
  const C = 2 * Math.PI * 42, MAX = 48;
  ring.style.strokeDasharray = C;
  const setRing = (h) => { ring.style.strokeDashoffset = C * (1 - h / MAX); };
  setRing(38);
  btn.addEventListener("click", () => {
    closed = btn.getAttribute("aria-pressed") !== "true";
    btn.setAttribute("aria-pressed", String(closed));
    route.classList.toggle("is-closed", closed);
    btnT.textContent = closed ? "Reabrir la vía" : "Simular cierre de la vía";
    const from = closed ? 38 : 10, to = closed ? 10 : 38;
    const fin = () => {
      inv.classList.toggle("is-alert", closed);
      msg.textContent = closed
        ? "Alerta temprana: quedan 10 horas de gas. La empresa activa el plan de contingencia antes de que falte en las casas."
        : "Con sensores de presión y volumen, la empresa sabe cuántas horas de gas le quedan.";
    };
    if (!G || reduced()) { setRing(to); num.textContent = to + " h"; fin(); return; }
    const o = { h: from };
    G.to(o, { h: to, duration: 2.2, ease: "power1.inOut", onUpdate() { setRing(o.h); num.textContent = Math.round(o.h) + " h"; }, onComplete: fin });
  });
})();
