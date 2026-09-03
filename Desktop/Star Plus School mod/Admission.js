// Wrap in an IIFE to avoid global variable collisions with Home.js
(() => {
  // Dynamic Content Synchronization with Super Admin Data
  function renderDynamicAdmissionData() {
    if (typeof getSiteData !== "function") return;
    const siteData = getSiteData();
    const admissionData = siteData?.admission;

    if (!admissionData) return;

    // 1. Requirements Section
    if (
      admissionData.requirements &&
      Array.isArray(admissionData.requirements) &&
      admissionData.requirements.length > 0
    ) {
      const reqContainer = document.getElementById("requirements-container");
      if (reqContainer) {
        reqContainer.innerHTML = admissionData.requirements
          .map(
            (req) => `
          <div class="requirement-card">
            <div class="requirement-icon">📋</div>
            <h3>${req.category || "Requirement"}</h3>
            <p style="padding: 10px 0; color: #555;">${req.details || req}</p>
          </div>
        `,
          )
          .join("");
      }
    }

    // 2. Admission Steps
    if (
      admissionData.steps &&
      Array.isArray(admissionData.steps) &&
      admissionData.steps.length > 0
    ) {
      const stepsContainer = document.getElementById("steps-container");
      if (stepsContainer) {
        stepsContainer.innerHTML = admissionData.steps
          .map(
            (step, idx) => `
          <div class="timeline-item">
            <div class="timeline-marker ${
              idx % 2 === 0 ? "timeline-marker-left" : "timeline-marker-right"
            }">${step.stepNumber || idx + 1}</div>
            <div class="timeline-content">
              <h3>${step.title || "Step " + (idx + 1)}</h3>
              <p>${step.description || ""}</p>
            </div>
          </div>
        `,
          )
          .join("");
      }
    }

    // 3. Available Classes
    if (
      admissionData.availableClasses &&
      Array.isArray(admissionData.availableClasses) &&
      admissionData.availableClasses.length > 0
    ) {
      const classesContainer = document.getElementById("classes-container");
      if (classesContainer) {
        classesContainer.innerHTML = admissionData.availableClasses
          .map(
            (cls) => `
          <div class="class-level-card">
            <span class="class-badge">${cls.className || "Class"}</span>
            <h3>${cls.className || "Class"}</h3>
            <div class="class-info">
              <p><strong>Age Group:</strong> ${cls.ageGroup || "N/A"}</p>
              <p><strong>Capacity:</strong> ${cls.capacity || "N/A"}</p>
            </div>
          </div>
        `,
          )
          .join("");
      }
    }

    // 4. FAQs
    if (
      admissionData.faqs &&
      Array.isArray(admissionData.faqs) &&
      admissionData.faqs.length > 0
    ) {
      const faqContainer = document.getElementById("faq-container");
      if (faqContainer) {
        faqContainer.innerHTML = admissionData.faqs
          .map(
            (faq) => `
          <div class="faq-item">
            <div class="faq-question">
              <span>${faq.question}</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <p>${faq.answer}</p>
            </div>
          </div>
        `,
          )
          .join("");
      }
    }

    // Re-attach Accordion Events after rendering dynamic HTML
    setupFaqAccordion();
  }

  // FAQ Accordion Handler
  function setupFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      if (!question || !answer) return;

      const newQuestion = question.cloneNode(true);
      question.parentNode.replaceChild(newQuestion, question);

      newQuestion.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        // Close all other open items
        faqItems.forEach((otherItem) => {
          otherItem.classList.remove("active");
          const otherAnswer = otherItem.querySelector(".faq-answer");
          const otherToggle = otherItem.querySelector(".faq-toggle");
          if (otherAnswer) {
            otherAnswer.style.maxHeight = "0px";
            otherAnswer.style.opacity = "0";
          }
          if (otherToggle) otherToggle.textContent = "+";
        });

        if (!isOpen) {
          item.classList.add("active");
          answer.style.maxHeight = answer.scrollHeight + "px";
          answer.style.opacity = "1";
          const toggle = newQuestion.querySelector(".faq-toggle");
          if (toggle) toggle.textContent = "-";
        }
      });
    });
  }

  // Save Form Submissions into LocalStorage for Admin Dashboard
  function setupAdmissionForm() {
    const admissionForm = document.querySelector(".admission-form");
    if (!admissionForm) return;

    admissionForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = admissionForm.querySelector('button[type="submit"]');
      const originalText = submitBtn
        ? submitBtn.textContent
        : "Submit Application";
      if (submitBtn) {
        submitBtn.textContent = "Submitting...";
        submitBtn.disabled = true;
      }

      const formData = new FormData(admissionForm);
      const applicationData = Object.fromEntries(formData);
      applicationData.submittedAt = new Date().toLocaleString();

      // Store in array under key 'admission_applications'
      const existingApps =
        JSON.parse(localStorage.getItem("admission_applications")) || [];
      existingApps.unshift(applicationData);
      localStorage.setItem(
        "admission_applications",
        JSON.stringify(existingApps),
      );

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
        alert(
          "Thank you! Your admission application has been submitted successfully.",
        );
        admissionForm.reset();
      }, 1000);
    });
  }

  // Execute when DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    renderDynamicAdmissionData();
    setupFaqAccordion();
    setupAdmissionForm();
  });
})();
