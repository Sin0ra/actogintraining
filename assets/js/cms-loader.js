async function loadPage(pageName) {
  try {
    const res = await fetch(`/content/pages/${pageName}.json`);
    const data = await res.json();

    if (data.title) document.title = data.title;

    // Basic text fields
    document.querySelectorAll("[data-cms]").forEach(el => {
      const key = el.getAttribute("data-cms");
      if (data[key]) {
        el.innerHTML = data[key];
      }
    });

    // Services list
    if (data.services) {
      const container = document.getElementById("services-container");
      if (container) {
        container.innerHTML = "";
        data.services.forEach(service => {
          container.innerHTML += `
            <div class="col-md-4">
              <div class="service-card">
                <h5 class="fw-semibold">${service.title}</h5>
                <p class="text-muted">${service.description}</p>
              </div>
            </div>
          `;
        });
      }
    }

  } catch (err) {
    console.error("CMS Load Error:", err);
  }
}