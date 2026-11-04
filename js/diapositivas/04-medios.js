/* ======================= 4 · Selector de tecnologías ======================= */
(function techs() {
  const { $, $$ } = Deck;
  const s = $("#s4");
  if (!s) return;
  const L = (m) => (Math.log10(m) - 1) / (Math.log10(50000) - 1) * 100;
  const T = {
    lora: { name: "LoRaWAN", medio: "Radio sub-GHz en banda libre (915–928 MHz en Colombia)", alc: "2–5 km en ciudad; hasta ~15 km rural con línea de vista", r: [2000, 15000], energia: "Batería, hasta ~10 años", uso: "Medidores de agua y gas; zonas rurales" },
    nbiot: { name: "NB-IoT / LTE-M", medio: "Radio celular con licencia, del operador móvil", alc: "Donde haya cobertura celular, aproximadamente 1–10 km según la celda; entra bien a sótanos", r: [1000, 10000], energia: "Batería, varios años", uso: "Medidores en ciudad con buena señal" },
    mesh: { name: "RF Mesh", medio: "Radio; cada medidor repite el mensaje al vecino", alc: "Cientos de metros por salto", r: [100, 500], energia: "Conectado a la red eléctrica", uso: "Medición inteligente de energía en barrios densos" },
    plc: { name: "PLC", medio: "El mismo cable eléctrico (G3-PLC, PRIME)", alc: "Hasta el transformador del sector, cientos de metros", r: [100, 800], energia: "Conectado a la red eléctrica", uso: "Solo medidores de luz" },
    fibra: { name: "Fibra y radioenlaces", medio: "Luz guiada o microondas", alc: "Decenas de kilómetros", r: [10000, 50000], energia: "Conectado a la red eléctrica", uso: "Plantas, subestaciones y retorno de los gateways" },
  };
  const bar = $(".js-t-bar", s);
  function show(key) {
    const t = T[key];
    $(".js-t-name", s).textContent = t.name;
    $(".js-t-medio", s).textContent = t.medio;
    $(".js-t-alc", s).textContent = t.alc;
    $(".js-t-energia", s).textContent = t.energia;
    $(".js-t-uso", s).textContent = t.uso;
    const a = L(t.r[0]), b = L(t.r[1]);
    bar.style.left = a + "%"; bar.style.width = Math.max(1.5, b - a) + "%";
    $$(".tech-btn", s).forEach((x) => x.setAttribute("aria-selected", String(x.dataset.tech === key)));
  }
  $$(".tech-btn", s).forEach((b) => b.addEventListener("click", () => show(b.dataset.tech)));
  $(".tech-list", s).addEventListener("keydown", (e) => {
    if (!["ArrowDown", "ArrowUp"].includes(e.key)) return;
    e.stopPropagation(); e.preventDefault();
    const btns = $$(".tech-btn", s), k = btns.indexOf(document.activeElement);
    const n = btns[(k + (e.key === "ArrowDown" ? 1 : btns.length - 1)) % btns.length];
    n.focus(); show(n.dataset.tech);
  });
  show("lora");
})();
