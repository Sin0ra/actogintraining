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
// SERVICES SECTION
// =========================
if (Array.isArray(data.services) && document.getElementById("services-container")) {
  const container = document.getElementById("services-container");

  const serviceIds = [
    "training-services",
    "construction",
    "accommodation",
    "catering"
  ];

  container.innerHTML = data.services.map((service, index) => {
    const id = serviceIds[index] || `service-${index}`;
    const collapseId = `serviceCollapse${index}`;

    return `
      <div class="col-md-6 col-lg-3" id="${id}">
        <div class="service-card p-4 h-100 text-center">

          <h5 class="fw-semibold">${service.title || ""}</h5>
          <p>${service.description || ""}</p>

          ${service.button_text ? `
            <button class="btn toggle-btn mt-2"
              data-bs-toggle="collapse"
              data-bs-target="#${collapseId}"
              data-btn="${service.button_text}">
              ${service.button_text}
            </button>
          ` : ""}

          <div class="collapse mt-3" id="${collapseId}">
            <div class="card card-body">
              ${service.modal_content || ""}
            </div>
          </div>

        </div>
      </div>
    `;
  }).join('');
}

    // Toggle Read More / Read Less
document.querySelectorAll(".collapse").forEach(collapse => {

  collapse.addEventListener("shown.bs.collapse", function () {
    const btn = document.querySelector(`[data-bs-target="#${collapse.id}"]`);
    if (btn) btn.textContent = "Read Less";
  });

  collapse.addEventListener("hidden.bs.collapse", function () {
    const btn = document.querySelector(`[data-bs-target="#${collapse.id}"]`);
    if (btn) btn.textContent = "Read More";
  });

});

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

  // =========================
// GALLERY SECTION (Upgraded)
// =========================
if (Array.isArray(data.images) && document.getElementById("gallery-container")) {
  const container = document.getElementById("gallery-container");

  container.innerHTML = data.images.map((img, index) => `
    <div class="col-md-4">
      <div class="gallery-card" data-bs-toggle="modal" data-bs-target="#galleryModal${index}">
        <img src="${img.image}" class="img-fluid" alt="">
        <div class="gallery-overlay">
          ${img.caption ? `<span>${img.caption}</span>` : ""}
        </div>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="galleryModal${index}" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content bg-dark border-0">
            <div class="modal-body p-0">
              <img src="${img.image}" class="img-fluid w-100">
              ${img.caption ? `<div class="text-white text-center p-3">${img.caption}</div>` : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// =========================
// TEAM SECTION
// =========================
if (Array.isArray(data.team) && document.getElementById("team-container")) {
  const container = document.getElementById("team-container");

  container.innerHTML = data.team.map(member => `
    <div class="col-md-6 col-lg-3">
      <div class="team-card text-center h-100">

        <div class="team-img">
          <img src="${member.image}" class="img-fluid" alt="${member.name}">
        </div>

        <div class="team-info p-3">
          <h5 class="fw-bold">${member.name || ""}</h5>
          <p class="text-muted small">${member.role || ""}</p>
        </div>

      </div>
    </div>
  `).join('');
}
    
  } catch (error) {
    console.error("CMS LOAD ERROR:", error);
  }
}




















