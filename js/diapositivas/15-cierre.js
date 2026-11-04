/* ======================= 15 · Cierre ======================= */
(function closing() {
  const { $, go } = Deck;
  const s = $("#s15");
  if (!s) return;
  $(".js-home", s).addEventListener("click", () => go(0));
})();
