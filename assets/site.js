// Small, optional behaviours. Without JavaScript every line is visible and the page reads the same.
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  // The AI's first question types itself once. Screen readers get the whole sentence through aria-label.
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
      if (i < full.length) { window.setTimeout(tick, 42); } else { line.classList.remove("typing"); }
    };
    window.setTimeout(tick, 500);
  }

  // The 02:47 conversation: each line arrives when it scrolls into view, in reading order.
  var lines = document.querySelectorAll(".reveal");
  if (lines.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      lines.forEach(function (el) { el.classList.add("shown"); });
    } else {
      var seen = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("shown"); seen.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -12% 0px" });
      lines.forEach(function (el) { seen.observe(el); });
    }
  }

  // K.A.E.L.U.M.: the letters light up one by one, the moment the AI gets its name.
  var acro = document.querySelector(".acronym .letters");
  if (acro) {
    var letters = acro.querySelectorAll("span");
    var lightAll = function () { letters.forEach(function (s) { s.classList.add("on"); }); };
    if (reduce || !("IntersectionObserver" in window)) {
      lightAll();
    } else {
      var once = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) { return; }
        once.disconnect();
        letters.forEach(function (s, k) { window.setTimeout(function () { s.classList.add("on"); }, 180 * k); });
      }, { threshold: 0.6 });
      once.observe(acro);
    }
  }

  // Reading progress on the chapter pages.
  var bar = document.querySelector(".progress");
  if (bar && !reduce) {
    var queued = false;
    var update = function () {
      queued = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
    };
    window.addEventListener("scroll", function () { if (!queued) { queued = true; window.requestAnimationFrame(update); } }, { passive: true });
    update();
  }
})();
