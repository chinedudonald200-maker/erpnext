// ==========================================
// 1. INITIALIZATION & TAB SWITCHING
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  await renderAdminLists();
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

  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add("active");
  }
}

// ==========================================
// 2. ITEM MANAGEMENT (SAVE, DELETE, EDIT)
// ==========================================
async function saveItem(targetPath, itemData, idInputId, formElement) {
  const data = await getSiteData();
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

  await saveSiteData(data);
  formElement.reset();
  document.getElementById(idInputId).value = "";
  await renderAdminLists();
}

async function deleteItem(targetPath, id) {
  const data = await getSiteData();
  const keys = targetPath.split(".");
  if (data[keys[0]] && data[keys[0]][keys[1]]) {
    data[keys[0]][keys[1]] = data[keys[0]][keys[1]].filter(
      (item) => item.id !== id,
    );
    await saveSiteData(data);
    await renderAdminLists();
  }
}

async function editItem(targetPath, id, fillFormCallback) {
  const data = await getSiteData();
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

// ==========================================
// 4. INTERACTIVE IMAGE CROPPER
// ==========================================
let currentCropperImage = null;
let cropCanvas, ctx, zoomRange;
let imgX = 0,
  imgY = 0,
  scale = 1;
let isDragging = false;
let startX, startY;
const outputSize = 300;

document.addEventListener("DOMContentLoaded", () => {
  cropCanvas = document.getElementById("cropCanvas");
  if (cropCanvas) {
    ctx = cropCanvas.getContext("2d");
    cropCanvas.width = outputSize;
    cropCanvas.height = outputSize;
  }
  zoomRange = document.getElementById("zoomRange");
  setupCropperEvents();
});

function compressAndSetImage(fileInput, targetInputId) {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (event) {
    currentCropperImage = new Image();
    currentCropperImage.src = event.target.result;
    currentCropperImage.onload = function () {
      scale = Math.max(
        outputSize / currentCropperImage.width,
        outputSize / currentCropperImage.height,
      );
      zoomRange.value = scale;
      imgX = (outputSize - currentCropperImage.width * scale) / 2;
      imgY = (outputSize - currentCropperImage.height * scale) / 2;

      drawCanvasImage();
      document.getElementById("cropModal").style.display = "flex";
      document
        .getElementById("saveCropBtn")
        .setAttribute("data-target-input", targetInputId);
    };
  };
}

function drawCanvasImage() {
  if (!ctx || !currentCropperImage) return;
  ctx.clearRect(0, 0, outputSize, outputSize);
  ctx.save();
  ctx.beginPath();
  ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(
    currentCropperImage,
    imgX,
    imgY,
    currentCropperImage.width * scale,
    currentCropperImage.height * scale,
  );
  ctx.restore();
}

function setupCropperEvents() {
  if (!cropCanvas) return;

  cropCanvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX - imgX;
    startY = e.clientY - imgY;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    imgX = e.clientX - startX;
    imgY = e.clientY - startY;
    drawCanvasImage();
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  if (zoomRange) {
    zoomRange.addEventListener("input", (e) => {
      const oldScale = scale;
      scale = parseFloat(e.target.value);
      imgX = outputSize / 2 - (outputSize / 2 - imgX) * (scale / oldScale);
      imgY = outputSize / 2 - (outputSize / 2 - imgY) * (scale / oldScale);
      drawCanvasImage();
    });
  }

  const saveBtn = document.getElementById("saveCropBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const targetId = saveBtn.getAttribute("data-target-input");
      const croppedDataUrl = cropCanvas.toDataURL("image/jpeg", 0.85);
      const targetInput = document.getElementById(targetId);
      if (targetInput) targetInput.value = croppedDataUrl;
      document.getElementById("cropModal").style.display = "none";
    });
  }
}

// ==========================================
// 5. FORM SUBMISSION EVENT HANDLERS
// ==========================================
function setupFormHandlers() {
  const eduFile = document.getElementById("edu-file");
  if (eduFile) {
    eduFile.addEventListener("change", function () {
      compressAndSetImage(this, "edu-image");
    });
  }

  const eduForm = document.getElementById("form-educators");
  if (eduForm) {
    eduForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      await saveItem(
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

  const calForm = document.getElementById("form-calendar-header");
  if (calForm) {
    calForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const data = await getSiteData();
      if (!data.newsEvents) data.newsEvents = {};
      data.newsEvents.calendarTitle =
        document.getElementById("cal-heading").value;
      await saveSiteData(data);
      alert("Calendar Title Updated Successfully!");
    });
  }

  const heroForm = document.getElementById("form-hero");
  if (heroForm) {
    heroForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const data = await getSiteData();
      if (!data.homepage) data.homepage = {};
      data.homepage.hero = {
        title: document.getElementById("hero-title").value,
        subtitle: document.getElementById("hero-sub").value,
      };
      await saveSiteData(data);
      alert("Hero banner updated!");
    });
  }

  const welcomeForm = document.getElementById("form-welcome");
  if (welcomeForm) {
    welcomeForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const data = await getSiteData();
      if (!data.homepage) data.homepage = {};
      data.homepage.welcomeSection = {
        heading: document.getElementById("wel-head").value,
        body: document.getElementById("wel-body").value,
      };
      await saveSiteData(data);
      alert("Welcome section updated!");
    });
  }

  const testForm = document.getElementById("form-testimonials");
  if (testForm) {
    testForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      await saveItem(
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
}

// ==========================================
// 6. RENDER ADMIN LISTS & PRE-FILL FIELDS
// ==========================================
async function renderAdminLists() {
  const data = await getSiteData();

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
}

async function triggerEdit(targetPath, id) {
  await editItem(targetPath, id, (item) => {
    if (targetPath === "homepage.educators") {
      document.getElementById("edu-id").value = item.id;
      document.getElementById("edu-name").value = item.name;
      document.getElementById("edu-position").value = item.position;
      document.getElementById("edu-bio").value = item.bio;
      document.getElementById("edu-email").value = item.email || "";
      document.getElementById("edu-phone").value = item.phone || "";
      document.getElementById("edu-image").value = item.image;
    }
  });
}
