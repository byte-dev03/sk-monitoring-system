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
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      ${allBarangays.map((b) => {
        // Get recent activities (last 3 projects/accomplishments)
        const recentActivities = [
          ...b.projects.slice(-2),
          ...b.accomplishments.slice(-1)
        ].sort((a, b) => new Date(b.completed_at || b.start_date) - new Date(a.completed_at || a.start_date));

        return `
        <div class="col">
          <div class="card h-100 shadow-sm">
            <div class="card-header bg-primary text-white">
              <h5 class="card-title mb-0">${b.name}</h5>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-3">
                <div class="text-center">
                  <h6 class="mb-0">${b.projects.length}</h6>
                  <small class="text-muted">Projects</small>
                </div>
                <div class="text-center">
                  <h6 class="mb-0">${b.accomplishments.length}</h6>
                  <small class="text-muted">Accomplishments</small>
                </div>
                <div class="text-center">
                  <h6 class="mb-0">${b.projects.filter(p => p.status === 'Completed').length}</h6>
                  <small class="text-muted">Completed</small>
                </div>
              </div>
              
              <div class="recent-activity mt-3">
                <h6 class="text-muted mb-2">Recent Activity</h6>
                <ul class="list-group list-group-flush">
                  ${recentActivities.map(activity => `
                    <li class="list-group-item px-0 py-1">
                      <small class="d-flex align-items-center">
                        <i class="fas fa-${activity.type === 'Project' ? 'project-diagram' : 'check-circle'} me-2 text-${activity.status === 'Completed' ? 'success' : 'primary'}"></i>
                        ${activity.title || activity.description}
                        <span class="ms-auto text-muted">${new Date(activity.completed_at || activity.start_date).toLocaleDateString()}</span>
                      </small>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
            <div class="card-footer bg-transparent">
              <button class="btn btn-sm btn-outline-primary w-100" onclick="viewBarangayDetails(${b.id})">
                View Details
              </button>
            </div>
          </div>
        </div>
        `;
      }).join('')}
    </div>
  `;
}

// Add this function to handle viewing barangay details
window.viewBarangayDetails = function(barangayId) {
  const input = document.getElementById("barangay-input");
  const list = document.getElementById("barangay-list");
  
  // Find the barangay in the data
  fetch("../data/sk_federation_data.json")
    .then(res => res.json())
    .then(allBarangays => {
      const barangay = allBarangays.find(b => b.id === barangayId);
      if (barangay) {
        input.value = barangay.name;
        renderDetail(barangay);
      }
    });
};
