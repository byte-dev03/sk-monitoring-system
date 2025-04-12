export async function initDropdown() {
  const input = document.getElementById("barangay-input");
  const list = document.getElementById("barangay-list");

  if (!input || !list) throw new Error("Input or list element not found");

  const res = await fetch("../data/sk_federation_data.json");
  if (!res.ok) throw new Error(`Failed to load barangays (${res.status})`);
  const allBarangays = await res.json();

  let filtered = [];

  input.addEventListener("input", () => {
    const search = input.value.toLowerCase();
    list.innerHTML = "";

    filtered = allBarangays.filter(b => b.name.toLowerCase().includes(search));

    if (!search || filtered.length === 0) {
      list.style.display = "none";
      return;
    }

    filtered.forEach(b => {
      const item = document.createElement("li");
      item.textContent = b.name;
      item.className = "list-group-item list-group-item-action";
      item.addEventListener("click", () => {
        input.value = b.name;
        list.style.display = "none";
        filterByBarangay(b.id); // <-- call your filter function with the selected barangay ID
      });
      list.appendChild(item);
    });

    list.style.display = "block";
  });

  // Optional: close the list if clicked outside
  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !list.contains(e.target)) {
      list.style.display = "none";
    }
  });
}


export function initSidebar() {
  const navLinks = document.querySelectorAll(".sidebar .nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      const targetId = link.getAttribute("href").slice(1);
      const el = document.getElementById(targetId);
      if (el) {
        window.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });
      }
    });
  });
}

export async function initDashboardData() {
  const input = document.getElementById("barangay-input");  // Input for searching barangays
  const list = document.getElementById("barangay-list");    // The list of filtered barangays
  const detail = document.getElementById("barangay-detail"); // The detail section where info will be shown

  if (!input || !list || !detail) throw new Error("Missing #barangay-input, #barangay-list or #barangay-detail");

  // Fetch the list of barangays from the local JSON file
  const res = await fetch("../data/sk_federation_data.json");
  if (!res.ok) throw new Error(`Failed to load barangays (${res.status})`);
  const allBarangays = await res.json();

  // The input event to filter the barangays
  input.addEventListener("input", () => {
    const search = input.value.toLowerCase();
    list.innerHTML = "";  // Clear current list

    const filtered = allBarangays.filter(b => b.name.toLowerCase().includes(search));

    if (!search || filtered.length === 0) {
      list.style.display = "none";
      return;
    }

    // Populate the list with filtered barangays
    filtered.forEach(b => {
      const item = document.createElement("li");
      item.textContent = b.name;
      item.className = "list-group-item list-group-item-action";
      item.setAttribute("data-id", b.id); // Add the ID to the list item
      list.appendChild(item);
    });

    list.style.display = "block";
  });

  // Add a click event listener for selecting a barangay from the list
  list.addEventListener("click", async e => {
    const selectedBarangay = e.target;

    // Only trigger if an actual list item is clicked
    if (selectedBarangay && selectedBarangay.tagName === "LI") {
      const barangayId = selectedBarangay.getAttribute("data-id");

      // Find the selected barangay from the local data
      const selectedBarangayData = allBarangays.find(b => b.id == barangayId);
      if (selectedBarangayData) {
        renderDetail(selectedBarangayData);
      } else {
        detail.innerHTML = `<div class="alert alert-danger">Failed to load data.</div>`;
      }
    }
  });
}
function renderDetail(b) {
  document.getElementById("barangay-detail").innerHTML = `
    <div class="card shadow-sm" style="transition: 1s linear">
      <div class="card-header d-flex justify-content-between">
        <h5>${b.name}</h5>
      </div>
      <div class="card-body d-flex flex-column">
        <ul class="nav nav-tabs" role="tablist">
          <li class="nav-item">
            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#proj" type="button">Projects</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#acc" type="button">Accomplishments</button>
          </li>
        </ul>
        <div class="tab-content flex-grow-1 mt-3">
          <div class="tab-pane fade show active" id="proj">
            <!-- Data here -->
            ${renderProjectsDetails(b.projects)}
            ${getActiveProjects(b.projects)}

          </div>
          <div class="tab-pane fade" id="acc">
            <ul class="list-group list-group-flush">
              ${b.accomplishments.map(a => `<li class="list-group-item">${a.description}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
    </div>`;
}

function renderProjectsDetails(projects) {
  let totalProjects = projects.length;
  let totals = { "completed": 0, "ongoing": 0, "issues": 0 }

  console.log(projects[1]);
  projects.forEach(project => {
    switch (project.status) {
      case "Completed":
        totals["completed"] += 1;
        break;
      case "On Track":
        totals["ongoing"] += 1;
        break;
      default:
        totals["issues"] += 1;
        break;
    }
  });


  return `
          <div class="row mt-4">
          <div class="col-md-3 mb-4">
            <div class="card bg-primary text-white stat-card">
              <div class="card-body">
                <h5 class="card-title"><i class="fas fa-project-diagram me-2"></i>Projects</h5>
    <h2 class="display-6">${totalProjects}</h2>
                <p class="card-text">Total Projects</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="card bg-success text-white stat-card">
              <div class="card-body">
                <h5 class="card-title"><i class="fas fa-check-circle me-2"></i>Completed</h5>
                <h2 class="display-6">${totals["completed"]}</h2>
                <p class="card-text">Completed Projects</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="card bg-warning text-white stat-card">
              <div class="card-body">
                <h5 class="card-title"><i class="fas fa-spinner me-2"></i>Ongoing</h5>
                <h2 class="display-6">${totals["ongoing"]}</h2>
                <p class="card-text">In Progress Projects</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="card bg-danger text-white stat-card">
              <div class="card-body">
                <h5 class="card-title"><i class="fas fa-exclamation-triangle me-2"></i>Issues</h5>
                <h2 class="display-6">${totals["issues"]}</h2>
                <p class="card-text">Delayed Projects</p>
              </div>
            </div>
          </div>
        </div>

    `
}

// TODO: Move the Active Project HTML here to make it dynamic.
function getActiveProjects(projects) {
  return `
      <!-- Active Projects Section -->
      <div id="projects-section" class="mb-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Active Projects</h2>
        </div>
        
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
            ${projects.map(p => {
              return ` 
                <tr>
                  <td>${p.id}</td>
                  <td>${p.title}</td>
                  <td>${p.start_date}</td>
                  <td>${p.end_date}</td>
                  <td>${
                    (() => {
                      if (p.status === 'Completed')     return `<span class="badge bg-success">Completed</span>`;
                      else if (p.status === 'Delayed')   return `<span class="badge bg-warning">Delayed</span>`;
                      else if (p.status === 'On Track')  return `<span class="badge bg-success">On Track</span>`;
                      else                                 return `<span class="badge bg-danger">At Risk</span>`;
                    })()
                  }</td>
                </tr>
              ` 
            })
            }
            </tbody>
          </table>
        </div>
      </div>
    `
  ;

}
