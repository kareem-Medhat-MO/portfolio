const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const typingText = document.querySelector(".typing-text");
const navLinks = [...document.querySelectorAll(".navbar .nav-link")];
const navCollapse = document.querySelector("#site-nav");
const navToggle = document.querySelector(".navbar-toggler");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const useLightTheme = root.dataset.theme !== "light";
    root.dataset.theme = useLightTheme ? "light" : "dark";
    themeToggle.setAttribute("aria-pressed", String(useLightTheme));

    const nextTheme = useLightTheme ? "dark" : "light";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    themeToggle.title = `Switch to ${nextTheme} theme`;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      useLightTheme ? "#f4f3ff" : "#07081b",
    );
  });
}

if (typingText && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const title = typingText.textContent;
  typingText.textContent = "";
  let characterIndex = 0;

  const typeNextCharacter = () => {
    if (characterIndex >= title.length) {
      return;
    }

    typingText.textContent += title[characterIndex];
    characterIndex += 1;
    window.setTimeout(typeNextCharacter, 85);
  };

  window.setTimeout(typeNextCharacter, 350);
}

if (navCollapse && navToggle) {
  const closeNavigation = () => {
    navCollapse.classList.remove("show");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navCollapse.classList.toggle("show", !isExpanded);
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navToggle.getAttribute("aria-expanded") === "true") {
        closeNavigation();
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      closeNavigation();
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 992px)").matches) {
      closeNavigation();
    }
  });
}

const navigationSections = ["home", "about", "projects", "journey", "contact"]
  .map((sectionId) => document.getElementById(sectionId))
  .filter(Boolean);

const updateActiveNavigation = () => {
  const header = document.querySelector(".site-header");
  const activationPoint = window.scrollY + (header?.offsetHeight ?? 0) + 30;
  let currentSection = navigationSections[0];

  navigationSections.forEach((section) => {
    if (section.getBoundingClientRect().top + window.scrollY <= activationPoint) {
      currentSection = section;
    }
  });

  if (!currentSection) {
    return;
  }

  const currentId = currentSection.id === "about" && window.location.hash === "#skills"
    ? "#skills"
    : `#${currentSection.id}`;

  navLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === currentId;
    link.classList.toggle("active", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

let navigationUpdateScheduled = false;
window.addEventListener("scroll", () => {
  if (navigationUpdateScheduled) {
    return;
  }

  navigationUpdateScheduled = true;
  window.requestAnimationFrame(() => {
    navigationUpdateScheduled = false;
    updateActiveNavigation();
  });
}, { passive: true });

window.addEventListener("hashchange", updateActiveNavigation);
window.addEventListener("resize", updateActiveNavigation);
updateActiveNavigation();
