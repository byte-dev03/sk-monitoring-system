
import { initSidebar, initDropdown, initDashboardData } from './monitor.js'

document.addEventListener("DOMContentLoaded", () => {
  // 1. Auth guard
  const authUser = JSON.parse(localStorage.getItem("authUser"))
                 || JSON.parse(sessionStorage.getItem("authUser"));
  if (!authUser) {
    return void (window.location.href = "/index.html");
  }

  // 2. Navbar / logout
  document.getElementById("admin-username").textContent = authUser.username;
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authUser");
    window.location.href = "/index.html";
  });
  // 3. Sidebar links
  initSidebar();

  // 4. Barangay dropdown + dashboard
  initDropdown()
    .then(() => initDashboardData())
    .catch(err => console.error("Failed to init dashboard:", err));
});
