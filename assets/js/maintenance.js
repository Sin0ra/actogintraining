// 🔥 MASTER SWITCH
const MAINTENANCE_MODE = false; // ← change to false to turn OFF

// Allow developer bypass
const BYPASS = window.location.search.includes('admin=true');

if (MAINTENANCE_MODE && !BYPASS) {
  const currentPage = window.location.pathname;

  // Prevent infinite loop
  if (!currentPage.includes('maintenance.html')) {
    window.location.href = './maintenance.html';
  }
}
