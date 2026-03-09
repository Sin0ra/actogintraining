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
  container.innerHTML = data.services.map((service, index) => {
    const modalId = "serviceModal" + index;
    const buttonHTML = (service.button_text && service.modal_content)
      ? `<button class="btn btn-success mt-3"
          data-bs-toggle="modal"
          data-bs-target="#${modalId}">
          ${service.button_text}
        </button>`
      : "";
    const modalHTML = service.modal_content
      ? `
      <div class="modal fade" id="${modalId}" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${service.title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p>${service.modal_content}</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      `
      : "";
    return `
      <div class="col-md-4">
        <div class="service-card p-4 h-100 text-center">
          <h5 class="fw-semibold">${service.title || ""}</h5>
          <p>${service.description || ""}</p>
          ${buttonHTML}
          ${modalHTML}
        </div>
      </div>
    `;
  }).join('');
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

  } catch (error) {
    console.error("CMS LOAD ERROR:", error);
  }
}


