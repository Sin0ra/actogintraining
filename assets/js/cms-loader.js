/**
 * CMS LOADER SCRIPT
 * This script dynamically loads JSON content into your HTML pages
 * using data attributes like: data-cms="title"
 */

/**
 * MAIN FUNCTION: Loads a specific page JSON file
 * @param {string} pageName - name of the JSON file (without .json)
 */
async function loadPage(pageName) {

  try {
    // ===============================
    // 1. FETCH JSON FILE
    // ===============================
    // Using relative path so it works locally and online
    const response = await fetch(`./content/${pageName}.json`);

    // If file is not found or server error
    if (!response.ok) {
      throw new Error(`Could not load: ${pageName}.json`);
    }

    // Convert response into JSON
    const data = await response.json();


    // ===============================
    // 2. LOAD SIMPLE TEXT CONTENT
    // ===============================
    // Finds all elements with data-cms attribute
    const elements = document.querySelectorAll("[data-cms]");

    elements.forEach(el => {
      const key = el.getAttribute("data-cms");

      // Only update if key exists in JSON
      if (data[key] !== undefined && data[key] !== null) {
        el.textContent = data[key];
      }
    });


    // ===============================
    // 3. LOAD SERVICES (ARRAY)
    // ===============================
    // Example JSON:
    // "services": [{ "title": "", "description": "" }]
    if (Array.isArray(data.services)) {

      const container = document.getElementById("services-container");

      if (container) {
        container.innerHTML = data.services.map(service => `
          <div class="col-md-6 col-lg-3">
            <div class="service-card p-4 h-100 text-center">
              <h5>${service.title || ""}</h5>
              <p>${service.description || ""}</p>
            </div>
          </div>
        `).join('');
      }
    }


    // ===============================
    // 4. LOAD COURSES (ARRAY)
    // ===============================
    // Example JSON:
    // "courses": [{ "course_name": "", "description": "" }]
    if (Array.isArray(data.courses)) {

      const container = document.getElementById("courses-container");

      if (container) {
        container.innerHTML = data.courses.map(course => `
          <div class="col-md-4">
            <div class="course-card p-3">
              <h5>${course.course_name || ""}</h5>
              <p>${course.description || ""}</p>
            </div>
          </div>
        `).join('');
      }
    }


    // ===============================
    // 5. LOAD GENERIC LISTS (FLEXIBLE)
    // ===============================
    // This allows you to reuse CMS for other sections later
    // Example:
    // "testimonials": [{ "name": "", "message": "" }]
    Object.keys(data).forEach(key => {

      // Skip already handled sections
      if (["services", "courses"].includes(key)) return;

      if (Array.isArray(data[key])) {

        const container = document.getElementById(`${key}-container`);

        if (container) {
          container.innerHTML = data[key].map(item => `
            <div class="cms-item">
              ${Object.values(item).map(val => `<p>${val}</p>`).join('')}
            </div>
          `).join('');
        }
      }
    });


    // ===============================
    // 6. SUCCESS LOG (DEBUGGING)
    // ===============================
    console.log(`✅ CMS Loaded: ${pageName}.json`);

  } catch (error) {

    // ===============================
    // 7. ERROR HANDLING
    // ===============================
    console.error("❌ CMS ERROR:", error);

  }
}
