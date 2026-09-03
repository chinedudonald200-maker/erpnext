// ==========================================
// 1. INITIALIZATION & TAB SWITCHING
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  renderAdminLists();
  renderSubmittedApplications();
  setupFormHandlers();
});

function switchTab(tabId) {
  document
    .querySelectorAll(".tab-content")
    .forEach((el) => el.classList.remove("active"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((el) => el.classList.remove("active"));

  const targetTab = document.getElementById(tabId);
  if (targetTab) targetTab.classList.add("active");

  if (event && event.currentTarget) {
    event.currentTarget.classList.add("active");
  }
}

// ==========================================
// 2. ITEM MANAGEMENT (SAVE, DELETE, EDIT)
// ==========================================
function saveItem(targetPath, itemData, idInputId, formElement) {
  const data = getSiteData();
  const keys = targetPath.split(".");

  if (!data[keys[0]]) data[keys[0]] = {};
  if (!data[keys[0]][keys[1]]) data[keys[0]][keys[1]] = [];

  let targetArray = data[keys[0]][keys[1]];
  const existingId = document.getElementById(idInputId).value;

  if (existingId) {
    const index = targetArray.findIndex((item) => item.id == existingId);
    if (index !== -1) {
      itemData.id = Number(existingId);
      targetArray[index] = itemData;
    }
  } else {
    itemData.id = Date.now();
    targetArray.push(itemData);
  }

  saveSiteData(data);
  formElement.reset();
  document.getElementById(idInputId).value = "";
  renderAdminLists();
}

function deleteItem(targetPath, id) {
  const data = getSiteData();
  const keys = targetPath.split(".");
  if (data[keys[0]] && data[keys[0]][keys[1]]) {
    data[keys[0]][keys[1]] = data[keys[0]][keys[1]].filter(
      (item) => item.id !== id,
    );
    saveSiteData(data);
    renderAdminLists();
  }
}

function editItem(targetPath, id, fillFormCallback) {
  const data = getSiteData();
  const keys = targetPath.split(".");
  if (data[keys[0]] && data[keys[0]][keys[1]]) {
    const item = data[keys[0]][keys[1]].find((i) => i.id === id);
    if (item) fillFormCallback(item);
  }
}

// ==========================================
// 3. APPLICATIONS MANAGEMENT
// ==========================================
function renderSubmittedApplications() {
  const tableBody = document.getElementById("list-applications");
  if (!tableBody) return;

  const applications =
    JSON.parse(localStorage.getItem("admission_applications")) || [];

  if (applications.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:15px;">No applications received yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = applications
    .map(
      (app, index) => `
    <tr>
      <td style="padding:8px; border:1px solid #ddd;">${app.submittedAt || "N/A"}</td>
      <td style="padding:8px; border:1px solid #ddd;"><strong>${app.studentName || "N/A"}</strong></td>
      <td style="padding:8px; border:1px solid #ddd;">${app.applyClass || "N/A"}</td>
      <td style="padding:8px; border:1px solid #ddd;">${app.parentName || "N/A"}</td>
      <td style="padding:8px; border:1px solid #ddd;">${app.phone || "N/A"}<br><small>${app.email || ""}</small></td>
      <td style="padding:8px; border:1px solid #ddd;">
        <button class="delete-btn" onclick="deleteApplication(${index})">Delete</button>
      </td>
    </tr>
  `,
    )
    .join("");
}

function deleteApplication(index) {
  let applications =
    JSON.parse(localStorage.getItem("admission_applications")) || [];
  applications.splice(index, 1);
  localStorage.setItem("admission_applications", JSON.stringify(applications));
  renderSubmittedApplications();
}

function clearAllApplications() {
  if (confirm("Are you sure you want to clear all form submissions?")) {
    localStorage.removeItem("admission_applications");
    renderSubmittedApplications();
  }
}

// ==========================================
// 4. IMAGE COMPRESSOR UTILITY
// ==========================================
function compressAndSetImage(fileInput, targetInputId) {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (event) {
    const img = new Image();
    img.src = event.target.result;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 300;
      const MAX_HEIGHT = 300;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      const targetInput = document.getElementById(targetInputId);
      if (targetInput) targetInput.value = dataUrl;
    };
  };
}

// ==========================================
// 5. FORM SUBMISSION EVENT HANDLERS
// ==========================================
function setupFormHandlers() {
  // Educators Image Compressor
  const eduFile = document.getElementById("edu-file");
  if (eduFile) {
    eduFile.addEventListener("change", function () {
      compressAndSetImage(this, "edu-image");
    });
  }

  // Educators Form
  const eduForm = document.getElementById("form-educators");
  if (eduForm) {
    eduForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "homepage.educators",
        {
          name: document.getElementById("edu-name").value,
          position: document.getElementById("edu-position").value,
          bio: document.getElementById("edu-bio").value,
          email: document.getElementById("edu-email").value,
          phone: document.getElementById("edu-phone").value,
          image: document.getElementById("edu-image").value,
        },
        "edu-id",
        this,
      );
    });
  }

  // Calendar Header Form
  const calForm = document.getElementById("form-calendar-header");
  if (calForm) {
    calForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = getSiteData();
      if (!data.newsEvents) data.newsEvents = {};
      data.newsEvents.calendarTitle =
        document.getElementById("cal-heading").value;
      saveSiteData(data);
      alert("Calendar Title Updated Successfully!");
    });
  }

  // Hero Banner Form
  const heroForm = document.getElementById("form-hero");
  if (heroForm) {
    heroForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = getSiteData();
      if (!data.homepage) data.homepage = {};
      data.homepage.hero = {
        title: document.getElementById("hero-title").value,
        subtitle: document.getElementById("hero-sub").value,
      };
      saveSiteData(data);
      alert("Hero banner updated!");
    });
  }

  // Welcome Section Form
  const welcomeForm = document.getElementById("form-welcome");
  if (welcomeForm) {
    welcomeForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = getSiteData();
      if (!data.homepage) data.homepage = {};
      data.homepage.welcomeSection = {
        heading: document.getElementById("wel-head").value,
        body: document.getElementById("wel-body").value,
      };
      saveSiteData(data);
      alert("Welcome section updated!");
    });
  }

  // Testimonials Form
  const testForm = document.getElementById("form-testimonials");
  if (testForm) {
    testForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "homepage.testimonials",
        {
          author: document.getElementById("tst-author").value,
          role: document.getElementById("tst-role").value,
          text: document.getElementById("tst-text").value,
        },
        "tst-id",
        this,
      );
    });
  }

  // About Page Forms
  const journeyForm = document.getElementById("form-journey");
  if (journeyForm) {
    journeyForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "about.journey",
        {
          year: document.getElementById("jny-year").value,
          title: document.getElementById("jny-title").value,
          description: document.getElementById("jny-desc").value,
        },
        "jny-id",
        this,
      );
    });
  }

  const valuesForm = document.getElementById("form-values");
  if (valuesForm) {
    valuesForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "about.coreValues",
        {
          title: document.getElementById("val-title").value,
          description: document.getElementById("val-desc").value,
        },
        "val-id",
        this,
      );
    });
  }

  const recForm = document.getElementById("form-recognitions");
  if (recForm) {
    recForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "about.recognitions",
        {
          title: document.getElementById("rec-title").value,
          body: document.getElementById("rec-body").value,
          icon: document.getElementById("rec-icon").value,
        },
        "rec-id",
        this,
      );
    });
  }

  const ldrForm = document.getElementById("form-leadership");
  if (ldrForm) {
    ldrForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "about.leadership",
        {
          name: document.getElementById("ldr-name").value,
          title: document.getElementById("ldr-title").value,
          bio: document.getElementById("ldr-bio").value,
          image: document.getElementById("ldr-image").value,
        },
        "ldr-id",
        this,
      );
    });
  }

  const facForm = document.getElementById("form-facilities");
  if (facForm) {
    facForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "about.facilities",
        {
          name: document.getElementById("fac-name").value,
          description: document.getElementById("fac-desc").value,
          image: document.getElementById("fac-image").value,
        },
        "fac-id",
        this,
      );
    });
  }

  // Admission Page Forms
  const reqForm = document.getElementById("form-requirements");
  if (reqForm) {
    reqForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "admission.requirements",
        {
          category: document.getElementById("req-cat").value,
          details: document.getElementById("req-details").value,
        },
        "req-id",
        this,
      );
    });
  }

  const stpForm = document.getElementById("form-steps");
  if (stpForm) {
    stpForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "admission.steps",
        {
          stepNumber: document.getElementById("stp-num").value,
          title: document.getElementById("stp-title").value,
          description: document.getElementById("stp-desc").value,
        },
        "stp-id",
        this,
      );
    });
  }

  const clsForm = document.getElementById("form-classes");
  if (clsForm) {
    clsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "admission.availableClasses",
        {
          className: document.getElementById("cls-name").value,
          ageGroup: document.getElementById("cls-age").value,
          capacity: document.getElementById("cls-capacity").value,
        },
        "cls-id",
        this,
      );
    });
  }

  const faqForm = document.getElementById("form-faqs");
  if (faqForm) {
    faqForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "admission.faqs",
        {
          question: document.getElementById("faq-q").value,
          answer: document.getElementById("faq-a").value,
        },
        "faq-id",
        this,
      );
    });
  }

  const noticeForm = document.getElementById("form-notice");
  if (noticeForm) {
    noticeForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = getSiteData();
      if (!data.admission) data.admission = {};
      data.admission.formNotice = {
        title: document.getElementById("ntc-title").value,
        note: document.getElementById("ntc-note").value,
      };
      saveSiteData(data);
      alert("Notice settings updated!");
    });
  }

  // Digital Assets Form
  const inoForm = document.getElementById("form-innovations");
  if (inoForm) {
    inoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "digitalAssets.innovations",
        {
          title: document.getElementById("ino-title").value,
          category: document.getElementById("ino-cat").value,
          description: document.getElementById("ino-desc").value,
          image: document.getElementById("ino-image").value,
        },
        "ino-id",
        this,
      );
    });
  }

  // News & Events Forms
  const evtForm = document.getElementById("form-events");
  if (evtForm) {
    evtForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "newsEvents.upcomingEvents",
        {
          title: document.getElementById("evt-title").value,
          date: document.getElementById("evt-date").value,
          time: document.getElementById("evt-time").value,
          location: document.getElementById("evt-location").value,
          description: document.getElementById("evt-desc").value,
        },
        "evt-id",
        this,
      );
    });
  }

  const nwsForm = document.getElementById("form-news");
  if (nwsForm) {
    nwsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "newsEvents.newsArticles",
        {
          title: document.getElementById("nws-title").value,
          date: document.getElementById("nws-date").value,
          category: document.getElementById("nws-cat").value,
          summary: document.getElementById("nws-summary").value,
        },
        "nws-id",
        this,
      );
    });
  }

  const galForm = document.getElementById("form-gallery");
  if (galForm) {
    galForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveItem(
        "newsEvents.gallery",
        {
          title: document.getElementById("gal-title").value,
          category: document.getElementById("gal-cat").value,
          image: document.getElementById("gal-image").value,
        },
        "gal-id",
        this,
      );
    });
  }
}

// ==========================================
// 6. RENDER ADMIN LISTS & PRE-FILL FIELDS
// ==========================================
function renderAdminLists() {
  const data = getSiteData();

  const createList = (items, targetPath, titleKey, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = (items || [])
      .map(
        (item) => `
      <div class="item-row">
        <span><strong>${item[titleKey]}</strong></span>
        <div class="action-btns">
          <button class="edit-btn" onclick="triggerEdit('${targetPath}', ${item.id})">Edit</button>
          <button class="delete-btn" onclick="deleteItem('${targetPath}', ${item.id})">Delete</button>
        </div>
      </div>
    `,
      )
      .join("");
  };

  createList(
    data.homepage?.educators,
    "homepage.educators",
    "name",
    "list-educators",
  );
  createList(
    data.homepage?.testimonials,
    "homepage.testimonials",
    "author",
    "list-testimonials",
  );
  createList(data.about?.journey, "about.journey", "title", "list-journey");
  createList(
    data.about?.coreValues,
    "about.coreValues",
    "title",
    "list-values",
  );
  createList(
    data.about?.recognitions,
    "about.recognitions",
    "title",
    "list-recognitions",
  );
  createList(
    data.about?.leadership,
    "about.leadership",
    "name",
    "list-leadership",
  );
  createList(
    data.about?.facilities,
    "about.facilities",
    "name",
    "list-facilities",
  );
  createList(
    data.admission?.requirements,
    "admission.requirements",
    "category",
    "list-requirements",
  );
  createList(data.admission?.steps, "admission.steps", "title", "list-steps");
  createList(
    data.admission?.availableClasses,
    "admission.availableClasses",
    "className",
    "list-classes",
  );
  createList(data.admission?.faqs, "admission.faqs", "question", "list-faqs");
  createList(
    data.digitalAssets?.innovations,
    "digitalAssets.innovations",
    "title",
    "list-innovations",
  );
  createList(
    data.newsEvents?.upcomingEvents,
    "newsEvents.upcomingEvents",
    "title",
    "list-events",
  );
  createList(
    data.newsEvents?.newsArticles,
    "newsEvents.newsArticles",
    "title",
    "list-news",
  );
  createList(
    data.newsEvents?.gallery,
    "newsEvents.gallery",
    "title",
    "list-gallery",
  );

  // Pre-fill static fields
  if (data.newsEvents?.calendarTitle) {
    const calElem = document.getElementById("cal-heading");
    if (calElem) calElem.value = data.newsEvents.calendarTitle;
  }
  if (data.homepage?.hero) {
    const hTitle = document.getElementById("hero-title");
    const hSub = document.getElementById("hero-sub");
    if (hTitle) hTitle.value = data.homepage.hero.title || "";
    if (hSub) hSub.value = data.homepage.hero.subtitle || "";
  }
  if (data.homepage?.welcomeSection) {
    const wHead = document.getElementById("wel-head");
    const wBody = document.getElementById("wel-body");
    if (wHead) wHead.value = data.homepage.welcomeSection.heading || "";
    if (wBody) wBody.value = data.homepage.welcomeSection.body || "";
  }
  if (data.admission?.formNotice) {
    const nTitle = document.getElementById("ntc-title");
    const nNote = document.getElementById("ntc-note");
    if (nTitle) nTitle.value = data.admission.formNotice.title || "";
    if (nNote) nNote.value = data.admission.formNotice.note || "";
  }
}

function triggerEdit(targetPath, id) {
  editItem(targetPath, id, (item) => {
    if (targetPath === "homepage.educators") {
      document.getElementById("edu-id").value = item.id;
      document.getElementById("edu-name").value = item.name;
      document.getElementById("edu-position").value = item.position;
      document.getElementById("edu-bio").value = item.bio;
      document.getElementById("edu-email").value = item.email || "";
      document.getElementById("edu-phone").value = item.phone || "";
      document.getElementById("edu-image").value = item.image;
    } else if (targetPath === "homepage.testimonials") {
      document.getElementById("tst-id").value = item.id;
      document.getElementById("tst-author").value = item.author;
      document.getElementById("tst-role").value = item.role;
      document.getElementById("tst-text").value = item.text;
    } else if (targetPath === "about.journey") {
      document.getElementById("jny-id").value = item.id;
      document.getElementById("jny-year").value = item.year;
      document.getElementById("jny-title").value = item.title;
      document.getElementById("jny-desc").value = item.description;
    } else if (targetPath === "about.coreValues") {
      document.getElementById("val-id").value = item.id;
      document.getElementById("val-title").value = item.title;
      document.getElementById("val-desc").value = item.description;
    } else if (targetPath === "about.recognitions") {
      document.getElementById("rec-id").value = item.id;
      document.getElementById("rec-title").value = item.title;
      document.getElementById("rec-body").value = item.body;
      document.getElementById("rec-icon").value = item.icon || "";
    } else if (targetPath === "about.leadership") {
      document.getElementById("ldr-id").value = item.id;
      document.getElementById("ldr-name").value = item.name;
      document.getElementById("ldr-title").value = item.title;
      document.getElementById("ldr-bio").value = item.bio;
      document.getElementById("ldr-image").value = item.image;
    } else if (targetPath === "about.facilities") {
      document.getElementById("fac-id").value = item.id;
      document.getElementById("fac-name").value = item.name;
      document.getElementById("fac-desc").value = item.description;
      document.getElementById("fac-image").value = item.image;
    } else if (targetPath === "admission.requirements") {
      document.getElementById("req-id").value = item.id;
      document.getElementById("req-cat").value = item.category;
      document.getElementById("req-details").value = item.details;
    } else if (targetPath === "admission.steps") {
      document.getElementById("stp-id").value = item.id;
      document.getElementById("stp-num").value = item.stepNumber;
      document.getElementById("stp-title").value = item.title;
      document.getElementById("stp-desc").value = item.description;
    } else if (targetPath === "admission.availableClasses") {
      document.getElementById("cls-id").value = item.id;
      document.getElementById("cls-name").value = item.className;
      document.getElementById("cls-age").value = item.ageGroup;
      document.getElementById("cls-capacity").value = item.capacity;
    } else if (targetPath === "admission.faqs") {
      document.getElementById("faq-id").value = item.id;
      document.getElementById("faq-q").value = item.question;
      document.getElementById("faq-a").value = item.answer;
    } else if (targetPath === "digitalAssets.innovations") {
      document.getElementById("ino-id").value = item.id;
      document.getElementById("ino-title").value = item.title;
      document.getElementById("ino-cat").value = item.category;
      document.getElementById("ino-desc").value = item.description;
      document.getElementById("ino-image").value = item.image;
    } else if (targetPath === "newsEvents.upcomingEvents") {
      document.getElementById("evt-id").value = item.id;
      document.getElementById("evt-title").value = item.title;
      document.getElementById("evt-date").value = item.date;
      document.getElementById("evt-time").value = item.time;
      document.getElementById("evt-location").value = item.location;
      document.getElementById("evt-desc").value = item.description;
    } else if (targetPath === "newsEvents.newsArticles") {
      document.getElementById("nws-id").value = item.id;
      document.getElementById("nws-title").value = item.title;
      document.getElementById("nws-date").value = item.date;
      document.getElementById("nws-cat").value = item.category;
      document.getElementById("nws-summary").value = item.summary;
    } else if (targetPath === "newsEvents.gallery") {
      document.getElementById("gal-id").value = item.id;
      document.getElementById("gal-title").value = item.title;
      document.getElementById("gal-cat").value = item.category;
      document.getElementById("gal-image").value = item.image;
    }
  });
}
