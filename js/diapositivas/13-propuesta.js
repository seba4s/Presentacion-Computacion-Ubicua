/* ======================= 13 · Las 4 capas del proyecto MIA ======================= */
(function mia() {
  const { $, $$, reduced, hooks, countUp } = Deck;
  const s = $("#s13");
  if (!s) return;
  const CAPAS = [
    ["Percepción", "Medidor ultrasónico con módem incorporado. Registra la lectura cada 30 minutos: 48 lecturas al día por medidor."],
    ["Red", "Transmite por la red celular de un operador, con un plan de datos incluido en el proyecto. No exige montar una red de radio propia."],
    ["Procesamiento", "Plataforma de gestión de datos con inteligencia artificial, desarrollada por ingenieros del Acueducto, con acceso controlado."],
    ["Aplicación", "El cliente ve curvas y tendencias, descarga datos por año, mes, día u hora y recibe alarmas en el celular o el correo para detectar fugas."],
  ];
  const botones = $$(".mia__layer", s), detalle = $(".js-mia-detail", s);
  let timer = 0;
  function sel(k) {
    botones.forEach((b, j) => b.setAttribute("aria-pressed", String(j === k)));
    detalle.innerHTML = `<strong>${CAPAS[k][0]}.</strong> ${CAPAS[k][1]}`;
  }
  /* Al entrar recorre las capas en orden; tocar una detiene el recorrido. */
  function recorrer(k) {
    sel(k);
    if (k < CAPAS.length - 1) timer = setTimeout(() => recorrer(k + 1), 2200);
  }
  const parar = () => clearTimeout(timer);
  botones.forEach((b, k) => b.addEventListener("click", () => { parar(); sel(k); }));
  sel(0);
  hooks.s13 = {
    enter() {
      countUp($$(".js-count", s));
      parar();
      if (!reduced()) timer = setTimeout(() => recorrer(0), 900);
    },
    stop: parar,
  };
})();
