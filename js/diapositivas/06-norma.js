/* ======================= 6 · Línea de tiempo ======================= */
(function norma() {
  const { $, $$, G, reduced, hooks, countUp } = Deck;
  const s = $("#s6");
  if (!s) return;
  const D = [
    ["Ley 142 de 1994", "Régimen de los servicios públicos domiciliarios: las reglas de juego para agua, luz y gas."],
    ["Resoluciones 40072 de 2018 y 40483 de 2019 de MinEnergía", "Meta de 75 % de los usuarios del sistema interconectado con medición inteligente en 2030, con registro máximo cada hora y envío diario."],
    ["Ley 2099 de 2021", "Ley de transición energética: promueve la infraestructura de medición avanzada (AMI)."],
    ["Resolución CREG 101 001 de 2022", "Cómo desplegar AMI: plan aprobado, estudio costo-beneficio e información previa a los usuarios."],
    ["Resolución SIC 40972 de 2025", "Requisitos técnicos y metrológicos de los nuevos medidores residenciales de energía."],
    ["Meta 2030", "75 % de los usuarios con medición inteligente. En 2024 el avance estimado iba cerca del 1 %."],
  ];
  const items = $$(".tl__item", s), det = $(".tl__detail", s);
  function sel(k) {
    items.forEach((b, j) => b.setAttribute("aria-pressed", String(j === k)));
    det.innerHTML = `<strong>${D[k][0]}.</strong> ${D[k][1]}`;
  }
  items.forEach((b, j) => b.addEventListener("click", () => sel(j)));
  sel(1);
  hooks.s6 = {
    enter() {
      countUp($$(".js-count", s));
      if (!G || reduced()) return;
      G.fromTo($(".tl__line", s), { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "power2.out", delay: 0.35 });
      G.fromTo($$(".bar i", s), { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "power3.out", delay: 0.8, stagger: 0.2 });
    },
  };
})();
