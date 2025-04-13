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

  // 3. Sidebar links
  initSidebar();

  // Check if in admin dashboard
  if (window.location.href.includes("index.html")) {
    // 4. Barangay dropdown + dashboard
  initDropdown()
  .then(() => initDashboardData())
  .catch((err) => console.error("Failed to init dashboard:", err));

initBarangayOverview();
  }
  
});

async function initBarangayOverview() {
  const barangayOverview = document.getElementById("barangay-overview");

  const res = await fetch("../data/sk_federation_data.json");
  if (!res.ok) throw new Error(`Failed to load barangays (${res.status})`);
  const allBarangays = await res.json();

  barangayOverview.innerHTML = `
    <div class="table-responsive">
      <table class="table table-hover w-full" >
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
    </div>
  `;
}
