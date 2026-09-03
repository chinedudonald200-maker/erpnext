// // News Page JavaScript

// // Hamburger Menu Toggle
// const hamburger = document.getElementById("hamburger");
// const navTabs = document.getElementById("navTabs");

// if (hamburger) {
//   hamburger.addEventListener("click", () => {
//     hamburger.classList.toggle("active");
//     navTabs.classList.toggle("active");
//   });

//   // Close menu when a link is clicked
//   const navLinks = navTabs.querySelectorAll("a");
//   navLinks.forEach((link) => {
//     link.addEventListener("click", () => {
//       hamburger.classList.remove("active");
//       navTabs.classList.remove("active");
//     });
//   });
// }

// // Smooth scroll for internal links
// document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//   anchor.addEventListener("click", function (e) {
//     const href = this.getAttribute("href");
//     if (href !== "#" && document.querySelector(href)) {
//       e.preventDefault();
//       document.querySelector(href).scrollIntoView({ behavior: "smooth" });
//     }
//   });
// });

// // News Card Animation
// const newsCards = document.querySelectorAll(".news-card");
// const observerOptions = {
//   threshold: 0.1,
//   rootMargin: "0px 0px -50px 0px",
// };

// const observer = new IntersectionObserver((entries) => {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       entry.target.style.animation = "slideUp 0.6s ease forwards";
//       observer.unobserve(entry.target);
//     }
//   });
// }, observerOptions);

// newsCards.forEach((card, index) => {
//   card.style.opacity = "0";
//   card.style.animationDelay = `${index * 0.1}s`;
//   observer.observe(card);

//   // Hover effect
//   card.addEventListener("mouseenter", function () {
//     this.style.transform = "translateY(-10px)";
//     this.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.15)";
//   });

//   card.addEventListener("mouseleave", function () {
//     this.style.transform = "translateY(0)";
//     this.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
//   });
// });

// // Event Cards Animation
// const eventCards = document.querySelectorAll(".event-card");
// eventCards.forEach((card, index) => {
//   card.style.opacity = "0";
//   card.style.animationDelay = `${index * 0.1}s`;
//   observer.observe(card);

//   // Hover effect
//   card.addEventListener("mouseenter", function () {
//     this.style.transform = "translateY(-10px)";
//     this.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.15)";
//   });

//   card.addEventListener("mouseleave", function () {
//     this.style.transform = "translateY(0)";
//     this.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
//   });
// });

// // Filter Functionality
// const filterButtons = document.querySelectorAll(".filter-btn");
// const newsArticles = document.querySelectorAll(".news-card");

// filterButtons.forEach((button) => {
//   button.addEventListener("click", function () {
//     const category = this.getAttribute("data-filter");

//     // Update active button
//     filterButtons.forEach((btn) => btn.classList.remove("active"));
//     this.classList.add("active");

//     // Filter news
//     newsArticles.forEach((article) => {
//       const articleCategory = article.getAttribute("data-category");

//       if (category === "all" || articleCategory === category) {
//         article.style.opacity = "1";
//         article.style.transform = "scale(1)";
//         article.style.display = "block";
//         setTimeout(() => {
//           article.style.animation = "slideUp 0.6s ease";
//         }, 10);
//       } else {
//         article.style.opacity = "0";
//         article.style.transform = "scale(0.95)";
//         setTimeout(() => {
//           article.style.display = "none";
//         }, 300);
//       }
//     });
//   });
// });

// // Read More Modal
// function openArticle(articleId) {
//   const modal = document.getElementById("articleModal");
//   if (modal) {
//     modal.style.display = "block";
//     // You would typically fetch and display full article content here
//     console.log("Opening article:", articleId);
//   }
// }

// function closeArticle() {
//   const modal = document.getElementById("articleModal");
//   if (modal) {
//     modal.style.display = "none";
//   }
// }

// // Close modal when clicking outside
// window.addEventListener("click", (event) => {
//   const modal = document.getElementById("articleModal");
//   if (modal && event.target === modal) {
//     modal.style.display = "none";
//   }
// });

// // Calendar Event Navigation
// const calendarButtons = document.querySelectorAll(".calendar-nav");
// calendarButtons.forEach((button) => {
//   button.addEventListener("click", function () {
//     const action = this.getAttribute("data-action");
//     console.log("Calendar navigation:", action);
//     // Add calendar navigation logic here
//   });
// });

// // Upcoming Events Toggle
// const eventToggle = document.querySelector(".event-toggle");
// if (eventToggle) {
//   eventToggle.addEventListener("change", function () {
//     const upcomingEvents = document.querySelectorAll(".event-card");
//     if (this.checked) {
//       upcomingEvents.forEach((event) => {
//         event.style.display = "block";
//       });
//     } else {
//       upcomingEvents.forEach((event) => {
//         event.style.display = "none";
//       });
//     }
//   });
// }

// // News Search Functionality
// const searchInput = document.querySelector(".news-search");
// if (searchInput) {
//   searchInput.addEventListener("input", function () {
//     const searchTerm = this.value.toLowerCase();

//     newsArticles.forEach((article) => {
//       const title =
//         article.querySelector("h3")?.textContent.toLowerCase() || "";
//       const content =
//         article.querySelector("p")?.textContent.toLowerCase() || "";

//       if (
//         title.includes(searchTerm) ||
//         content.includes(searchTerm) ||
//         searchTerm === ""
//       ) {
//         article.style.display = "block";
//         article.style.opacity = "1";
//       } else {
//         article.style.display = "none";
//         article.style.opacity = "0";
//       }
//     });
//   });
// }

// // Newsletter Subscription
// const newsletterForm = document.querySelector(".newsletter-form");
// if (newsletterForm) {
//   newsletterForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const email = newsletterForm.querySelector('input[type="email"]').value;

//     if (validateEmail(email)) {
//       const button = newsletterForm.querySelector("button");
//       button.textContent = "Subscribed! ✓";
//       button.style.background = "#27ae60";

//       setTimeout(() => {
//         button.textContent = "Subscribe";
//         button.style.background = "";
//         newsletterForm.reset();
//       }, 2000);

//       console.log("Newsletter subscription:", email);
//     } else {
//       alert("Please enter a valid email address");
//     }
//   });
// }

// function validateEmail(email) {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

// // Share Article Functionality
// const shareButtons = document.querySelectorAll(".share-btn");
// shareButtons.forEach((button) => {
//   button.addEventListener("click", function () {
//     const platform = this.getAttribute("data-platform");
//     const title =
//       this.closest(".news-card")?.querySelector("h3")?.textContent ||
//       "Dominion News";

//     if (navigator.share) {
//       navigator.share({
//         title: title,
//         text: "Check out this news from Dominion Primary School",
//         url: window.location.href,
//       });
//     } else {
//       alert(`Share on ${platform}: ${title}`);
//     }
//   });
// });

// // Add CSS Animations
// const style = document.createElement("style");
// style.textContent = `
//     @keyframes slideUp {
//         from {
//             opacity: 0;
//             transform: translateY(30px);
//         }
//         to {
//             opacity: 1;
//             transform: translateY(0);
//         }
//     }

//     @keyframes fadeIn {
//         from {
//             opacity: 0;
//         }
//         to {
//             opacity: 1;
//         }
//     }

//     .hamburger.active span:nth-child(1) {
//         transform: rotate(45deg) translate(10px, 10px);
//     }

//     .hamburger.active span:nth-child(2) {
//         opacity: 0;
//     }

//     .hamburger.active span:nth-child(3) {
//         transform: rotate(-45deg) translate(8px, -8px);
//     }

//     .news-card {
//         transition: all 0.3s ease;
//     }

//     .event-card {
//         transition: all 0.3s ease;
//     }

//     .filter-btn {
//         transition: all 0.3s ease;
//     }

//     .filter-btn.active {
//         background: #1e3c72;
//         color: white;
//     }

//     .read-more {
//         display: inline-block;
//         margin-top: 1rem;
//         color: #1e3c72;
//         font-weight: 600;
//         text-decoration: none;
//         transition: all 0.3s ease;
//     }

//     .read-more:hover {
//         color: #ff6b35;
//         transform: translateX(5px);
//     }

//     #articleModal {
//         display: none;
//         position: fixed;
//         z-index: 1000;
//         left: 0;
//         top: 0;
//         width: 100%;
//         height: 100%;
//         background: rgba(0, 0, 0, 0.5);
//         animation: fadeIn 0.3s ease;
//     }

//     .modal-content {
//         background: white;
//         margin: 5% auto;
//         padding: 2rem;
//         width: 90%;
//         max-width: 800px;
//         border-radius: 12px;
//         max-height: 80vh;
//         overflow-y: auto;
//     }

//     .close {
//         float: right;
//         font-size: 2rem;
//         font-weight: bold;
//         cursor: pointer;
//         color: #1e3c72;
//     }

//     .close:hover {
//         color: #ff6b35;
//     }
// `;
// document.head.appendChild(style);

// // Sort News by Date
// function sortNewsByDate() {
//   const newsContainer = document.querySelector(".news-grid");
//   if (newsContainer) {
//     const cards = Array.from(newsCards);
//     cards.sort((a, b) => {
//       const dateA = new Date(a.querySelector(".news-date")?.textContent || 0);
//       const dateB = new Date(b.querySelector(".news-date")?.textContent || 0);
//       return dateB - dateA;
//     });

//     cards.forEach((card) => newsContainer.appendChild(card));
//   }
// }

// // Initialize page
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("News page loaded successfully");
//   sortNewsByDate(); // Sort news by date on load
// });

// ==========================================
// STARPLUS INTERNATIONAL SCHOOL - NEWS.JS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  renderNewsAndEvents();
});

// Dynamic News & Events Renderer
function renderNewsAndEvents() {
  if (typeof getSiteData !== "function") return;
  const siteData = getSiteData();
  const newsList = siteData?.news?.articles || siteData?.newsEvents || [];
  const container = document.getElementById("news-container");

  if (!container || !Array.isArray(newsList) || newsList.length === 0) return;

  container.innerHTML = newsList
    .map(
      (item) => `
    <div class="event-card">
      <div class="event-date">
        <span class="date-day">${item.day || "01"}</span>
        <span class="date-month">${item.month || "JAN"}</span>
      </div>
      <div class="event-details">
        <h3>${item.title}</h3>
        ${item.time ? `<p class="event-time">🕒 ${item.time}</p>` : ""}
        <p class="event-desc">${item.description || item.desc}</p>
        <a href="#" class="event-btn">Learn More</a>
      </div>
    </div>
  `,
    )
    .join("");
}
