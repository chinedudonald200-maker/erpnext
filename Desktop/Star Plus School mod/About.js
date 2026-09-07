// Hamburger Menu Toggle, this is for the hamburger toggle for small screens
const hamburger = document.getElementById("hamburger");
const navTabs = document.getElementById("navTabs");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navTabs.classList.toggle("active");
  });

  // Close menu when a link is clicked
  const navLinks = navTabs.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navTabs.classList.remove("active");
    });
  });
}

// Back to Top Button, the button that will take the page to the Hero page
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  backToTopBtn.addEventListener("click", () => {
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

// History Timeline Animation
const historyItems = document.querySelectorAll(".history-item");
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

historyItems.forEach((item, index) => {
  item.style.opacity = "0";
  item.style.animationDelay = `${index * 0.1}s`;
  observer.observe(item);
});

// Value Cards Animation
const valueCards = document.querySelectorAll(".value-card");
valueCards.forEach((card, index) => {
  card.style.opacity = "0";
  card.style.animationDelay = `${index * 0.1}s`;
  observer.observe(card);
});

// Feature Items Animation with Hover Effect
const featureItems = document.querySelectorAll(".feature-item");
featureItems.forEach((item, index) => {
  item.style.opacity = "0";
  item.style.animationDelay = `${index * 0.1}s`;
  observer.observe(item);

  // Hover effect
  item.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px)";
    this.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
  });

  item.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  });
});

// Award Cards Animation
const awardCards = document.querySelectorAll(".award-card");
awardCards.forEach((card, index) => {
  card.style.opacity = "0";
  card.style.animationDelay = `${index * 0.1}s`;
  observer.observe(card);
});

// Leadership Cards Animation
const leaderCards = document.querySelectorAll(".leader-card");
leaderCards.forEach((card, index) => {
  card.style.opacity = "0";
  card.style.animationDelay = `${index * 0.1}s`;
  observer.observe(card);
});

// Facility Showcase Animation
const facilityShowcases = document.querySelectorAll(".facility-showcase");
facilityShowcases.forEach((item, index) => {
  item.style.opacity = "0";
  item.style.animationDelay = `${index * 0.1}s`;
  observer.observe(item);
});

// Newsletter Form Submission
const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;

    if (validateEmail(email)) {
      const button = newsletterForm.querySelector("button");
      button.textContent = "Subscribed! ✓";
      button.style.background = "#27ae60";

      setTimeout(() => {
        button.textContent = "Subscribe";
        button.style.background = "";
        newsletterForm.reset();
      }, 2000);

      console.log("Subscribed:", email);
    } else {
      alert("Please enter a valid email address");
    }
  });
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Add CSS Animations
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

// Counter Animation for stats (if present on page)
function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-count"));
    let current = 0;
    const increment = target / 30;

    const updateCounter = () => {
      current += increment;
      if (current >= target) {
        counter.textContent =
          target + (counter.getAttribute("data-unit") || "");
      } else {
        counter.textContent =
          Math.floor(current) + (counter.getAttribute("data-unit") || "");
        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  });
}

// Trigger counter animation when the element is visible
const statsElements = document.querySelectorAll("[data-count]");
if (statsElements.length > 0) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  statsElements.forEach((el) => {
    statsObserver.observe(el);
  });
}

// Video Lazy Loading
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

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  console.log("About page loaded successfully");
});
