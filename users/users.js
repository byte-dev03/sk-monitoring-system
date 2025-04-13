import { renderUploadUI } from "./upload.js";

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is authenticated
  const authUser =
    JSON.parse(localStorage.getItem("authUser")) ||
    JSON.parse(sessionStorage.getItem("authUser"));

  if (!authUser) {
    return void (window.location.href = "index.html");
  }

  console.log("Logged in as:", authUser.username);

  // Dynamically add navbar to each user's routes
  const headers = document.getElementsByTagName("header");
  if (!window.location.href.includes("index.html")) {
    Array.from(headers).forEach((header) => populateHeader(header));
  }

  // Set user information in the UI
  document.getElementById("user-username").textContent = authUser.username;

  // Handle logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    // Clear authentication data
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authUser");

    // Redirect to login page
    window.location.href = "/index.html";
    console.log("Logged out");
  });

  // Initialize modals
  initModals();
  
  // Load user data
  loadUserData();

  if (window.location.href.includes("index.html")) {
    // Setup the upload UI for the user's dashboard
    renderUploadUI("#uploadModal .modal-body");
  } else if (window.location.href.includes("profile.html")){
    const backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', ()=> {
      window.location.href = "index.html"
    })
  }

  // Handle new project form submission
  const newProjectForm = document.getElementById('newProjectForm');
  if (newProjectForm) {
    newProjectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const projectData = {
        id: Date.now(), // Generate a unique ID
        title: formData.get('title'),
        description: formData.get('description'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        status: 'On Track',
        progress: 0,
        updated_at: new Date().toISOString()
      };

      // Add new project to existing projects
      const projectsContainer = document.querySelector('#project-cards');
      if (projectsContainer) {
        const projectHtml = `
          <div class="col-md-6 col-lg-4">
            <div class="card project-card" data-project-id="${projectData.id}">
              <span class="badge bg-info status-badge">${projectData.status}</span>
              <div class="card-body">
                <h5 class="card-title">${projectData.title}</h5>
                <p class="card-text">${projectData.description}</p>
                <div class="d-flex justify-content-between mb-1">
                  <small>Progress</small>
                  <small>${projectData.progress}%</small>
                </div>
                <div class="progress">
                  <div class="progress-bar bg-info" 
                       role="progressbar" 
                       style="width: ${projectData.progress}%" 
                       aria-valuenow="${projectData.progress}" 
                       aria-valuemin="0" 
                       aria-valuemax="100">
                  </div>
                </div>
                <div class="mt-3">
                  <small class="text-muted">
                    <i class="fas fa-calendar me-1"></i> Deadline: ${new Date(projectData.end_date).toLocaleDateString()}
                  </small>
                </div>
                <div class="mt-3">
                  <button class="btn btn-sm btn-outline-primary me-1 view-project" data-project-id="${projectData.id}">
                    <i class="fas fa-eye me-1"></i>View
                  </button>
                  <button class="btn btn-sm btn-outline-success" data-bs-toggle="modal" data-bs-target="#uploadModal">
                    <i class="fas fa-upload me-1"></i>Upload Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
        projectsContainer.insertAdjacentHTML('afterbegin', projectHtml);
      }

      // Add to recent activities
      addToRecentActivities({
        title: projectData.title,
        description: 'New project added',
        type: 'Project',
        date: new Date().toISOString(),
        status: projectData.status
      });

      // Close modal and reset form
      const modal = bootstrap.Modal.getInstance(document.getElementById('newProjectModal'));
      modal.hide();
      e.target.reset();
    });
  }

  // Handle new accomplishment form submission
  const newAccomplishmentForm = document.getElementById('newAccomplishmentForm');
  if (newAccomplishmentForm) {
    newAccomplishmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const accomplishmentData = {
        id: Date.now(),
        title: formData.get('title'),
        description: formData.get('description'),
        completed_at: new Date().toISOString(),
        status: 'Completed'
      };

      // Add new accomplishment to existing accomplishments
      const accomplishmentsContainer = document.querySelector('#accomplishment-cards');
      if (accomplishmentsContainer) {
        const accomplishmentHtml = `
          <div class="col-md-6 col-lg-4">
            <div class="card accomplishment-card mb-3">
              <div class="card-body">
                <h5 class="card-title">${accomplishmentData.title}</h5>
                <p class="card-text">${accomplishmentData.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    <i class="fas fa-calendar me-1"></i> ${new Date(accomplishmentData.completed_at).toLocaleDateString()}
                  </small>
                  <span class="badge bg-${getStatusColor(accomplishmentData.status)}">${accomplishmentData.status}</span>
                </div>
              </div>
            </div>
          </div>
        `;
        accomplishmentsContainer.insertAdjacentHTML('afterbegin', accomplishmentHtml);
      }

      // Add to recent activities
      addToRecentActivities({
        title: accomplishmentData.title,
        description: 'New accomplishment added',
        type: 'Accomplishment',
        date: accomplishmentData.completed_at,
        status: accomplishmentData.status
      });

      // Close modal and reset form
      const modal = bootstrap.Modal.getInstance(document.getElementById('newAccomplishmentModal'));
      modal.hide();
      e.target.reset();
    });
  }
});

const handleInputChange = (event) => {
  const file = event.target.files[0];
  const preview = document.getElementById("preview");
  const previewContainer = document.querySelector(".preview-container");

  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      previewContainer.classList.remove("d-none");
    };
    reader.readAsDataURL(file);
  } else {
    previewContainer.classList.add("d-none");
  }
};

// Function to add new project or accomplishment based on type
export function addNew(type) {
  const title =
    type === "project" ? "Add new project" : "Add new accomplishment";
  const modalClass = type === "project" ? "modal" : "modal-lg";
  const content =
    type === "project"
      ? `
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <form class="form-group needs-validation" novalidate>
              <div class="form-floating mb-3">
                <input id='title' class="form-control form-floating mt-2" type="text" placeholder="Add title...">
                <label for='title' class='form-label'>Title</label>
              </div>

              <div class="form-floating mb-3">
                <textarea id='desc' rows="4" class="form-control" placeholder="Add description..."></textarea>
                <label for='desc' class='form-label'>Description</label>
                <div class="invalid-feedback">
                  Please provide a description.
                </div>
              </div>

              <div class="form-group mt-2 mb-3">
              <div class="form-floating mb-3">
                <input id="start-date" type="date" class="form-control text-center">
                <label class="form-label" for="start-date">Start Date</label>
                <div class="invalid-feedback">
                  Please provide a start date.
                </div>
              </div>
              <div class="form-floating mb-3">
                <input id="end-date" type="date" class="form-control text-center">
                <label class="form-label mt-2" for="start-date">End Date</label>
                <div class="invalid-feedback">
                  Please provide an end date.
                </div>
              </div>

              <button id='submit-form' type="submit" class="btn btn-primary col-12" >Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
      : `
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <form class="form-group needs-validation" novalidate>
              <div class="form-floating mb-3 w-100 w-md-50 mx-auto">
                <input id='title' class="form-control form-floating mt-2" type="text" placeholder="Add title...">
                <label for='title' class='form-label'>Title</label>
                <div class="invalid-feedback">
                  Please provide a title.
                </div>
              </div>

              <div class="form-floating mb-3 w-100 w-md-50 mx-auto">
                <textarea id='desc' rows="4" class="form-control" placeholder="Add description..."></textarea>
                <label for='desc' class='form-label'>Description</label>
                <div class="invalid-feedback">
                  Please provide a description.
                </div>
              </div>
      
              <div class="d-flex flex-column justify-content-center align-items-center mt-5">
                <h6 class="text-nowrap">Upload Image about the Accomplishment Activity</h6>
                <div class="file-upload-container mb-3">
                  <input class="form-control" type="file" accept "image/*" id='image-input'>
                </div>
                <div class='preview-container d-none'>
                  <image class="img-fluid rounded shadow" id="preview" alt="Preview Image">
                </div>
                <div class="invalid-feedback">
                  Please provide an image.
                </div>
              </div>
              <button id='submit-form' type="submit" class="btn btn-primary col-12" >Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const modalHtml = `
    <div class="${modalClass} modal fade" id="newModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Insert the modal HTML into the body
  document.body.insertAdjacentHTML("beforeend", modalHtml);
  if (type == "accomplishment") {
    document
      .querySelector("#image-input")
      .addEventListener("change", handleInputChange);
  } else {
    const submitBtn = document.querySelector("#submit-form");
    const titleInput = document.querySelector("#title");
    const descInput = document.querySelector("#desc");
    const startDateInput = document.querySelector("#start-date");
    const endDateInput = document.querySelector("#end-date");

    submitBtn.addEventListener("click", () => {
      const formData = new FormData();
      formData.append("title", titleInput.value);
      formData.append("description", descInput.value);
      formData.append("start_date", startDateInput.value);
      formData.append("end_date", endDateInput.value);

      createNewProject(formData);
    });

    titleInput.value = "";
    descInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
  }

  // Use Bootstrap's modal method to show the modal
  const modalElement = document.querySelector("#newModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Clean up the modal after it is hidden
  modalElement.addEventListener("hidden.bs.modal", function () {
    modalElement.remove();
  });
}

function createNewProject(projectData) {
  const container = document.getElementById('project-cards');
  const fragment = document.createDocumentFragment();
  const progress = projectData.progress ?? 0;

  // Outer column
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4';

  // Card
  const card = document.createElement('div');
  card.className = 'card project-card';

  // Status badge
  const badge = document.createElement('span');
  badge.className = `badge ${progress === 100 ? 'bg-success' : 'bg-warning'} status-badge`;
  badge.textContent = progress === 100 ? 'Completed' : 'In Progress';

  // Card body
  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('h5');
  title.className = 'card-title';
  title.textContent = projectData.title;

  const desc = document.createElement('p');
  desc.className = 'card-text';
  desc.textContent = projectData.description;

  // Progress label
  const progressRow = document.createElement('div');
  progressRow.className = 'd-flex justify-content-between mb-1';
  progressRow.innerHTML = `
    <small>Progress</small>
    <small>${progress}%</small>
  `;

  // Progress bar
  const progWrapper = document.createElement('div');
  progWrapper.className = 'progress';
  const progBar = document.createElement('div');
  progBar.className = 'progress-bar';
  progBar.setAttribute('role', 'progressbar');
  progBar.setAttribute('aria-valuemin', '0');
  progBar.setAttribute('aria-valuemax', '100');
  progBar.setAttribute('aria-valuenow', progress);
  progBar.style.width = `${progress}%`;
  progWrapper.appendChild(progBar);

  // Deadline
  const deadline = document.createElement('div');
  deadline.className = 'mt-3';
  deadline.innerHTML = `
    <small class="text-muted">
      <i class="fas fa-calendar me-1"></i>
      Deadline: ${projectData.end_date}
    </small>
  `;

  // Actions
  const actions = document.createElement('div');
  actions.className = 'mt-3';
  actions.innerHTML = `
    <a href="#" class="btn btn-sm btn-outline-primary me-1">
      <i class="fas fa-eye me-1"></i>View
    </a>
    <a class="btn btn-sm btn-outline-success"
       data-bs-toggle="modal"
       data-bs-target="#uploadModal">
      <i class="fas fa-upload me-1"></i>Upload Report
    </a>
  `;

  // Assemble
  card.appendChild(badge);
  body.append(title, desc, progressRow, progWrapper, deadline, actions);
  card.appendChild(body);
  col.appendChild(card);
  fragment.appendChild(col);

  // One single insert
  container.appendChild(fragment);
}

function populateHeader(header) {
  header.innerHTML = `
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#">SK Federation Monitoring System</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                <div class="avatar">U</div>
                <span id="user-username">User</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item" href="./profile.html"><i class="fas fa-user me-2"></i>Profile</a>
                </li>
                <li>
                  <a id='notifs-btn' class="dropdown-item" href="#" data-bs-toggle="modal" data-target="#notificationModal"><i class="fas fa-bell me-2"></i>Notifications</a>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#" id="logout-btn"><i class="fas fa-sign-out-alt me-2"
                    ></i>Logout</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `;
}

function initModals() {
  // New Project Modal
  const newProjectBtn = document.getElementById('newProject');
  if (newProjectBtn) {
    newProjectBtn.addEventListener('click', () => {
      const modal = new bootstrap.Modal(document.getElementById('newProjectModal'));
      modal.show();
    });
  }

  // New Accomplishment Modal
  const newAccomplishmentBtn = document.getElementById('newAccomplishment');
  if (newAccomplishmentBtn) {
    newAccomplishmentBtn.addEventListener('click', () => {
      const modal = new bootstrap.Modal(document.getElementById('newAccomplishmentModal'));
      modal.show();
    });
  }

  // Upload Report Modal
  const uploadBtns = document.querySelectorAll('[data-bs-target="#uploadModal"]');
  uploadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectId = e.target.closest('.project-card').dataset.projectId;
      document.getElementById('uploadProjectId').value = projectId;
    });
  });
}

async function loadUserData() {
  try {
    const response = await fetch('../data/sk_federation_data.json');
    const data = await response.json();
    
    // Get the authenticated user
    const authUser = JSON.parse(localStorage.getItem("authUser")) || 
                    JSON.parse(sessionStorage.getItem("authUser"));
    
    // Get user's barangay from users.json
    const usersResponse = await fetch('../data/users.json');
    const users = await usersResponse.json();
    const user = users.find(u => u.username === authUser.username);
    
    if (!user) {
      console.error('User not found');
      return;
    }

    // Find user's barangay
    const userBarangay = data.find(b => b.name === user.info.assigned_barangay);
    if (!userBarangay) {
      console.error('Barangay not found for user');
      return;
    }

    // Render projects
    renderProjects(userBarangay.projects);
    
    // Render accomplishments
    renderAccomplishments(userBarangay.accomplishments);
    
    // Render recent activities
    renderRecentActivities(userBarangay);
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}

function renderProjects(projects) {
  const projectsContainer = document.querySelector('.row.mb-4');
  if (!projectsContainer) return;

  projectsContainer.innerHTML = projects.map(project => `
    <div class="col-md-6 col-lg-4">
      <div class="card project-card" data-project-id="${project.id}">
        <span class="badge bg-${getStatusColor(project.status)} status-badge">${project.status}</span>
        <div class="card-body">
          <h5 class="card-title">${project.title}</h5>
          <p class="card-text">${project.description}</p>
          <div class="d-flex justify-content-between mb-1">
            <small>Progress</small>
            <small>${project.progress}%</small>
          </div>
          <div class="progress">
            <div class="progress-bar bg-${getStatusColor(project.status)}" 
                 role="progressbar" 
                 style="width: ${project.progress}%" 
                 aria-valuenow="${project.progress}" 
                 aria-valuemin="0" 
                 aria-valuemax="100">
            </div>
          </div>
          <div class="mt-3">
            <small class="text-muted">
              <i class="fas fa-calendar me-1"></i> Deadline: ${new Date(project.end_date).toLocaleDateString()}
            </small>
          </div>
          <div class="mt-3">
            <button class="btn btn-sm btn-outline-primary me-1 view-project" data-project-id="${project.id}">
              <i class="fas fa-eye me-1"></i>View
            </button>
            <button class="btn btn-sm btn-outline-success" data-bs-toggle="modal" data-bs-target="#uploadModal">
              <i class="fas fa-upload me-1"></i>Upload Report
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Add event listeners for view buttons
  document.querySelectorAll('.view-project').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectId = e.target.closest('.project-card').dataset.projectId;
      viewProjectDetails(projectId);
    });
  });
}

function renderAccomplishments(accomplishments) {
  const accomplishmentsContainer = document.querySelector('#accomplishment-cards');
  if (!accomplishmentsContainer) return;

  accomplishmentsContainer.innerHTML = accomplishments.map(accomplishment => `
    <div class="col-md-6 col-lg-4">
      <div class="card accomplishment-card mb-3">
        <div class="card-body">
          <h5 class="card-title">${accomplishment.title}</h5>
          <p class="card-text">${accomplishment.description}</p>
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
              <i class="fas fa-calendar me-1"></i> ${new Date(accomplishment.completed_at).toLocaleDateString()}
            </small>
            <span class="badge bg-${getStatusColor(accomplishment.status)}">${accomplishment.status}</span>
          </div>
          ${accomplishment.report_url ? `
            <div class="mt-2">
              <a href="${accomplishment.report_url}" target="_blank" class="btn btn-sm btn-outline-primary">
                <i class="fas fa-file-pdf me-1"></i>View Report
              </a>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function renderRecentActivities(barangay) {
  const activitiesContainer = document.querySelector('.list-group.list-group-flush');
  if (!activitiesContainer) return;

  // Combine projects and accomplishments and sort by date
  const recentActivities = [
    ...barangay.projects.map(p => ({
      ...p,
      type: 'Project',
      date: p.updated_at || p.start_date,
      icon: 'project-diagram',
      status: p.status
    })),
    ...barangay.accomplishments.map(a => ({
      ...a,
      type: 'Accomplishment',
      date: a.completed_at,
      icon: 'check-circle',
      status: a.status
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5);

  activitiesContainer.innerHTML = recentActivities.map(activity => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <strong>${activity.title}</strong>
        <p class="mb-0 text-muted">
          <i class="fas fa-${activity.icon} me-1"></i>
          ${activity.type} • ${new Date(activity.date).toLocaleDateString()}
        </p>
        <small class="text-muted">${activity.description}</small>
      </div>
      <span class="badge bg-${getStatusColor(activity.status)}">${activity.status}</span>
    </li>
  `).join('');
}

function getStatusColor(status) {
  switch (status) {
    case 'Completed': return 'success';
    case 'On Track': return 'info';
    case 'Delayed': return 'warning';
    default: return 'secondary';
  }
}

function viewProjectDetails(projectId) {
  // Implement project details view
  console.log('Viewing project:', projectId);
}

function addToRecentActivities(activity) {
  const activitiesContainer = document.querySelector('.list-group.list-group-flush');
  if (!activitiesContainer) return;

  const activityHtml = `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <strong>${activity.title}</strong>
        <p class="mb-0 text-muted">
          <i class="fas fa-${activity.type === 'Project' ? 'project-diagram' : 'check-circle'} me-1"></i>
          ${activity.type} • ${new Date(activity.date).toLocaleDateString()}
        </p>
        <small class="text-muted">${activity.description}</small>
      </div>
      <span class="badge bg-${getStatusColor(activity.status)}">${activity.status}</span>
    </li>
  `;

  // Add new activity at the top
  activitiesContainer.insertAdjacentHTML('afterbegin', activityHtml);

  // Remove oldest activity if more than 5
  const activities = activitiesContainer.querySelectorAll('.list-group-item');
  if (activities.length > 5) {
    activities[activities.length - 1].remove();
  }
}

