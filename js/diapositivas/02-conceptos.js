/* ======================= 2 · AMR frente a AMI ======================= */
(function ami() {
  const { $, $$ } = Deck;
  const box = $("#s2 .ami");
  if (!box) return;
  const cap = $(".ami__caption", box);
  const text = {
    amr: "AMR solo lee: el medidor envía su lectura en un solo sentido y no recibe órdenes.",
    ami: "AMI conversa en dos sentidos: envía datos y recibe órdenes como corte, reconexión, cambio de tarifa o actualización.",
  };
  $$(".seg button", box).forEach((b) => b.addEventListener("click", () => {
    box.dataset.mode = b.dataset.mode;
    $$(".seg button", box).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    cap.textContent = text[b.dataset.mode];
  }));
})();
