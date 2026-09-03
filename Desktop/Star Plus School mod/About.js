// ==========================================
// 1. CLOUD DATA FETCHING & DYNAMIC RENDERING
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const siteData = await getSiteData();
    const aboutData = siteData.about;

    if (aboutData) {
      // Populate Hero Section
      const heroTitle = document.querySelector(
        '[data-content-key="about.heroTitle"]',
      );
      const heroText = document.querySelector(
        '[data-content-key="about.heroText"]',
      );
      if (heroTitle && aboutData.hero?.title)
        heroTitle.textContent = aboutData.hero.title;
      if (heroText && aboutData.hero?.subtitle)
        heroText.textContent = aboutData.hero.subtitle;

      // Populate Journey / History Section
      const historyContainer = document.querySelector(".history-container");
      if (historyContainer && aboutData.journey) {
        historyContainer.innerHTML = aboutData.journey
          .map(
            (item) => `
          <div class="history-item">
            <div class="history-year">${item.year}</div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </div>
        `,
          )
          .join("");
      }

      // Populate Core Values Section
      const valuesGrid = document.querySelector(".values-grid");
      if (valuesGrid && aboutData.coreValues) {
        valuesGrid.innerHTML = aboutData.coreValues
          .map(
            (val) => `
          <div class="value-card">
            <div class="value-icon">${val.icon || "🎯"}</div>
            <h3>${val.title}</h3>
            <p>${val.description}</p>
          </div>
        `,
          )
          .join("");
      }

      // Populate Recognitions & Accreditations Section
      const awardsContainer = document.querySelector(".awards-container");
      if (awardsContainer && aboutData.recognitions) {
        awardsContainer.innerHTML = aboutData.recognitions
          .map(
            (rec) => `
          <div class="award-card">
            <div class="award-icon">${rec.icon || "🏆"}</div>
            <h3>${rec.title}</h3>
            <p>${rec.body || rec.description}</p>
          </div>
        `,
          )
          .join("");
      }

      // Populate Leadership Section
      const leadershipGrid = document.querySelector(".leadership-grid");
      if (leadershipGrid && aboutData.leadership) {
        leadershipGrid.innerHTML = aboutData.leadership
          .map(
            (leader) => `
          <div class="leader-card">
            <div class="leader-image">${leader.image ? `<img src="${leader.image}" alt="${leader.name}">` : "👨‍💼"}</div>
            <h3>${leader.name}</h3>
            <p class="leader-title">${leader.title}</p>
            <p class="leader-bio">${leader.bio}</p>
          </div>
        `,
          )
          .join("");
      }

      // Populate Facilities Showcase Section
      const facilitiesGrid = document.querySelector(".facilities-grid");
      if (facilitiesGrid && aboutData.facilities) {
        facilitiesGrid.innerHTML = aboutData.facilities
          .map(
            (facility) => `
          <div class="facility-showcase">
            <div class="facility-img">🏫</div>
            <h3>${facility.name}</h3>
            <p>${facility.description}</p>
          </div>
        `,
          )
          .join("");
      }
    }
  } catch (error) {
    console.error("Error loading About page data from cloud:", error);
  }

  // Initialize UI interactions and observers after content injection
  initUIInteractions();
  console.log("About page loaded successfully");
});

// ==========================================
// 2. UI INTERACTIONS & ANIMATIONS
// ==========================================
function initUIInteractions() {
  // Hamburger Menu Toggle
  const hamburger = document.getElementById("hamburger");
  const navTabs = document.getElementById("navTabs");

  if (hamburger && navTabs) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navTabs.classList.toggle("active");
    });

    const navLinks = navTabs.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navTabs.classList.remove("active");
      });
    });
  }

  // Back to Top Button
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.style.display = "block";
      } else {
        backToTopBtn.style.display = "none";
      }
    });

    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Intersection Observer for Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "slideUp 0.6s ease forwards";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    ".history-item, .value-card, .feature-item, .award-card, .leader-card, .facility-showcase",
  );

  animatedElements.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.animationDelay = `${index * 0.1}s`;
    observer.observe(item);
  });

  // Newsletter Form Submission
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value : "";

      if (validateEmail(email)) {
        const button = newsletterForm.querySelector("button");
        if (button) {
          button.textContent = "Subscribed! ✓";
          button.style.background = "#27ae60";

          setTimeout(() => {
            button.textContent = "Subscribe";
            button.style.background = "";
            newsletterForm.reset();
          }, 2000);
        }
      } else {
        alert("Please enter a valid email address");
      }
    });
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ==========================================
// 3. INJECT DYNAMIC CSS STYLES
// ==========================================
const style = document.createElement("style");
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(10px, 10px);
    }

    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(8px, -8px);
    }

    .feature-item {
        transition: all 0.3s ease;
    }

    #backToTop {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #1e3c72;
        color: white;
        padding: 10px 15px;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 99;
        border: none;
        font-weight: bold;
        transition: all 0.3s ease;
    }

    #backToTop:hover {
        background: #ff6b35;
        transform: translateY(-3px);
    }
`;
document.head.appendChild(style);

// ==========================================
// 4. VIDEO LAZY LOADING
// ==========================================
const videos = document.querySelectorAll("video");
videos.forEach((video) => {
  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    });
    videoObserver.observe(video);
  }
});
