/* ============================================================
   VERTEX ACADEMY — main.js
   Handles: mobile nav, active-link highlighting, animated
   counters, scroll-reveal, gallery filter + lightbox, FAQ
   accordion. No external dependencies.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Mobile nav ---------------- */
  function initMobileNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-mobile-nav]");
    if (!toggle || !panel) return;
    toggle.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        panel.classList.remove("open");
        toggle.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------------- Active nav link by current page ---------------- */
  function markActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a, .mobile-nav a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      var file = href.split("/").pop();
      if (file === path || (path === "" && file === "index.html")) {
        a.classList.add("active");
      }
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Animated counters ---------------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = (target % 1 === 0 ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Gallery filter ---------------- */
  function initGalleryFilter() {
    var buttons = document.querySelectorAll("[data-filter]");
    var items = document.querySelectorAll("[data-category]");
    if (!buttons.length || !items.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var filter = btn.getAttribute("data-filter");
        items.forEach(function (item) {
          var show = filter === "all" || item.getAttribute("data-category") === filter;
          item.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------------- Lightbox ---------------- */
  function initLightbox() {
    var lightbox = document.querySelector("[data-lightbox]");
    if (!lightbox) return;
    var img = lightbox.querySelector("img");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    document.querySelectorAll("[data-lightbox-trigger]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var full = trigger.getAttribute("data-full") || trigger.querySelector("img").src;
        img.src = full;
        img.alt = trigger.getAttribute("data-caption") || "";
        lightbox.classList.add("open");
      });
    });
    function close() { lightbox.classList.remove("open"); img.src = ""; }
    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---------------- FAQ accordion ---------------- */
  function initFaq() {
    var items = document.querySelectorAll(".faq-item");
    if (!items.length) return;
    items.forEach(function (item) {
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      q.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        items.forEach(function (i) {
          i.classList.remove("open");
          i.querySelector(".faq-a").style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add("open");
          a.style.maxHeight = a.scrollHeight + "px";
        }
      });
    });
  }

  /* ---------------- Header shrink shadow on scroll (subtle) ---------------- */
  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var last = 0;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      header.style.boxShadow = y > 8 ? "0 2px 10px rgba(22,35,58,0.06)" : "none";
      last = y;
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    markActiveNav();
    initReveal();
    initCounters();
    initGalleryFilter();
    initLightbox();
    initFaq();
    initHeaderScroll();
  });
})();
