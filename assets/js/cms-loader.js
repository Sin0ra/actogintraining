/**
 * CMS LOADER (UPDATED - EXPANDABLE SERVICES VERSION)
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
    // 3. HANDLE BUTTON LINKS (HERO ETC)
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
    // 4. SERVICES (UPDATED - EXPANDABLE)
    // ===============================
    if (Array.isArray(data.services)) {

      const container = document.getElementById("services-container");

      if (container) {
        container.innerHTML = data.services.map((service, index) => {

          const showButton = !isEmpty(service.button_text);

          return `
            <div class="col-md-6 col-lg-3">
              <div class="service-card p-4 h-100 text-center">

                <h5>${service.title || ""}</h5>
                <p>${service.description || ""}</p>

                ${
                  showButton
                    ? `
                      <!-- READ MORE BUTTON (NO onclick, CMS SAFE) -->
                      <button class="btn btn-primary mt-2 read-more-btn"
                              data-index="${index}">
                        ${service.button_text}
                      </button>

                      <!-- EXPANDABLE CONTENT -->
                      <div id="service-extra-${index}" class="collapse mt-3">
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

      // Save services globally (still useful if needed later)
      window._servicesData = data.services;
    }


    console.log("✅ CMS Loaded");

  } catch (err) {
    console.error("❌ CMS ERROR:", err);
  }
}


// ======================================
// 5. GLOBAL CLICK HANDLER (VERY IMPORTANT)
// ======================================
document.addEventListener("click", function(e) {

  // Only trigger if it's a "Read More" button
  if (e.target.classList.contains("read-more-btn")) {

    const index = e.target.getAttribute("data-index");
    const element = document.getElementById(`service-extra-${index}`);

    if (!element) return;

    const isOpen = element.classList.contains("show");

    // Toggle Bootstrap collapse
    new bootstrap.Collapse(element, {
      toggle: true
    });

    // Change button text dynamically
    e.target.innerText = isOpen ? "Read More" : "Show Less";
  }
});
