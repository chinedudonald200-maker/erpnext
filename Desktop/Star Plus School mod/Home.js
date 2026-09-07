// ==========================================
// STARPLUS INTERNATIONAL SCHOOL - HOME.JS
// ==========================================

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Newsletter form submission
const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;

    if (email) {
      alert(
        `Thank you for subscribing with ${email}! Check your inbox for updates.`,
      );
      this.reset();
    }
  });
}

// Card animations on scroll via Intersection Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document
  .querySelectorAll(
    ".stat-card, .facility-card, .program-card, .testimonial-card, .teacher-card, .event-card, .gallery-item",
  )
  .forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all 0.6s ease";
    observer.observe(card);
  });

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

const statsSection = document.querySelector(".statistics-section");
if (statsSection) {
  const observer2 = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll(".stat-number").forEach((stat) => {
        const text = stat.textContent;
        const number = parseInt(text.replace(/\D/g, ""));
        if (!isNaN(number)) {
          animateCounter(stat, number);
        }
      });
      observer2.unobserve(statsSection);
    }
  });
  observer2.observe(statsSection);
}

// Active navigation link on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("[id]");
  const navLinks = document.querySelectorAll(".Tabs a");

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= sectionTop - 200) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href && href.startsWith("#") && href.slice(1) === currentSection) {
      link.classList.add("active");
    }
  });
});

// Page load opacity handling
window.addEventListener("load", () => {
  document.body.style.opacity = "1";
});

document.body.style.opacity = "0.95";

console.log("✅ StarPlus International School - Website loaded successfully!");

// Dynamic Educator Card Renderer
function renderEducators() {
  if (typeof getSiteData !== "function") return;
  const siteData = getSiteData();
  const educators = siteData?.homepage?.educators;
  const container = document.getElementById("educators-container");

  if (
    !container ||
    !educators ||
    !Array.isArray(educators) ||
    educators.length === 0
  )
    return;

  container.innerHTML = educators
    .map(
      (edu) => `
<div class="teacher-card">
  <div class="teacher-image">
    <img src="${teacher.image || "default-avatar.png"}" alt="${teacher.name}">
  </div>
  <h3 class="teacher-name">${teacher.name}</h3>
  <p class="teacher-subject">${teacher.subject}</p>
  <p class="teacher-bio">${teacher.bio}</p>
</div>
`,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderEducators();
});
