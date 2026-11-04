/* ======================= 5 · Orden de telecontrol ======================= */
(function wan() {
  const { $, flow, reduced } = Deck;
  const s = $("#s5");
  if (!s) return;
  const track = $(".flow__track", s), msg = $(".js-cmd-msg", s), first = $(".fnode", s);
  const btn = $(".js-cmd", s);
  btn.addEventListener("click", () => {
    const pk = document.createElement("i");
    pk.className = "pk pk--cmd";
    track.appendChild(pk);
    msg.textContent = "La orden sale del centro de control con prioridad y no espera detrás de las lecturas.";
    const end = () => {
      pk.remove(); first.classList.add("is-hit");
      msg.textContent = "Orden recibida: el medidor corta sin que nadie vaya al sitio. Es telecontrol.";
      setTimeout(() => first.classList.remove("is-hit"), 1800);
    };
    /* En ventanas angostas la línea está oculta: el punto no se anima y animationend no llegaría. */
    if (reduced() || flow()) end(); else pk.addEventListener("animationend", end, { once: true });
  });
})();
