// ==========================================
// STARPLUS INTERNATIONAL SCHOOL - CONTENT STORE
// ==========================================

const BIN_ID = "6a9999f7da38895dfe348ecb";
const API_KEY = "$2a$10$7bfrgFwm9L9ByMMyKpNofO73iJaon3UwSZCQBkU9s003bKDUQNh22";
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const defaultContent = {
  // PAGE 1: INDEX.HTML
  homepage: {
    hero: {
      title: "Welcome to StarPlus International School",
      subtitle: "Nurturing Future Leaders with Academic & Digital Excellence",
    },
    welcomeSection: {
      heading: "Empowering Young Minds",
      body: "StarPlus International School provides top-tier education integrated with modern technology, robotics, and strong character development.",
    },
    testimonials: [
      {
        id: 1,
        author: "Mr. Johnson",
        role: "Parent (Primary 4)",
        text: "StarPlus has transformed my child's academic performance and boosted her self-confidence significantly.",
      },
    ],
  },

  // PAGE 2: ABOUT.HTML
  about: {
    journey: [
      {
        id: 1,
        year: "2010",
        title: "School Foundation",
        description:
          "StarPlus International School opened its doors with two classrooms and 15 students.",
      },
    ],
    coreValues: [
      {
        id: 1,
        title: "Excellence",
        description:
          "Striving for the highest quality in academics, character, and digital innovation.",
      },
    ],
    recognitions: [
      {
        id: 1,
        title: "Ministry of Education Approval",
        body: "Fully accredited by the State Ministry of Education.",
        icon: "🏅",
      },
    ],
    leadership: [
      {
        id: 1,
        name: "Mr. Obi Aminu",
        title: "Principal",
        bio: "20+ years in educational leadership and curriculum innovation.",
        image: "images/principal.jpg",
      },
    ],
    facilities: [
      {
        id: 1,
        name: "ICT & Robotics Lab",
        description:
          "High-speed workstations equipped with modern software and electronics modules.",
        image: "images/lab.jpg",
      },
    ],
  },

  // PAGE 3: ADMISSION.HTML
  admission: {
    requirements: [
      {
        id: 1,
        category: "Nursery / Primary",
        details:
          "Birth certificate, 2 passport photos, medical history record, and transfer letter.",
      },
    ],
    steps: [
      {
        id: 1,
        stepNumber: "01",
        title: "Submit Application",
        description:
          "Fill out the online application form or obtain a copy at the administrative office.",
      },
    ],
    availableClasses: [
      {
        id: 1,
        className: "Nursery 1 & 2",
        ageGroup: "3 – 5 years",
        capacity: "20 pupils max",
      },
    ],
    faqs: [
      {
        id: 1,
        question: "What are the school operating hours?",
        answer: "Classes run from 7:30 AM to 2:30 PM Monday through Friday.",
      },
    ],
    formNotice: {
      title: "Online Admission Guidelines",
      note: "All online form submissions are processed within 48 business hours by our admissions board.",
    },
  },

  // PAGE 4: DIGITAL ASSETS.HTML
  digitalAssets: {
    innovations: [
      {
        id: 1,
        title: "Smart E-Learning Portal",
        category: "Software",
        description:
          "Custom learning portal allowing students to access assignments, grades, and resources.",
        image: "images/portal.jpg",
      },
    ],
  },

  // PAGE 5: NEWS.HTML
  newsEvents: {
    upcomingEvents: [
      {
        id: 1,
        title: "Inter-House Sports Competition",
        date: "2026-11-15",
        time: "09:00 AM",
        location: "School Sports Complex",
        description: "Annual sports day featuring track and field events.",
      },
    ],
    newsArticles: [
      {
        id: 1,
        title: "StarPlus Wins Regional Robotics Competition",
        date: "2026-07-10",
        category: "Achievement",
        summary:
          "Our primary robotics team secured first place at the annual regional STEM festival.",
      },
    ],
    gallery: [
      {
        id: 1,
        title: "Digital Classroom Session",
        category: "Academics",
        image: "images/pjt3.jpg",
      },
    ],
  },
};

async function getSiteData() {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        "X-Master-Key": API_KEY,
      },
    });
    const result = await response.json();
    return result.record || defaultContent;
  } catch (error) {
    console.error("Error fetching site data from cloud:", error);
    return defaultContent;
  }
}

async function saveSiteData(data) {
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
  } catch (error) {
    console.error("Error saving site data to cloud:", error);
  }
}
