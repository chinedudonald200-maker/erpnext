document.addEventListener("DOMContentLoaded", () => {
  renderDynamicContent();
});

function renderDynamicContent() {
  const data = typeof getSiteData === "function" ? getSiteData() : null;
  if (!data) return;

  // ==========================================
  // 1. HOME PAGE (index.html)
  // ==========================================

  // Hero Section
  const heroTitle = document.querySelector(
    '[data-content-key="home.heroTitle"]',
  );
  const heroText = document.querySelector('[data-content-key="home.heroText"]');
  if (heroTitle && data.homepage?.hero?.title) {
    heroTitle.textContent = data.homepage.hero.title;
  }
  if (heroText && data.homepage?.hero?.subtitle) {
    heroText.textContent = data.homepage.hero.subtitle;
  }

  // Welcome / Mission Section
  const welHeading = document.querySelector(
    '[data-content-key="home.welcomeHeading"]',
  );
  const welBody = document.querySelector(
    '[data-content-key="home.welcomeBody"]',
  );
  if (welHeading && data.homepage?.welcomeSection?.heading) {
    welHeading.textContent = data.homepage.welcomeSection.heading;
  }
  if (welBody && data.homepage?.welcomeSection?.body) {
    welBody.textContent = data.homepage.welcomeSection.body;
  }

  // Meet Our Educators
  const eduContainer =
    document.getElementById("educators-container") ||
    document.querySelector(".teachers-container");
  if (
    eduContainer &&
    data.homepage?.educators &&
    Array.isArray(data.homepage.educators) &&
    data.homepage.educators.length > 0
  ) {
    eduContainer.innerHTML = data.homepage.educators
      .map(
        (edu) => `
      <div class="teacher-card">
        <div class="teacher-image">
          <img src="${edu.image || "Italian.jpg"}" alt="${edu.name}" class="Ita" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;" />
        </div>
        <h3 class="teacher-name">${edu.name}</h3>
        <p class="teacher-subject">${edu.position}</p>
        <p class="teacher-bio">${edu.bio}</p>
        <div class="teacher-social">
          ${edu.email ? `<a href="mailto:${edu.email}">📧</a>` : `<a href="#">📧</a>`}
          ${edu.phone ? `<a href="tel:${edu.phone}">🔗</a>` : `<a href="#">🔗</a>`}
        </div>
      </div>
    `,
      )
      .join("");
  }

  // Testimonials
  const testContainer = document.querySelector(".testimonials-container");
  if (
    testContainer &&
    data.homepage?.testimonials &&
    data.homepage.testimonials.length > 0
  ) {
    testContainer.innerHTML = data.homepage.testimonials
      .map(
        (t) => `
      <div class="testimonial-card">
        <p class="testimonial-text">"${t.text}"</p>
        <h4 class="testimonial-author">- ${t.author}</h4>
        <p class="testimonial-role">${t.role}</p>
      </div>
    `,
      )
      .join("");
  }

  // ==========================================
  // 2. ADMISSION PAGE (Admission.html)
  // ==========================================

  // Admission Requirements
  const reqContainer =
    document.getElementById("requirements-container") ||
    document.querySelector(".requirements-grid");
  if (
    reqContainer &&
    data.admission?.requirements &&
    data.admission.requirements.length > 0
  ) {
    reqContainer.innerHTML = data.admission.requirements
      .map(
        (r) => `
      <div class="requirement-card">
        <div class="requirement-icon">📋</div>
        <h3>${r.category || "Requirement"}</h3>
        <p style="padding: 10px 0; color: #555;">${r.details || r}</p>
      </div>
    `,
      )
      .join("");
  }

  // Admission Steps
  const stepsContainer =
    document.getElementById("steps-container") ||
    document.querySelector(".timeline");
  if (
    stepsContainer &&
    data.admission?.steps &&
    data.admission.steps.length > 0
  ) {
    stepsContainer.innerHTML = data.admission.steps
      .map(
        (s, idx) => `
      <div class="timeline-item">
        <div class="timeline-marker ${idx % 2 === 0 ? "timeline-marker-left" : "timeline-marker-right"}">${s.stepNumber || idx + 1}</div>
        <div class="timeline-content">
          <h3>${s.title}</h3>
          <p>${s.description}</p>
        </div>
      </div>
    `,
      )
      .join("");
  }

  // Available Classes
  const classContainer =
    document.getElementById("classes-container") ||
    document.querySelector(".class-levels-grid");
  if (
    classContainer &&
    data.admission?.availableClasses &&
    data.admission.availableClasses.length > 0
  ) {
    classContainer.innerHTML = data.admission.availableClasses
      .map(
        (c) => `
      <div class="class-level-card">
        <span class="class-badge">${c.className}</span>
        <h3>${c.className}</h3>
        <div class="class-info">
          <p><strong>Age Group:</strong> ${c.ageGroup}</p>
          <p><strong>Capacity:</strong> ${c.capacity}</p>
        </div>
      </div>
    `,
      )
      .join("");
  }

  // FAQs (Preserves Accordion Structure)
  const faqContainer =
    document.getElementById("faq-container") ||
    document.querySelector(".faq-container");
  if (faqContainer && data.admission?.faqs && data.admission.faqs.length > 0) {
    faqContainer.innerHTML = data.admission.faqs
      .map(
        (f) => `
      <div class="faq-item">
        <div class="faq-question">
          <span>${f.question}</span>
          <span class="faq-toggle">+</span>
        </div>
        <div class="faq-answer">
          <p>${f.answer}</p>
        </div>
      </div>
    `,
      )
      .join("");
  }

  // ==========================================
  // 3. NEWS & EVENTS PAGE
  // ==========================================

  const eventContainers = document.querySelectorAll(
    ".events-list-container, .events-container",
  );
  if (
    eventContainers.length > 0 &&
    data.newsEvents?.upcomingEvents &&
    data.newsEvents.upcomingEvents.length > 0
  ) {
    const eventsHTML = data.newsEvents.upcomingEvents
      .map((e) => {
        const dateObj = new Date(e.date);
        const day = isNaN(dateObj.getDate())
          ? "--"
          : String(dateObj.getDate()).padStart(2, "0");
        const month = isNaN(dateObj.getMonth())
          ? "MMM"
          : dateObj.toLocaleString("default", { month: "short" }).toUpperCase();

        return `
        <div class="event-showcase-card event-card">
          <div class="event-time-badge event-date">
            <span class="day date-day">${day}</span>
            <span class="month date-month">${month}</span>
          </div>
          <div class="event-details-showcase event-details">
            <h3>${e.title}</h3>
            <p class="event-venue event-time">📍 ${e.location || "School Premises"} | ⏰ ${e.time || "TBA"}</p>
            <p class="event-description event-desc">${e.description}</p>
          </div>
        </div>
      `;
      })
      .join("");

    eventContainers.forEach((container) => {
      container.innerHTML = eventsHTML;
    });

    renderDynamicCalendar(
      data.newsEvents.upcomingEvents,
      data.newsEvents.calendarTitle,
    );
  }

  // News Articles
  const newsContainer = document.querySelector(".news-articles-container");
  if (
    newsContainer &&
    data.newsEvents?.newsArticles &&
    data.newsEvents.newsArticles.length > 0
  ) {
    newsContainer.innerHTML = data.newsEvents.newsArticles
      .map(
        (n) => `
      <div class="news-card">
        <div class="news-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display:flex; align-items:center; justify-content:center; font-size: 2rem;">📰</div>
        <div class="news-content">
          <span class="news-date">${n.date}</span>
          <h3>${n.title}</h3>
          <p>${n.summary}</p>
          <a href="#" class="read-more">Read More →</a>
        </div>
      </div>
    `,
      )
      .join("");
  }
}

function renderDynamicCalendar(eventsList, calendarTitle) {
  const calendarHeading = document.querySelector(".calendar h3");
  const calendarGrid = document.querySelector(".calendar-grid");
  const highlightedList = document.querySelector(".calendar-events-list");

  if (calendarHeading && calendarTitle) {
    calendarHeading.textContent = calendarTitle;
  }

  if (!calendarGrid || !eventsList) return;

  const highlightedDays = eventsList.map((e) => {
    const d = new Date(e.date);
    return d.getDate();
  });

  let daysHTML = `
    <div class="weekday">Sun</div>
    <div class="weekday">Mon</div>
    <div class="weekday">Tue</div>
    <div class="weekday">Wed</div>
    <div class="weekday">Thu</div>
    <div class="weekday">Fri</div>
    <div class="weekday">Sat</div>
    <div class="calendar-day">31</div>
  `;

  for (let day = 1; day <= 30; day++) {
    const isHighlighted = highlightedDays.includes(day);
    daysHTML += `<div class="calendar-day ${isHighlighted ? "has-event highlighted" : ""}">${day}</div>`;
  }
  calendarGrid.innerHTML = daysHTML;

  if (highlightedList) {
    highlightedList.innerHTML = eventsList
      .map((e) => `<li><strong>${e.date}:</strong> ${e.title}</li>`)
      .join("");
  }
}
