/* ============================================================
   VERTEX ACADEMY — animations.js
   One-off orchestrated micro-interactions kept separate from
   main.js's structural logic, per project file layout.
   ============================================================ */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  document.addEventListener("DOMContentLoaded", function () {
    /* Subtle parallax drift on the hero visual only — one orchestrated
       moment, not scattered effects across the page. */
    var visual = document.querySelector(".hero-visual");
    if (!visual || window.innerWidth < 900) return;

    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < 700) {
        visual.style.transform = "translateY(" + Math.min(y * 0.08, 40) + "px)";
      }
    }, { passive: true });
  });
})();
