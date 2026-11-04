/* Barra inferior, notas del orador, índice, pantalla completa y botón de animaciones. */
(() => {
  "use strict";
  const { $, $$, slides, N, hook, reduced, setReduced } = Deck;

  /* ---------- Barra de progreso ---------- */
  const ticksBox = $(".rail__ticks");
  const ticks = [];
  slides.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "tick";
    if (i && s.dataset.part !== slides[i - 1].dataset.part) b.classList.add("gap");
    b.dataset.tip = `${i + 1}. ${s.dataset.title}`;
    b.setAttribute("aria-label", `Ir a la diapositiva ${i + 1}: ${s.dataset.title}`);
    b.addEventListener("click", () => Deck.go(i));
    ticks[i] = b; ticksBox.appendChild(b);
  });
  const counter = $(".counter");
  const tipOut = $(".tip-out");
  $$(".tools .tool").forEach((t) => {
    const show = (on) => { tipOut.textContent = t.dataset.tip; tipOut.classList.toggle("is-on", on); };
    t.addEventListener("mouseenter", () => show(true));
    t.addEventListener("mouseleave", () => show(false));
    t.addEventListener("focus", () => { if (t.matches(":focus-visible")) show(true); });
    t.addEventListener("blur", () => show(false));
  });
  function markRail(i) {
    ticks.forEach((t, k) => { t.classList.toggle("is-current", k === i); t.classList.toggle("is-past", k < i); t.setAttribute("aria-current", k === i ? "step" : "false"); });
    counter.innerHTML = `<b>${String(i + 1).padStart(2, "0")}</b> / ${N}`;
  }

  /* ---------- Notas del orador ---------- */
  const notesPanel = $(".notes-panel"), notesBtn = $(".js-notes");
  function renderNotes() {
    const s = slides[Deck.index];
    $(".js-notes-title").textContent = `Notas · ${Deck.index + 1}. ${s.dataset.title}`;
    const src = $(".notes", s);
    $(".js-notes-body").innerHTML = src ? src.innerHTML : "<p>Sin notas para esta diapositiva.</p>";
  }
  function toggleNotes(force) {
    const open = typeof force === "boolean" ? force : !notesPanel.classList.contains("is-open");
    notesPanel.classList.toggle("is-open", open);
    notesBtn.setAttribute("aria-pressed", String(open));
  }
  notesBtn.addEventListener("click", () => toggleNotes());
  $(".js-notes-close").addEventListener("click", () => toggleNotes(false));

  /* ---------- Índice ---------- */
  const idxDlg = $("#indice"), idxBox = $(".idx", idxDlg);
  const PARTS = { "1": "Cómo funciona", "2": "Los servicios en el territorio", "3": "Inteligencia y propuesta" };
  Object.keys(PARTS).forEach((p) => {
    const col = document.createElement("div");
    col.innerHTML = `<h3>${PARTS[p]}</h3>`;
    slides.forEach((s, i) => {
      if (s.dataset.part !== p) return;
      const b = document.createElement("button");
      b.type = "button"; b.dataset.i = i;
      b.innerHTML = `<b>${String(i + 1).padStart(2, "0")}</b><span>${s.dataset.title}</span>`;
      b.addEventListener("click", () => { idxDlg.close(); Deck.go(i); });
      col.appendChild(b);
    });
    idxBox.appendChild(col);
  });
  function openIndex() { if (!idxDlg.open) idxDlg.showModal(); }
  function markIndex(i) { $$(".idx button").forEach((b) => b.setAttribute("aria-current", String(+b.dataset.i === i))); }
  $(".js-index").addEventListener("click", openIndex);
  $$("dialog [data-close]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

  /* ---------- Pantalla completa ---------- */
  function toggleFull() {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(() => {});
    } catch (e) {}
  }
  $(".js-full").addEventListener("click", toggleFull);
  document.addEventListener("fullscreenchange", () => { $(".js-full-ico").textContent = document.fullscreenElement ? "fullscreen_exit" : "fullscreen"; });

  /* ---------- Quitar o devolver las animaciones ---------- */
  const animBtn = $(".js-anim");
  const markAnim = () => animBtn.setAttribute("aria-pressed", String(reduced()));
  function toggleAnimaciones() {
    setReduced(!reduced());
    markAnim();
    const actual = hook(slides[Deck.index].id);
    actual.stop?.();
    actual.start?.();
  }
  animBtn.addEventListener("click", toggleAnimaciones);
  markAnim();

  Deck.ui = { markRail, renderNotes, toggleNotes, openIndex, markIndex, toggleFull, toggleAnimaciones };
})();
