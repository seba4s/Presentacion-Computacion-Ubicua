/* Paso entre diapositivas: parallax, transición, rueda del mouse y teclado. */
(() => {
  "use strict";
  const { $, $$, el: deck, slides, N, G, flow, reduced, hook } = Deck;
  let animating = false, lastWheel = 0, ticking = false;

  /* ---------- Parallax: cada capa se mueve a su ritmo ---------- */
  function parallax() {
    const st = deck.scrollTop, h = deck.clientHeight || 1;
    for (const s of slides) {
      const p = (s.offsetTop - st) / h;
      if (p > -1.6 && p < 1.6) {
        s.style.setProperty("--p", p.toFixed(4));
        s.style.setProperty("--pa", Math.min(1, Math.abs(p)).toFixed(4));
      }
    }
  }

  function switchActive(i) {
    if (i === Deck.index) return;
    const prev = slides[Deck.index];
    if (prev) hook(prev.id).stop?.();
    Deck.index = i;
    const s = slides[i];
    slides.forEach((el, k) => el.classList.toggle("is-active", k === i));
    Deck.ui.markRail(i);
    Deck.ui.renderNotes();
    Deck.ui.markIndex(i);
    hook(s.id).start?.();
    try { history.replaceState(null, "", "#" + s.id); } catch (e) {}
  }

  function prepare(i) {
    if (!G || reduced() || flow()) return;
    const els = $$("[data-reveal]", slides[i]);
    G.killTweensOf(els);
    G.set(els, { opacity: 0, y: 22 });
  }
  function enter(i) {
    const s = slides[i];
    if (G && !reduced() && !flow()) {
      G.to($$("[data-reveal]", s), { opacity: 1, y: 0, duration: 0.85, ease: "power2.out", stagger: 0.07, clearProps: "opacity,transform" });
    }
    hook(s.id).enter?.();
  }

  function go(i) {
    i = Math.max(0, Math.min(N - 1, i));
    if (animating) return;
    if (i === Deck.index && Math.abs(deck.scrollTop - slides[i].offsetTop) < 2) return;
    const target = slides[i].offsetTop;
    animating = true;
    Deck.ui.markRail(i);
    prepare(i);
    deck.classList.add("tweening");
    const done = () => { deck.classList.remove("tweening"); animating = false; parallax(); switchActive(i); };
    if (G && !reduced()) {
      const p = { y: deck.scrollTop };
      G.to(p, { y: target, duration: flow() ? 0.75 : 1.05, ease: "power3.inOut", onUpdate() { deck.scrollTop = p.y; }, onComplete: done });
      G.delayedCall(flow() ? 0.2 : 0.42, () => enter(i));
    } else {
      deck.scrollTop = target; done(); enter(i);
    }
  }
  function jump(i) {
    deck.classList.add("tweening");
    deck.scrollTop = slides[i].offsetTop;
    deck.classList.remove("tweening");
    parallax(); switchActive(i);
  }
  function nearest() {
    const y = deck.scrollTop + deck.clientHeight * 0.45;
    let k = 0;
    for (let j = 0; j < N; j++) if (slides[j].offsetTop <= y) k = j;
    return k;
  }

  deck.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false; parallax();
      if (animating) return;
      const k = nearest();
      if (k === Deck.index) return;
      switchActive(k);
      if (flow()) hook(slides[k].id).enter?.();
    });
  }, { passive: true });

  /* Un gesto de rueda o del trackpad = una diapositiva. */
  deck.addEventListener("wheel", (e) => {
    if (flow() || e.ctrlKey) return;
    e.preventDefault();
    const now = performance.now(), gap = now - lastWheel; lastWheel = now;
    const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (animating || gap < 180 || Math.abs(d) < 3) return;
    go(Deck.index + (d > 0 ? 1 : -1));
  }, { passive: false });

  /* En ventanas angostas se baja libremente: cada bloque aparece al entrar en pantalla. */
  if (G) {
    const visor = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting || !flow() || reduced()) continue;
        visor.unobserve(e.target);
        G.fromTo(e.target, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", clearProps: "opacity,transform" });
      }
    }, { rootMargin: "0px 0px -6% 0px" });
    $$("[data-reveal]").forEach((n) => visor.observe(n));
  }

  /* ---------- Teclado ---------- */
  addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t.closest && t.closest("input,textarea,select,[contenteditable]")) return;
    if ($("dialog[open]")) return;
    const onControl = t.closest && t.closest("button,a");
    switch (e.key) {
      case "ArrowDown": case "ArrowRight": case "PageDown": e.preventDefault(); go(Deck.index + 1); break;
      case " ": if (onControl) return; e.preventDefault(); go(Deck.index + 1); break;
      case "ArrowUp": case "ArrowLeft": case "PageUp": e.preventDefault(); go(Deck.index - 1); break;
      case "Home": e.preventDefault(); go(0); break;
      case "End": e.preventDefault(); go(N - 1); break;
      case "n": case "N": Deck.ui.toggleNotes(); break;
      case "i": case "I": Deck.ui.openIndex(); break;
      case "f": case "F": Deck.ui.toggleFull(); break;
      case "a": case "A": Deck.ui.toggleAnimaciones(); break;
      case "Escape": Deck.ui.toggleNotes(false); break;
    }
  });

  addEventListener("resize", (() => {
    let t;
    return () => { clearTimeout(t); t = setTimeout(() => { if (animating) return; deck.classList.add("tweening"); deck.scrollTop = slides[Deck.index].offsetTop; deck.classList.remove("tweening"); parallax(); }, 120); };
  })());

  function iniciar() {
    const startAt = Math.max(0, slides.findIndex((s) => "#" + s.id === location.hash));
    jump(startAt);
    prepare(startAt);
    requestAnimationFrame(() => enter(startAt));
  }

  Object.assign(Deck, { go, jump, iniciar });
})();
