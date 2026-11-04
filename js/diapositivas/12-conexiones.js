/* ======================= 12 · Radios de la red compartida ======================= */
(function hubs() {
  const { $, $$, reduced, hooks } = Deck;
  const s = $("#s12");
  if (!s) return;
  const wrap = $(".hubwrap", s), svg = $(".spokes", s), hub = $(".hub .orb", s);
  const lines = $$("line", svg), dots = $$("circle", svg), nodes = $$(".node", s);
  let seg = [], raf = 0;
  function layout() {
    const W = wrap.getBoundingClientRect();
    const H = hub.getBoundingClientRect();
    const c = [H.left + H.width / 2 - W.left, H.top + H.height / 2 - W.top];
    seg = nodes.map((n, i) => {
      const r = $(".node__card", n).getBoundingClientRect();
      const right = n.classList.contains("node--r");
      const p = [right ? r.left - W.left : r.right - W.left, r.top + r.height / 2 - W.top];
      lines[i].setAttribute("x1", c[0]); lines[i].setAttribute("y1", c[1]);
      lines[i].setAttribute("x2", p[0]); lines[i].setAttribute("y2", p[1]);
      return [c, p];
    });
  }
  function loop(t) {
    seg.forEach(([a, b], i) => {
      const q = ((t / 2600) + i * 0.25) % 1;
      dots[i].setAttribute("cx", a[0] + (b[0] - a[0]) * q);
      dots[i].setAttribute("cy", a[1] + (b[1] - a[1]) * q);
      dots[i].setAttribute("opacity", (Math.sin(q * Math.PI)).toFixed(2));
    });
    raf = requestAnimationFrame(loop);
  }
  nodes.forEach((n, i) => {
    n.addEventListener("mouseenter", () => lines[i].classList.add("is-hot"));
    n.addEventListener("mouseleave", () => lines[i].classList.remove("is-hot"));
  });
  new ResizeObserver(layout).observe(wrap);
  layout();
  hooks.s12 = {
    start() { layout(); dots.forEach((d) => d.setAttribute("opacity", 0)); if (reduced()) return; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); },
    stop() { cancelAnimationFrame(raf); },
  };
})();
