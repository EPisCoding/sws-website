/* Smart Walking Stick, shared behaviour
   Navigation, scroll reveals and the external cueing demo. */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header shadow ---------- */

  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile navigation ---------- */

  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* ---------- Scroll reveal ---------- */

  var revealables = document.querySelectorAll(".reveal");
  if (revealables.length && "IntersectionObserver" in window && !reducedMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealables.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealables.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- External cueing demo ---------- */

  var PHASE_COUNT = 4;
  var PHASE_MS = 4200;

  document.querySelectorAll("[data-cue-demo]").forEach(function (demo) {
    var toggle = demo.querySelector("[data-cue-toggle]");
    var label = toggle ? toggle.querySelector("[data-cue-label]") : null;
    var phase = 0;
    var timer = null;
    var userPaused = false;

    function setPhase(next) {
      phase = next % PHASE_COUNT;
      demo.setAttribute("data-phase", String(phase));
    }

    function play() {
      if (timer) return;
      demo.classList.add("is-playing");
      if (label) label.textContent = "Pause animation";
      timer = window.setInterval(function () {
        setPhase(phase + 1);
      }, PHASE_MS);
    }

    function pause() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      demo.classList.remove("is-playing");
      if (label) label.textContent = "Play animation";
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        userPaused = !!timer;
        if (timer) {
          pause();
        } else {
          play();
        }
      });
    }

    // Reduced motion: rest on the cueing phase so the static diagram is
    // informative; the user can still press play deliberately.
    if (reducedMotion) {
      setPhase(2);
      pause();
      return;
    }

    setPhase(0);

    // Only animate while the demo is on screen, unless the user paused it.
    if ("IntersectionObserver" in window) {
      var visObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (userPaused) return;
            if (entry.isIntersecting) {
              play();
            } else {
              pause();
            }
          });
        },
        { threshold: 0.25 }
      );
      visObserver.observe(demo);
    } else {
      play();
    }
  });
})();
