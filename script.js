const textArray = [
  "Frontend developer at Amadeus",
  "Angular • React • TypeScript",
  "Aviation and finance",
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100; // Typing speed in ms
const deletingSpeed = 50; // Deleting speed in ms
const delayBetweenWords = 1500; // Delay before deleting

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-bar a");
  for (const link of navLinks) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      window.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
    });
  }
});

// Theme toggle: system preference + persistence
document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const saved = localStorage.getItem("theme");
  if (saved === "dark") root.setAttribute("data-theme", "dark");
  if (saved === "light") root.setAttribute("data-theme", "light");

  toggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
});

// Scroll spy + nav backdrop on scroll
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.getElementById("navBar");
  const links = Array.from(document.querySelectorAll(".nav-bar a"));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function updateActiveLink() {
    const scrollPos = window.scrollY + 100; // offset for sticky nav
    let currentId = sections[0]?.id;
    for (const section of sections) {
      if (scrollPos >= section.offsetTop) currentId = section.id;
    }
    links.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${currentId}`);
    });
  }

  function updateNavBackdrop() {
    if (window.scrollY > 10) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }

  updateActiveLink();
  updateNavBackdrop();
  window.addEventListener("scroll", () => {
    updateActiveLink();
    updateNavBackdrop();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const listItems = document.querySelectorAll(".tech-stack li");

  listItems.forEach((item) => {
    const img = item.querySelector("img");
    const originalSrc = img.src;
    const hoverSrc = item.dataset.hoverSrc;

    item.addEventListener("mouseenter", function () {
      img.src = hoverSrc;
    });

    item.addEventListener("mouseleave", function () {
      img.src = originalSrc;
    });
  });
});

function typeEffect() {
  const typingElement = document.getElementById("typing-effect");
  const currentText = textArray[textIndex];

  if (isDeleting) {
    typingElement.innerText = currentText.substring(0, charIndex--);
  } else {
    charIndex++;
    typingElement.innerText = currentText.substring(0, charIndex);
  }

  let delay = isDeleting ? deletingSpeed : typingSpeed;

  if (!isDeleting && charIndex === currentText.length) {
    delay = delayBetweenWords;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % textArray.length;
  }

  setTimeout(typeEffect, delay);
}

document.addEventListener("DOMContentLoaded", typeEffect);

// document.addEventListener("DOMContentLoaded", function() {
//     const contactItems= document.querySelectorAll('.contact-header div');
//     contactItems.forEach(item => {
//         const img = item.querySelector('img');
//         const originalSrc = img.src
//         const hoverSrc = item.dataset.hoverSrc;

//         item.addEventListener('mouseenter', function(){
//             img.src = hoverSrc
//         })
//         item.addEventListener('mouseleave', function(){
//             img.src = originalSrc
//         })
//     })
// })

document.getElementById("resume").addEventListener("click", function () {
  // Create a link element
  const link = document.createElement("a");
  link.href = "assets/AdrianRosipalResume.pdf"; // Adjust the path if necessary
  link.download = "AdrianRosipalCV.pdf"; // The name of the downloaded file

  // Append to the body, trigger download, and remove the link
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Wire hero resume button to existing download logic
document.addEventListener("DOMContentLoaded", function () {
  const heroBtn = document.getElementById("downloadResumeBtn");
  const resume = document.getElementById("resume");
  if (heroBtn && resume) {
    heroBtn.addEventListener("click", () => {
      resume.click();
    });
  }
});

// IntersectionObserver reveal animations
document.addEventListener("DOMContentLoaded", function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return; // Respect user preference

  const revealables = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealables.forEach((el) => observer.observe(el));
});

// Projects carousel controls (CSS scroll-snap powered)
document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("project-segment");
  const prev = document.getElementById("prevProjects");
  const next = document.getElementById("nextProjects");
  if (!track || !prev || !next) return;

  function scrollByAmount(dir) {
    const amount = Math.max(320, Math.floor(track.clientWidth * 0.9));
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  prev.addEventListener("click", () => scrollByAmount(-1));
  next.addEventListener("click", () => scrollByAmount(1));
});

// Contact form: AJAX submit to Formspree with graceful fallback
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  // Create/locate status element
  let status = form.querySelector(".form-status");
  if (!status) {
    status = document.createElement("div");
    status.className = "form-status";
    form.appendChild(status);
  }

  function showStatus(message, kind) {
    status.textContent = message;
    status.setAttribute("data-kind", kind);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showStatus("Sending…", "info");

    const action = form.getAttribute("action") || "";
    const method = (form.getAttribute("method") || "POST").toUpperCase();
    const formData = new FormData(form);

    const emailFallback = () => {
      const name = encodeURIComponent(formData.get("name") || "");
      const email = encodeURIComponent(formData.get("email") || "");
      const message = encodeURIComponent(formData.get("message") || "");
      const subject = encodeURIComponent("Portfolio contact");
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:adrian.rosipal98@gmail.com?subject=${subject}&body=${body}`;
      showStatus("Opening your email client…", "info");
    };

    // If no valid Formspree endpoint, fallback immediately
    if (!/formspree\.io\/f\//.test(action)) {
      emailFallback();
      return;
    }

    try {
      const res = await fetch(action, {
        method,
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (res.ok) {
        form.reset();
        showStatus("Thanks! I’ll get back to you soon.", "success");
      } else {
        // 404 (form not found) or any error -> fallback
        emailFallback();
      }
    } catch (err) {
      emailFallback();
    }
  });
});
