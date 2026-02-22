async function loadPage(pageName) {
  try {
    const res = await fetch(`/content/${pageName}.json`);
    if (!res.ok) throw new Error(`Failed to load ${pageName}.json`);

    const data = await res.json();

    // =========================
    // BASIC TEXT FIELDS
    // =========================
    document.querySelectorAll("[data-cms]").forEach(el => {
      const key = el.getAttribute("data-cms");
      if (data[key] !== undefined) {
        el.textContent = data[key];
      }
    });

    // =========================
    // SERVICES SECTION (CMS-driven, no See More)
    // =========================
    if (Array.isArray(data.services) && document.getElementById("services-container")) {
      const container = document.getElementById("services-container");
      container.innerHTML = data.services.map(service => `
        <div class="col-md-4">
          <div class="service-card p-4 h-100">
            <h5 class="fw-semibold">${service.title || ""}</h5>
            <p>${service.description || ""}</p>
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
        <div class="col-md-4">
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


