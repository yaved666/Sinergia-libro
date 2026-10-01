// Two small behaviours, both optional: the page reads fine without JavaScript.
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Kaelum's line types itself once. Screen readers get the whole sentence at once through aria-label.
  var line = document.querySelector("[data-type]");
  if (line && !reduce) {
    var full = line.textContent;
    line.setAttribute("aria-label", full);
    line.textContent = "";
    line.classList.add("typing");
    var i = 0;
    var tick = function () {
      i += 1;
      line.textContent = full.slice(0, i);
      if (i < full.length) {
        window.setTimeout(tick, 42);
      } else {
        line.classList.remove("typing");
        line.classList.add("typed");
      }
    };
    window.setTimeout(tick, 400);
  }

  // Reading progress on the chapter pages: a thin bar that tells you how much is left.
  var bar = document.querySelector(".progress");
  if (bar && !reduce) {
    var queued = false;
    var update = function () {
      queued = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
    };
    window.addEventListener("scroll", function () {
      if (!queued) { queued = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();
