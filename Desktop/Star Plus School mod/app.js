// ==========================================
// STARPLUS INTERNATIONAL SCHOOL - MAIN APP.JS
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
  setupMobileNavigation();
  setupBackToTop();
  await applyGlobalDynamicData();
});

// Mobile Hamburger Menu Toggle
function setupMobileNavigation() {
  const hamburger = document.getElementById("hamburger");
  const navTabs = document.getElementById("navTabs");

  if (hamburger && navTabs) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navTabs.classList.toggle("active");
    });

    // Close menu when clicking a link on mobile
    navTabs.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navTabs.classList.remove("active");
      });
    });
  }
}

// Back to Top Button Functionality
function setupBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  });
}

// Apply Global Content & Dynamic Data Attributes
async function applyGlobalDynamicData() {
  if (typeof getSiteData !== "function") return;

  const siteData = await getSiteData();
  if (!siteData) return;

  // Handle data-content-key attributes site-wide
  document.querySelectorAll("[data-content-key]").forEach((el) => {
    const key = el.getAttribute("data-content-key");
    const keys = key.split(".");
    let value = siteData;

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        value = null;
        break;
      }
    }

    if (value !== null && typeof value === "string") {
      el.textContent = value;
    }
  });

  // Populate Hero Section dynamically[cite: 8, 10]
  const heroTitle = document.querySelector("#hero-title");
  const heroSubtitle = document.querySelector("#hero-subtitle");

  if (heroTitle && siteData.homepage?.hero) {
    heroTitle.textContent = siteData.homepage.hero.title;
  }

  if (heroSubtitle && siteData.homepage?.hero) {
    heroSubtitle.textContent = siteData.homepage.hero.subtitle;
  }

  // Populate Welcome Section dynamically[cite: 8, 10]
  const welcomeHeading = document.querySelector("#welcome-heading");
  const welcomeBody = document.querySelector("#welcome-body");

  if (welcomeHeading && siteData.homepage?.welcomeSection) {
    welcomeHeading.textContent = siteData.homepage.welcomeSection.heading;
  }

  if (welcomeBody && siteData.homepage?.welcomeSection) {
    welcomeBody.textContent = siteData.homepage.welcomeSection.body;
  }
}
