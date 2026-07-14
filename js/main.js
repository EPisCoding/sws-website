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

  /* ---------- Donation progress tracker ---------- */

  var tracker = document.querySelector("[data-donation-tracker]");
  if (tracker && "fetch" in window) {
    fetch("/data/donations.json", { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(function (data) {
        var totalPence = Math.max(0, Math.round(Number(data.total_pence)) || 0);
        var goalPence = Math.round(Number(data.goal_pence)) || 70000;
        var pct = Math.min(100, (totalPence / goalPence) * 100);

        var raisedEl = tracker.querySelector("[data-donation-raised]");
        var goalEl = tracker.querySelector("[data-donation-goal]");
        var updatedEl = tracker.querySelector("[data-donation-updated]");
        var bar = tracker.querySelector("[data-donation-bar]");
        var laser = tracker.querySelector(".donation-laser");
        var glow = tracker.querySelector(".donation-laser-glow");
        var tip = tracker.querySelector("[data-donation-tip]");

        function formatPounds(pence) {
          var pounds = pence / 100;
          if (pence % 100 === 0) {
            return "£" + Math.round(pounds).toLocaleString("en-GB");
          }
          return "£" + pounds.toLocaleString("en-GB", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        }

        goalEl.textContent = "raised of " + formatPounds(goalPence);
        bar.setAttribute("aria-valuemax", String(Math.round(goalPence / 100)));
        bar.setAttribute("aria-valuenow", String(Math.round(totalPence / 100)));
        bar.setAttribute("aria-valuetext",
          formatPounds(totalPence) + " raised of " + formatPounds(goalPence));

        if (updatedEl && data.updated) {
          var when = new Date(data.updated);
          if (!isNaN(when.getTime())) {
            updatedEl.textContent = "Last updated " + when.toLocaleDateString("en-GB", {
              day: "numeric", month: "long", year: "numeric"
            }) + ". Donation totals refresh a few times a day.";
          }
        }

        if (totalPence >= goalPence) {
          tracker.classList.add("is-complete");
        }
        tracker.hidden = false;

        // Laser geometry in SVG user units: the line runs from x=8 to x=584.
        var LASER_LENGTH = 576;

        function setFinalState() {
          var offset = LASER_LENGTH * (1 - pct / 100);
          laser.style.strokeDashoffset = offset;
          glow.style.strokeDashoffset = offset;
          tip.style.transform =
            "translateX(" + (LASER_LENGTH * pct) / 100 + "px)";
          if (pct > 0) {
            tracker.classList.add("has-progress");
          }
          raisedEl.textContent = formatPounds(totalPence);
        }

        if (reducedMotion) {
          setFinalState();
          return;
        }

        var animated = false;
        function animate() {
          if (animated) return;
          animated = true;

          // Let the browser paint the resting state first so the
          // stroke-dashoffset and transform transitions run from zero.
          window.requestAnimationFrame(function () {
            window.requestAnimationFrame(setFinalState);
          });

          var DURATION = 1800;
          var start = null;
          function frame(now) {
            if (start === null) start = now;
            var t = Math.min(1, (now - start) / DURATION);
            var eased = 1 - Math.pow(1 - t, 3);
            if (t < 1) {
              raisedEl.textContent =
                "£" + Math.floor((totalPence / 100) * eased).toLocaleString("en-GB");
              window.requestAnimationFrame(frame);
            } else {
              raisedEl.textContent = formatPounds(totalPence);
            }
          }
          window.requestAnimationFrame(frame);
        }

        if ("IntersectionObserver" in window) {
          var trackerObserver = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                  animate();
                  trackerObserver.disconnect();
                }
              });
            },
            { threshold: 0.4 }
          );
          trackerObserver.observe(tracker);
        } else {
          animate();
        }
      })
      .catch(function () {
        // Leave the tracker hidden; the Donate button still works.
      });
  }
})();
