(function () {
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeBtn");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const year = document.getElementById("year");
  const contactForm = document.getElementById("contactForm");

  const STORAGE_KEY = "portfolio_theme_v1";
  const DEFAULT_THEME = "dark";

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
  }

  function getTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (_) {}
    return DEFAULT_THEME;
  }

  function toggleTheme() {
    const current = root.getAttribute("data-theme") || DEFAULT_THEME;
    setTheme(current === "dark" ? "light" : "dark");
  }

  function setupTheme() {
    const initial = getTheme();
    setTheme(initial);
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  }

  function setupYear() {
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function setupReveal() {
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
  }

  function setupCounters() {
    const counters = Array.from(document.querySelectorAll("[data-counter]"));
    if (!counters.length) return;

    function animate(el) {
      const target = Number(el.getAttribute("data-counter")) || 0;
      const duration = 900;
      const start = performance.now();
      const from = 0;

      function tick(t) {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(from + (target - from) * eased);
        el.textContent = String(val);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(el => obs.observe(el));
  }

  function setupNav() {
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;
      if (navMenu.contains(target) || navToggle.contains(target)) return;
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  }

  function setupContact() {
    if (!contactForm) return;

    // Troque pelo seu e-mail real:
    const DEST_EMAIL = "bruno@advir.org";

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const message = String(fd.get("message") || "").trim();

      const subject = encodeURIComponent(`[Portfólio] Mensagem de ${name}`);
      const body = encodeURIComponent(
        `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}\n`
      );

      window.location.href = `mailto:${DEST_EMAIL}?subject=${subject}&body=${body}`;
    });
  }

  setupTheme();
  setupYear();
  setupReveal();
  setupCounters();
  setupNav();
  setupContact();
})();
