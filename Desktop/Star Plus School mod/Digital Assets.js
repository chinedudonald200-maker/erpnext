// ==========================================
// STARPLUS INTERNATIONAL SCHOOL - DIGITAL ASSETS.JS
// ==========================================

// Feature item entrance animations via Intersection Observer
document.addEventListener("DOMContentLoaded", () => {
  const featureItems = document.querySelectorAll(".feature-item");

  if (featureItems.length > 0) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observerInstance.unobserve(entry.target);
        }
      });
    }, observerOptions);

    featureItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(30px)";
      item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(item);
    });
  }
});
