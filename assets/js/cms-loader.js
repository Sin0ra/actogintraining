/**
 * CMS LOADER (CLEAN + SMART VERSION)
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
        // Hide empty elements
        el.style.display = "none";
      }
    });


    // ===============================
    // 3. HANDLE BUTTONS (TEXT + LINK)
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


    function openServiceModal(index) {
  const service = window._servicesData[index];

  if (!service) return;

  alert(service.modal_content || "No content available");
}


    // ===============================
    // 4. SERVICES (WITH BUTTON FIX)
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
                    ? `<button class="btn btn-primary mt-2" onclick="openServiceModal(${index})">
                        ${service.button_text}
                       </button>`
                    : ""
                }

              </div>
            </div>
          `;
        }).join('');
      }

      // Save services globally for modal use
      window._servicesData = data.services;
    }


    console.log("✅ CMS Loaded");

  } catch (err) {
    console.error("❌ CMS ERROR:", err);
  }
}
