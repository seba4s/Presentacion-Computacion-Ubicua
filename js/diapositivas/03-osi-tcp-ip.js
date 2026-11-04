/* ======================= 3 · Recorrido de la lectura ======================= */
(function journey() {
  const { $, $$, G, reduced, hooks } = Deck;
  const s = $("#s3");
  if (!s) return;
  const stack = $(".stack", s), packet = $(".packet", s), gw = $(".gw", s);
  const layers = $$(".layer", stack);
  let tl = null;
  const yOf = (el) => el.offsetTop + el.offsetHeight / 2 - packet.offsetHeight / 2;
  const light = (el) => layers.forEach((l) => l.classList.toggle("is-lit", l === el));
  function rest() { light(layers[0]); gw.classList.add("is-on"); packet.style.transform = `translateY(${yOf(layers[0])}px)`; }
  function play() {
    if (!G || reduced()) { rest(); return; }
    if (tl) tl.kill();
    const order = layers.slice().reverse();
    gw.classList.remove("is-on");
    tl = G.timeline();
    tl.set(packet, { y: yOf(order[0]), opacity: 0 }).to(packet, { opacity: 1, duration: 0.3 });
    order.forEach((el, k) => {
      if (k) tl.to(packet, { y: yOf(el), duration: 0.55, ease: "power2.inOut" });
      tl.add(() => { light(el); if (el.dataset.layer === "red") gw.classList.add("is-on"); });
      tl.to({}, { duration: 0.5 });
    });
  }
  layers.forEach((el) => el.addEventListener("click", () => {
    light(el);
    if (G && !reduced()) G.to(packet, { y: yOf(el), duration: 0.5, ease: "power2.inOut" });
    else packet.style.transform = `translateY(${yOf(el)}px)`;
  }));
  $(".js-journey", s).addEventListener("click", play);
  rest();
  addEventListener("resize", () => { if (!tl || !tl.isActive()) { const lit = layers.find((l) => l.classList.contains("is-lit")) || layers[0]; if (G) G.set(packet, { y: yOf(lit) }); else packet.style.transform = `translateY(${yOf(lit)}px)`; } });
  hooks.s3 = { enter() { setTimeout(play, 700); } };
})();
