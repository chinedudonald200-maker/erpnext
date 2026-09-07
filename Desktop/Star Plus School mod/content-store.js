// ==========================================
// STARPLUS INTERNATIONAL SCHOOL - CONTENT STORE
// ==========================================

const BIN_ID = "6a9999f7da38895dfe348ecb";
const API_KEY = "$2a$10$7bfrgFwm9L9ByMMyKpNofO73iJaon3UwSZCQBkU9s003bKDUQNh22";
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Local synchronous cache fallback
window.siteDataCache = {
  homepage: {
    hero: {
      title: "Welcome to StarPlus International School",
      subtitle: "Nurturing Future Leaders with Academic & Digital Excellence",
    },
    welcomeSection: {
      heading: "Empowering Young Minds",
      body: "StarPlus International School provides top-tier education integrated with modern technology, robotics, and strong character development.",
    },
    testimonials: [],
  },
  about: {
    journey: [],
    coreValues: [],
    recognitions: [],
    leadership: [],
    facilities: [],
  },
  admission: {
    requirements: [],
    steps: [],
    availableClasses: [],
    faqs: [],
    formNotice: {},
  },
  digitalAssets: { innovations: [] },
  newsEvents: { upcomingEvents: [], newsArticles: [], gallery: [] },
};

let cloudFetchPromise = null;

// Fetch live cloud data
async function initSiteData() {
  if (!cloudFetchPromise) {
    cloudFetchPromise = (async () => {
      try {
        const response = await fetch(`${BASE_URL}/latest`, {
          headers: { "X-Master-Key": API_KEY },
        });
        const result = await response.json();
        if (result.record) {
          window.siteDataCache = result.record;
        }
      } catch (error) {
        console.error(
          "Error fetching site data from cloud, using local cache:",
          error,
        );
      }
      return window.siteDataCache;
    })();
  }
  return cloudFetchPromise;
}

// Global accessor that waits for cloud data fetch
async function getSiteData() {
  return await initSiteData();
}

// Synchronous fallback read if needed immediately
function getSiteDataSync() {
  return window.siteDataCache;
}

// Save directly to cloud bin
async function saveSiteData(data) {
  window.siteDataCache = data; // Update local cache immediately
  try {
    const response = await fetch(BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update cloud storage");
    return true;
  } catch (error) {
    console.error("Error saving site data to cloud:", error);
    return false;
  }
}
