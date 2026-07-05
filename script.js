const resumePath = "assets/AdrianRosipalResume.pdf";
const typingPhrases = [
  "Software Developer at Genetec",
  "Angular · React · TypeScript",
  "Security and finance",
];

let typingPhraseIndex = 0;
let typingCharIndex = 0;
let typingIsDeleting = false;

function downloadResume() {
  const link = document.createElement("a");
  link.href = resumePath;
  link.download = "AdrianRosipalCV.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const nav = document.getElementById("navBar");
  const themeToggle = document.getElementById("themeToggle");
  const themeToggleLabel = themeToggle?.querySelector(".theme-toggle-label");
  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    root.setAttribute("data-theme", savedTheme);
  }

  function updateThemeLabel() {
    if (!themeToggleLabel) return;
    themeToggleLabel.textContent = root.getAttribute("data-theme") === "dark" ? "Dark" : "Light";
  }

  updateThemeLabel();

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    updateThemeLabel();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector(link.getAttribute("href"))?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  function updateNavState() {
    nav?.classList.toggle("scrolled", window.scrollY > 10);

    const activeSection = sections.reduce((current, section) => {
      return window.scrollY + 160 >= section.offsetTop ? section : current;
    }, sections[0]);

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${activeSection?.id}`);
    });
  }

  updateNavState();
  window.addEventListener("scroll", updateNavState, { passive: true });

  document.getElementById("resume")?.addEventListener("click", downloadResume);
  document.getElementById("downloadResumeBtn")?.addEventListener("click", downloadResume);

  document.querySelectorAll(".tech-stack li").forEach((item) => {
    const img = item.querySelector("img");
    const hoverSrc = item.dataset.hoverSrc;
    if (!img || !hoverSrc) return;

    const originalSrc = img.getAttribute("src");
    const preload = new Image();
    preload.src = hoverSrc;

    item.tabIndex = 0;
    item.dataset.originalSrc = originalSrc;

    const showColoredIcon = () => img.setAttribute("src", hoverSrc);
    const showDefaultIcon = () => img.setAttribute("src", item.dataset.originalSrc);

    item.addEventListener("mouseenter", showColoredIcon);
    item.addEventListener("mouseleave", showDefaultIcon);
    item.addEventListener("focus", showColoredIcon);
    item.addEventListener("blur", showDefaultIcon);
  });

  const switcherButtons = document.querySelectorAll(".switcher-button");
  const tabPanels = document.querySelectorAll(".tab-panel");

  switcherButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      switcherButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      tabPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === `${target}-content`);
      });
    });
  });

  const revealables = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const typingElement = document.getElementById("typing-effect");

  function runTypingEffect() {
    if (!typingElement) return;

    const phrase = typingPhrases[typingPhraseIndex];
    if (typingIsDeleting) {
      typingCharIndex -= 1;
    } else {
      typingCharIndex += 1;
    }

    typingElement.textContent = phrase.slice(0, typingCharIndex);

    let delay = typingIsDeleting ? 45 : 85;
    if (!typingIsDeleting && typingCharIndex === phrase.length) {
      typingIsDeleting = true;
      delay = 1300;
    } else if (typingIsDeleting && typingCharIndex === 0) {
      typingIsDeleting = false;
      typingPhraseIndex = (typingPhraseIndex + 1) % typingPhrases.length;
      delay = 250;
    }

    window.setTimeout(runTypingEffect, delay);
  }

  if (prefersReducedMotion && typingElement) {
    typingElement.textContent = typingPhrases[0];
  } else {
    runTypingEffect();
  }

  if (prefersReducedMotion) {
    revealables.forEach((element) => element.classList.add("show"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealables.forEach((element) => observer.observe(element));
  }

  const form = document.getElementById("contactForm");
  if (!form) return;

  let status = form.querySelector(".form-status");
  if (!status) {
    status = document.createElement("div");
    status.className = "form-status";
    form.appendChild(status);
  }

  function showStatus(message, kind) {
    status.textContent = message;
    status.dataset.kind = kind;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showStatus("Sending...", "info");

    const formData = new FormData(form);
    const action = form.getAttribute("action") || "";
    const method = (form.getAttribute("method") || "POST").toUpperCase();

    function openEmailFallback() {
      const name = formData.get("name") || "";
      const email = formData.get("email") || "";
      const message = formData.get("message") || "";
      const subject = encodeURIComponent("Portfolio contact");
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:adrian.rosipal98@gmail.com?subject=${subject}&body=${body}`;
      showStatus("Opening your email client...", "info");
    }

    if (!/formspree\.io\/f\//.test(action)) {
      openEmailFallback();
      return;
    }

    try {
      const response = await fetch(action, {
        method,
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!response.ok) {
        openEmailFallback();
        return;
      }

      form.reset();
      showStatus("Thanks. I will get back to you soon.", "success");
    } catch {
      openEmailFallback();
    }
  });
});
