/* ======================= 7 · Balance de energía ======================= */
(function balance() {
  const { $, $$, hooks, countUp, tweenNum } = Deck;
  const s = $("#s7");
  if (!s) return;
  const box = $(".bal", s), btn = $(".js-fraud", s), msg = $(".js-bal-msg", s);
  const tr = $(".js-tr", s), diff = $(".js-diff", s), label = $(".js-fraud-t", s);
  btn.addEventListener("click", () => {
    const on = btn.getAttribute("aria-pressed") !== "true";
    btn.setAttribute("aria-pressed", String(on));
    box.classList.toggle("is-fraud", on);
    tweenNum(tr, on ? 1000 : 1140, on ? 1140 : 1000, " kWh");
    tweenNum(diff, on ? 0 : 12, on ? 12 : 0, " %");
    label.textContent = on ? "Quitar la conexión ilegal" : "Simular conexión ilegal";
    msg.textContent = on
      ? "Salen 1.140 kWh, pero las casas suman 1.000: hay 140 kWh sin medir. La cuadrilla revisa esta cuadra, no toda la ciudad."
      : "Si lo que sale del transformador no cuadra con la suma de las casas, hay una pérdida o una conexión ilegal en esa cuadra.";
  });
  hooks.s7 = { enter() { countUp($$(".js-count", s)); } };
})();
