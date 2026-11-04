/* Estado y utilidades que comparten todos los archivos. Son scripts clásicos, no módulos,
   para que la presentación también abra con doble clic (file://) sin servidor. */
window.Deck = (() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = $("#deck");
  const slides = $$(".slide", el);
  const G = window.gsap || null;
  const mqFlow = matchMedia("(max-aspect-ratio: 5/4), (max-width: 820px), (max-height: 520px)");
  const flow = () => mqFlow.matches;

  /* ---------- Preferencia de animaciones ----------
     Siempre arrancan activas: presenta quien decide, con la tecla A o el botón de la barra.
     No se lee prefers-reduced-motion porque Windows lo activa con los efectos visuales
     apagados por rendimiento, y eso dejaba la presentación sin ninguna animación. */
  const root = document.documentElement, CLAVE = "presentacion-animaciones";
  const reduced = () => root.classList.contains("sin-animaciones");
  function setReduced(on) {
    root.classList.toggle("sin-animaciones", on);
    try { localStorage.setItem(CLAVE, on ? "no" : "si"); } catch (e) {}
  }
  try { root.classList.toggle("sin-animaciones", localStorage.getItem(CLAVE) === "no"); } catch (e) {}

  /* ---------- Ganchos por diapositiva: start, stop y enter ---------- */
  const hooks = {};
  const hook = (id) => hooks[id] || {};

  /* ---------- Utilidades de animación ---------- */
  function countUp(els) {
    if (!G || reduced()) return;
    els.forEach((n) => {
      const to = +n.dataset.to, suf = n.dataset.suffix || "";
      const o = { v: 0 };
      G.to(o, { v: to, duration: 1.6, ease: "power2.out", delay: 0.45, onUpdate() { n.textContent = Math.round(o.v).toLocaleString("es-CO") + suf; } });
    });
  }
  function tweenNum(n, from, to, suf, fmt) {
    const show = (v) => { n.textContent = (fmt ? fmt(v) : Math.round(v).toLocaleString("es-CO")) + suf; };
    if (!G || reduced()) { show(to); return; }
    const o = { v: from };
    G.to(o, { v: to, duration: 0.9, ease: "power2.out", onUpdate() { show(o.v); } });
  }

  return { $, $$, el, slides, N: slides.length, G, flow, reduced, setReduced, hooks, hook, countUp, tweenNum, index: -1 };
})();
