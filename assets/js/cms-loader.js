async function loadPage(pageName) {
  try {
    // Fetch CMS JSON
    const res = await fetch(`/content/${pageName}.json`);
    if (!res.ok) throw new Error(`Failed to load ${pageName}.json`);

    const data = await res.json();
    console.log("FULL DATA:", data);

    // =========================
    // PAGE TITLE
    // =========================
    if (data.title) {
      document.title = data.title;
    }

    // =========================
    // BASIC TEXT FIELDS (Skip Hero Section)
    // =========================
    document.querySelectorAll("[data-cms]").forEach(el => {
      // Skip elements inside hero
      if (!el.closest(".hero") && !el.classList.contains("hardcoded")) {
        const key = el.getAttribute("data-cms");
        if (data[key] !== undefined) {
          el.textContent = data[key];
          el.style.whiteSpace = "pre-line";
        }
      }
    });

    // =========================
    // SET HREF ATTRIBUTES (Skip Hero CTA Buttons)
    // =========================
    document.querySelectorAll("[data-cms-href]").forEach(el => {
      if (!el.closest(".hero") && !el.classList.contains("hardcoded")) {
        const key = el.getAttribute("data-cms-href");
        if (data[key]) {
          el.setAttribute("href", data[key]);
        }
      }
    });

    // =========================
    // SERVICES SECTION
    // =========================
    if (Array.isArray(data.services) && document.getElementById("services-container")) {
      const container = document.getElementById("services-container");
      container.innerHTML = data.services.map(service => `
        <div class="col-md-4">
          <div class="service-card">
            <h5 class="fw-semibold">${service.title || ""}</h5>
            <p class="text-muted">${service.description || ""}</p>
          </div>
        </div>
      `).join('');
    }

    // =========================
    // WHY FEATURES SECTION
    // =========================
    if (Array.isArray(data.why_features) && document.getElementById("why-container")) {
      const container = document.getElementById("why-container");
      container.innerHTML = data.why_features.map(item => `
        <div class="d-flex mb-3">
          <div class="why-icon">
            <i class="bi ${item.icon || ""}"></i>
          </div>
          <div>
            <h6 class="fw-semibold mb-1">${item.title || ""}</h6>
            <p class="text-muted mb-0">${item.description || ""}</p>
          </div>
        </div>
      `).join('');
    }

   // =========================
// COURSES SECTION
// =========================
if (Array.isArray(data.courses) && document.getElementById("courses-container")) {
  const container = document.getElementById("courses-container");
  container.innerHTML = data.courses.map(course => `
    <div class="col-md-4 mb-4">
      <div class="course-card h-100">
        <h5>${course.course_name || ""}</h5>
        <p>${course.description || ""}</p>
        <ul class="list-unstyled mt-3">
          <li><strong>Duration:</strong> ${course.duration || "-"}</li>
          <li><strong>Price:</strong> ${course.price || "-"}</li>
          <li><strong>Certification:</strong> ${course.certification || "-"}</li>
        </ul>
      </div>
    </div>
  `).join('');
}

  } catch (error) {
    console.error("CMS LOAD ERROR:", error);
  }
}

