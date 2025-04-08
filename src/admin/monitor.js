import "./admin.css";


export async function initDropdown() {
  const sel = document.getElementById("barangay-select");
  if (!sel) throw new Error("#barangay-select not found");

  const res = await fetch("http://localhost:3000/api/barangays");
  if (!res.ok) throw new Error(`Failed to load barangays (${res.status})`);
  const allBarangays = await res.json();

  sel.innerHTML += allBarangays
    .map(b => `<option value="${b.id}">${b.name}</option>`)
    .join("");
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

export function initDashboardData() {
  const sel = document.getElementById("barangay-select");
  const detail = document.getElementById("barangay-detail");
  if (!sel || !detail) throw new Error("Missing #barangay-select or #barangay-detail");

  sel.addEventListener("change", async e => {
    const id = e.target.value;
    try {
      const res = await fetch(`http://localhost:3000/api/barangays/${id}`);
      if (!res.ok) throw new Error(`Error fetching barangay ${id}: ${res.status}`);
      const b = await res.json();
      renderDetail(b);
    } catch (err) {
      console.error(err);
      detail.innerHTML = `<div class="alert alert-danger">Failed to load data.</div>`;
    }
  });
}

function renderDetail(b) {
  document.getElementById("barangay-detail").innerHTML = `
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-between">
        <h5>${b.name}</h5>
        <span class="badge bg-primary">${b.projects.length} Projects</span>
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
            <ul class="list-group list-group-flush">
              ${b.projects.map(p => `<li class="list-group-item">${p.title}</li>`).join("")}
            </ul>
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

