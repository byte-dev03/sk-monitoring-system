import { initSidebar, initDropdown, initDashboardData } from "./monitor.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Auth guard
  const authUser =
    JSON.parse(localStorage.getItem("authUser")) ||
    JSON.parse(sessionStorage.getItem("authUser"));
  if (!authUser) {
    return void (window.location.href = "../index.html");
  }

  // 2. Navbar / logout
  document.getElementById("admin-username").textContent = authUser.username;
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authUser");
    window.location.href = "/index.html";
  });

  const darkModeToggle = document.getElementById('darkmode-toggle');
  const toggleIcon = document.getElementById('toggle-icon');
  
  // On load, apply saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-bs-theme", savedTheme);
  updateToggleUI(savedTheme);

  // On click, toggle and save
  darkModeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateToggleUI(newTheme);
  });

  function updateToggleUI(theme) {
    if (theme === "dark") {
      darkModeToggle.classList.remove("bg-dark");
      darkModeToggle.classList.add("bg-light");
      darkModeToggle.classList.add('text-light');
      toggleIcon.classList.remove("fa-moon");
      toggleIcon.classList.add("fa-sun");
    } else {
      darkModeToggle.classList.remove("bg-light");
      darkModeToggle.classList.add("bg-dark");
      toggleIcon.classList.remove("fa-sun");
      toggleIcon.classList.add("fa-moon");
    }
  }
  // 3. Sidebar links
  initSidebar();

  // 4. Barangay dropdown + dashboard
  initDropdown()
    .then(() => initDashboardData())
    .catch((err) => console.error("Failed to init dashboard:", err));

  initBarangayOverview();
});

async function initBarangayOverview() {
  const barangayOverview = document.getElementById("barangay-overview");

  const res = await fetch("../data/barangays.json");
  if (!res.ok) throw new Error(`Failed to load barangays (${res.status})`);
  const allBarangays = await res.json();

  barangayOverview.innerHTML = `
    <table class="table table-hover" style="width: 50%">
      <thead>
        <tr>
          <th scope="col">Barangay</th>
          <th scope="col">Active Projects</th>
          <th scope="col">Accomplishments</th>
        </tr>
      </thead>
      <tbody>
      ${allBarangays.map((b) => {
        return `
        <tr>
          <th scope="row">${b.name}</th>
          <td>${b.projects.length}</td>
          <td>${b.accomplishments.length}</td>
        </tr>
        `;
      })}
      </tbody>
    </table>
  `;
}
