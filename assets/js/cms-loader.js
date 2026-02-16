async function loadPage(pageName) {
  try {
    const res = await fetch(`/content/pages/${pageName}.json`);
    const data = await res.json();

    // =========================
    // SET PAGE TITLE
    // =========================
    if (data.title) {
      document.title = data.title;
    }

    // =========================
    // BASIC TEXT FIELDS
    // =========================
    document.querySelectorAll("[data-cms]").forEach(el => {
      const key = el.getAttribute("data-cms");
      if (data[key] !== undefined) {
        el.innerHTML = data[key];
      }
    });

    // =========================
    // SET HREF ATTRIBUTES (CTA buttons etc.)
    // =========================
    document.querySelectorAll("[data-cms-href]").forEach(el => {
      const key = el.getAttribute("data-cms-href");
      if (data[key]) {
        el.setAttribute("href", data[key]);
      }
    });

    // =========================
    // SERVICES SECTION
    // =========================
    if (data.services && document.getElementById("services-container")) {
      const container = document.getElementById("services-container");
      container.innerHTML = data.services.map(service => `
        <div class="col-md-4">
          <div class="service-card">
            <h5 class="fw-semibold">${service.title}</h5>
            <p class="text-muted">${service.description}</p>
          </div>
        </div>
      `).join('');
    }

    // =========================
    // WHY FEATURES SECTION
    // =========================
    if (data.why_features && document.getElementById("why-container")) {
      const container = document.getElementById("why-container");
      container.innerHTML = data.why_features.map(item => `
        <div class="d-flex mb-3">
          <div class="why-icon">
            <i class="bi ${item.icon}"></i>
          </div>
          <div>
            <h6 class="fw-semibold mb-1">${item.title}</h6>
            <p class="text-muted mb-0">${item.description}</p>
          </div>
        </div>
      `).join('');
    }

    // =========================
    // COURSES SECTION
    // =========================
    if (data.courses && document.getElementById("courses-container")) {
      const container = document.getElementById("courses-container");
      container.innerHTML = data.courses.map(course => `
        <div class="col-md-4">
          <div class="card p-4 shadow-sm">
            <h5>${course.title}</h5>
            <p>${course.description}</p>
          </div>
        </div>
      `).join('');
    }

  } catch (err) {
    console.error("CMS Load Error:", err);
  }
}
