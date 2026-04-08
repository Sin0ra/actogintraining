// 🔥 MASTER SWITCH
const MAINTENANCE_MODE = true; // true = ON, false = OFF

// Optional: allow yourself access
const BYPASS = window.location.search.includes('admin=true');

if (MAINTENANCE_MODE && !BYPASS) {
  const path = window.location.pathname;

  // prevent redirect loop
  if (!path.includes('maintenance.html')) {
    window.location.href = './maintenance.html';
  }
}
