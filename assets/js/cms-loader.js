/**
 * CMS + INTERACTIONS LOADER
 * Handles: CMS content, services/courses rendering, read-more buttons, hero buttons smooth scroll
 */

async function loadPage(pageName) {
  try {
    const res = await fetch(`./content/${pageName}.json`);
    if (!res.ok) throw new Error("JSON not found");

    const data = await res.json();

    function isEmpty(value) {
      return value === null || value === "" || value === "(Developer section)" || value === undefined;
    }

    // ---------------------------
    // Load text content
    // ---------------------------
    document.querySelectorAll("[data-cms]").forEach(el => {
      const key = el.getAttribute("data-cms");
      const value = data[key];
      if (!isEmpty(value)) el.textContent = value;
      else el.style.display = "none";
    });

    // ---------------------------
    // Handle link content
    // ---------------------------
    document.querySelectorAll("[data-cms-link]").forEach(el => {
      const key = el.getAttribute("data-cms-link");
      const value = data[key];
      if (!isEmpty(value)) el.href = value;
      else el.style.display = "none";
    });

    // ---------------------------
    // Render Services (CMS)
    // ---------------------------
    if (Array.isArray(data.services)) {
      const container = document.getElementById("services-container");
      if (container) {
        container.innerHTML = data.services.map((service, index) => {
          const showButton = !isEmpty(service.button_text);
          return `
            <div class="col-md-6 col-lg-3 mb-4">
              <div class="service-card p-4 h-100 text-center">
                <h5>${service.title || ""}</h5>
                <p>${service.description || ""}</p>
                ${
                  showButton
                    ? `
                      <button class="read-more-btn mt-3" data-index="${index}">
                        ${service.button_text}
                      </button>
                      <div id="service-extra-${index}" class="collapse mt-2">
                        <div class="card card-body border-0 shadow-sm">
                          ${service.modal_content || "No content available"}
                        </div>
                      </div>
                    `
                    : ""
                }
              </div>
            </div>
          `;
        }).join('');
      }
      window._servicesData = data.services;
    }

// Render Gallery
if (Array.isArray(data.sections)) {
  const galleryContainer = document.getElementById("gallery-container");
  if (galleryContainer) {
    galleryContainer.innerHTML = data.sections.map((section) => {

      const imagesHtml = Array.isArray(section.images)
        ? section.images.map(img => `
            <div class="col-md-4 mb-4">
              <div class="card h-100 shadow-sm">
                <img 
                  src="${img.file}" 
                  alt="${img.alt || section.occasion}" 
                  class="img-fluid rounded gallery-img"
                  loading="lazy"
                  decoding="async"
                  data-bs-toggle="modal"
                  data-bs-target="#galleryModal">
              </div>
            </div>
          `).join('')
        : '';

      return `
        <div class="gallery-section mb-5">
          <h3 class="fw-semibold mb-4">${section.occasion}</h3>
          <div class="row g-3">
            ${imagesHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  // Lightbox click handler
  document.querySelectorAll(".gallery-img").forEach(img => {
    img.addEventListener("click", function() {
      const modalImg = document.getElementById("galleryModalImg");
      modalImg.src = this.src;
      modalImg.alt = this.alt;
    });
  });
}
    // ---------------------------
// Render Team Members (CMS with editable images)
if (Array.isArray(data.team)) {
  const teamContainer = document.getElementById("team-container");
  if (teamContainer) {
    teamContainer.innerHTML = data.team.map(member => {
      const name = member.name || "No name";
      const position = member.position || "";
      const image = member.image && member.image.trim() !== "" 
                      ? member.image 
                      : "assets/images/uploads/default-avatar.png"; // fallback
      const bio = member.bio || "";

      return `
        <div class="col-md-4 mb-4">
          <div class="team-card shadow-sm h-100">
            <img src="${image}" alt="${name}" class="team-img rounded-top">
            <div class="team-content p-3">
              <h5 class="fw-bold mb-1">${name}</h5>
              <small class="text-muted">${position}</small>
              <p class="mt-2 text-muted mb-0">${bio}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}
    // ---------------------------
    // Render Courses (CMS)
    // ---------------------------
    if (Array.isArray(data.courses)) {
      const container = document.getElementById("courses-container");
      if (container) {
        container.innerHTML = data.courses.map(course => {
          const name = course.course_name || "No title";
          const desc = course.description || "No description";
          const duration = course.duration || "N/A";
          const price = course.price || "Contact us";
          const cert = course.certification || "N/A";

          return `
            <div class="col-md-6 col-lg-4 mb-4">
              <div class="course-card h-100">
                <h5>${name}</h5>
                <p>${desc}</p>
                <p><strong>Duration:</strong> ${duration}</p>
                <p><strong>Price:</strong> ${price}</p>
                <p><strong>Certification:</strong> ${cert}</p>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    console.log("✅ CMS Loaded");
  } catch (err) {
    console.error("❌ CMS ERROR:", err);
  }
}

// ---------------------------
// Global Click: Read More Buttons
// ---------------------------
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("read-more-btn")) {
    const index = e.target.getAttribute("data-index");
    const element = document.getElementById(`service-extra-${index}`);
    if (!element) return;

    const isOpen = element.classList.contains("show");

    // Toggle collapse using Bootstrap
    new bootstrap.Collapse(element, { toggle: true });

    // Swap text dynamically
    e.target.innerText = isOpen ? "Read More" : "Show Less";
  }
});

// ---------------------------
// Hero Buttons Smooth Scroll
// ---------------------------
document.querySelectorAll(".hero-quick-links .btn").forEach(button => {
  button.addEventListener("click", function(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
