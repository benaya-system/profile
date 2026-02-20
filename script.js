(function () {
  const root = document.documentElement;

  const themeBtn = document.getElementById("themeBtn");
  const menuBtn = document.getElementById("menuBtn");
  const megaNav = document.getElementById("megaNav");

  const searchBtn = document.getElementById("searchBtn");
  const searchPanel = document.getElementById("searchPanel");
  const searchInput = document.getElementById("searchInput");

  const year = document.getElementById("year");
  const contactForm = document.getElementById("contactForm");

  const STORAGE_THEME = "cia_style_theme_v1";
  const DEST_EMAIL = "bruno@advir.org";

  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem(STORAGE_THEME, t); } catch (_) {}
  }
  function getTheme() {
    try {
      const v = localStorage.getItem(STORAGE_THEME);
      if (v === "light" || v === "dark") return v;
    } catch (_) {}
    return "dark";
  }

  function toggleHidden(el, btn) {
    const isHidden = el.hasAttribute("hidden");
    if (isHidden) el.removeAttribute("hidden");
    else el.setAttribute("hidden", "");
    if (btn) btn.setAttribute("aria-expanded", String(isHidden));
  }

  function closeIfOpen(el, btn) {
    if (!el || !btn) return;
    if (!el.hasAttribute("hidden")) {
      el.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
    }
  }

  function setupTheme() {
    setTheme(getTheme());
    themeBtn?.addEventListener("click", () => {
      const cur = root.getAttribute("data-theme") || "dark";
      setTheme(cur === "dark" ? "light" : "dark");
    });
  }

  function setupYear() {
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function setupMenu() {
    if (!menuBtn || !megaNav) return;
    menuBtn.addEventListener("click", () => toggleHidden(megaNav, menuBtn));
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!t) return;
      if (megaNav.contains(t) || menuBtn.contains(t)) return;
      closeIfOpen(megaNav, menuBtn);
    });
  }

  function setupSearch() {
    if (!searchBtn || !searchPanel || !searchInput) return;

    searchBtn.addEventListener("click", () => {
      toggleHidden(searchPanel, searchBtn);
      if (!searchPanel.hasAttribute("hidden")) searchInput.focus();
    });

    // Atalho "/" para abrir busca
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        if (searchPanel.hasAttribute("hidden")) toggleHidden(searchPanel, searchBtn);
        searchInput.focus();
      }
      if (e.key === "Escape") {
        closeIfOpen(searchPanel, searchBtn);
        closeIfOpen(megaNav, menuBtn);
      }
    });

    function applyFilter(q) {
      const query = q.trim().toLowerCase();
      const nodes = document.querySelectorAll("[data-search]");
      nodes.forEach((n) => {
        const hay = String(n.getAttribute("data-search") || "").toLowerCase();
        const match = !query || hay.includes(query);
        n.style.display = match ? "" : "none";
      });
    }

    searchInput.addEventListener("input", () => applyFilter(searchInput.value));
  }

  function setupContact() {
    if (!contactForm) return;
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const msg = String(fd.get("message") || "").trim();

      const subject = encodeURIComponent(`[Portfólio] ${name}`);
      const body = encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${msg}\n`);
      window.location.href = `mailto:${DEST_EMAIL}?subject=${subject}&body=${body}`;
    });
  }

  setupTheme();
  setupYear();
  setupMenu();
  setupSearch();
  setupContact();
})();
