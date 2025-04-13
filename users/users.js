import { renderUploadUI } from "./upload.js";

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is authenticated
  const authUser =
    JSON.parse(localStorage.getItem("authUser")) ||
    JSON.parse(sessionStorage.getItem("authUser"));

  if (!authUser) {
    return void (window.location.href = "../index.html");
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
  });


  if (window.location.href.includes("index.html")) {
    // Event listener for adding a new accomplishment
    document.querySelector("#newAccomplishment").addEventListener("click", () => {
      addNew("accomplishment");
    });

    // Event listener for adding a new project
    document.querySelector("#newProject").addEventListener("click", () => {
      addNew("project");
    });

      // Setup the upload UI for the user's dashboard
      renderUploadUI("#uploadModal .modal-body");
  } else if (window.location.href.includes("profile.html")){
    const backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', ()=> {
      window.location.href = "index.html"
    })
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

