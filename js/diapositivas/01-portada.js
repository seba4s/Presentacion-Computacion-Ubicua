/* ======================= 1 · Cordillera con gateways ======================= */
(function terrain() {
  const { $, reduced, hooks } = Deck;
  const canvas = $("#s1 .terrain");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1, base = null, raf = 0, running = false, nodes = [];
  const LINES = 26;
  const gauss = (x, c, s) => Math.exp(-((x - c) * (x - c)) / (2 * s * s));
  function profile(x, k) {
    const volcan = 1.0 * gauss(x, 0.7, 0.06) + 0.42 * gauss(x, 0.7, 0.16) - 0.2 * gauss(x, 0.7, 0.016);
    const ridges = 0.34 * gauss(x, 0.45, 0.1) + 0.16 * gauss(x, 0.25, 0.06) + 0.3 * gauss(x, 0.95, 0.07);
    const n = 0.045 * (Math.sin(x * 29 + k * 1.31) + 0.6 * Math.sin(x * 61 + k * 2.17) + 0.35 * Math.sin(x * 103 + k * 0.71));
    return Math.max(0, volcan + ridges + n);
  }
  function lineY(x, k) {
    const f = k / (LINES - 1);
    const y0 = h * (0.36 + 0.7 * f);
    const amp = h * (0.24 - 0.15 * f);
    return y0 - amp * profile(x, k);
  }
  function build() {
    base = document.createElement("canvas");
    base.width = Math.round(w * dpr); base.height = Math.round(h * dpr);
    const b = base.getContext("2d");
    b.setTransform(dpr, 0, 0, dpr, 0, 0);
    const steps = Math.max(140, Math.round(w / 4));
    for (let k = 0; k < LINES; k++) {
      const f = k / (LINES - 1);
      const curve = new Path2D();
      for (let i = 0; i <= steps; i++) {
        const x = i / steps, y = lineY(x, k);
        i ? curve.lineTo(x * w, y) : curve.moveTo(x * w, y);
      }
      const area = new Path2D(curve);
      area.lineTo(w, h + 4); area.lineTo(0, h + 4); area.closePath();
      b.fillStyle = "rgba(3,9,30,0.96)";
      b.fill(area);
      b.strokeStyle = k === 0 ? "rgba(46,219,255,0.75)" : `rgba(122,163,255,${(0.12 + 0.42 * Math.pow(1 - f, 1.6)).toFixed(3)})`;
      b.lineWidth = k === 0 ? 1.4 : 1;
      b.stroke(curve);
    }
    nodes = [[0.18, 14], [0.45, 6], [0.7, 0], [0.93, 8]].map(([x, k]) => ({ x: x * w, y: lineY(x, k) - 3 }));
  }
  function dot(x, y, r, color, blur) {
    ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = blur;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.restore();
  }
  function frame(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (base) ctx.drawImage(base, 0, 0, w, h);
    ctx.setLineDash([2, 7]); ctx.lineWidth = 1.2; ctx.strokeStyle = "rgba(46,219,255,0.45)";
    for (let i = 0; i < nodes.length - 1; i++) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[i + 1].x, nodes[i + 1].y); ctx.stroke(); }
    ctx.setLineDash([]);
    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i], b2 = nodes[i + 1], q = ((t / 2800) + i * 0.37) % 1;
      dot(a.x + (b2.x - a.x) * q, a.y + (b2.y - a.y) * q, 2.4, "rgba(243,247,255,0.95)", 10);
    }
    const R = Math.min(96, w * 0.055);
    nodes.forEach((n, i) => {
      for (let j = 0; j < 3; j++) {
        const ph = ((t / 3400) + j / 3 + i * 0.23) % 1;
        ctx.beginPath(); ctx.arc(n.x, n.y, 4 + ph * R, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(46,219,255,${(0.6 * (1 - ph)).toFixed(3)})`; ctx.lineWidth = 1.2; ctx.stroke();
      }
      dot(n.x, n.y, 3.6, "#2EDBFF", 18);
    });
  }
  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = Math.max(1, r.width); h = Math.max(1, r.height);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    build(); frame(performance.now());
  }
  function loop(t) { frame(t); raf = requestAnimationFrame(loop); }
  new ResizeObserver(resize).observe(canvas);
  hooks.s1 = {
    start() { if (running || reduced()) return; running = true; raf = requestAnimationFrame(loop); },
    stop() { running = false; cancelAnimationFrame(raf); },
  };
})();
