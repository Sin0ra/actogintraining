/**
 * CMS LOADER (FULL VERSION – COURSES + SERVICES + READ MORE)
 */

async function loadPage(pageName) {
  try {
    const res = await fetch(`./content/${pageName}.json`);
    if (!res.ok) throw new Error("JSON not found");

    const data = await res.json();

    // ===============================
    // 1. HELPER: CHECK IF VALUE IS EMPTY
    // ===============================
    function isEmpty(value) {
      return (
        value === null ||
        value === "" ||
        value === "(Developer section)" ||
        value === undefined
      );
    }

    // ===============================
    // 2. LOAD TEXT CONTENT
    // ===============================
    document.querySelectorAll("[data-cms]").forEach(el => {
      const key = el.getAttribute("data-cms");
      const value = data[key];
      if (!isEmpty(value)) {
        el.textContent = value;
      } else {
        el.style.display = "none";
      }
    });

    // ===============================
    // 3. HANDLE BUTTON LINKS
    // ===============================
    document.querySelectorAll("[data-cms-link]").forEach(el => {
      const key = el.getAttribute("data-cms-link");
      const value = data[key];
      if (!isEmpty(value)) {
        el.href = value;
      } else {
        el.style.display = "none";
      }
    });

    // ===============================
    // 4. SERVICES RENDERING (CMS)
    // ===============================
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

    // ===============================
    // 5. COURSES RENDERING (CMS)
    // ===============================
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

// ======================================
// 6. GLOBAL CLICK HANDLER FOR READ MORE BUTTONS
// ======================================
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
