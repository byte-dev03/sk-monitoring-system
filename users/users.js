import { renderUploadUI } from "./upload.js";

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is authenticated
  const authUser =
    JSON.parse(localStorage.getItem("authUser")) ||
    JSON.parse(sessionStorage.getItem("authUser"));

  if (!authUser) {
    window.location.href = "/index.html"; // redirect to login
    return; // Ensure no further code runs after redirect
  }

  console.log("Logged in as:", authUser.username);

  // Dynamically add navbar to each user's routes
  const headers = document.getElementsByTagName('header');
  Array.from(headers).forEach(header => populateHeader(header));

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

  // Setup the upload UI for the user's dashboard
  renderUploadUI("#uploadModal .modal-body");
});

const handleInputChange = (event) => {
  const file = event.target.files[0];
  const preview = document.getElementById('preview');
  const previewContainer = document.querySelector('.preview-container');

  if (file) {
    let reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      previewContainer.classList.remove('d-none');
    }
    reader.readAsDataURL(file);
  } else {
    previewContainer.classList.add('d-none');
  }

}

// Function to add new project or accomplishment based on type
export function addNew(type) {
  const title = type === "project" ? "Add new project" : "Add new accomplishment";
  const modalClass = type === "project" ? "modal" : "modal-lg";
  const content = type === "project" ? `
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <div class="form-group mb-3 col-md-10 w-75 mx-auto">
              <div class="form-floating mb-3">
                <input id='title' class="form-control form-floating mt-2" type="text" placeholder="Add title...">
                <label for='title' class='form-label'>Title</label>
              </div>

              <div class="form-floating mb-3">
                <textarea id='desc' rows="4" class="form-control" placeholder="Add description..."></textarea>
                <label for='desc' class='form-label'>Description</label>
              </div>

              <div class="form-group mt-2 mb-3">
              <div class="form-floating mb-3">
                <input id="start-date" type="date" class="form-control text-center">
                <label class="form-label" for="start-date">Start Date</label>
              </div>
              <div class="form-floating mb-3">
                <input id="end-date" type="date" class="form-control text-center">
                <label class="form-label mt-2" for="start-date">End Date</label>
              </div>

              <button id='submit-form' type="submit" class="btn btn-primary col-12" >Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ` : `
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <div class="mb-3 col-md-10 mx-auto">
              <div class="form-floating mb-3 w-50 mx-auto">
                <input id='title' class="form-control form-floating mt-2" type="text" placeholder="Add title...">
                <label for='title' class='form-label'>Title</label>
              </div>

              <div class="form-floating mb-3 w-50 mx-auto">
                <textarea id='desc' rows="4" class="form-control" placeholder="Add description..."></textarea>
                <label for='desc' class='form-label'>Description</label>
              </div>
      
              <div class="d-flex flex-column justify-content-center align-items-center mt-5">
                <h5>Upload Image about the Accomplishment Activity</h5>
                <div class="file-upload-container mb-3">
                  <input class="form-control" type="file" accept "image/*" id='image-input'>
                </div>
                <div class='preview-container d-none'>
                  <image class="img-fluid rounded shadow" id="preview" alt="Preview Image">
                </div>
              </div>
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
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  if (type == "accomplishment") {
    document.querySelector('#image-input').addEventListener('change', handleInputChange);
  } else {

    const submitBtn = document.querySelector('#submit-form');
    const titleInput = document.querySelector('#title');
    const descInput = document.querySelector('#desc');
    const startDateInput = document.querySelector('#start-date');
    const endDateInput = document.querySelector('#end-date');

    submitBtn.addEventListener('click', () => {
      const formData = new FormData();
      formData.append("title", titleInput.value);
      formData.append("description", descInput.value);
      formData.append("start_date", startDateInput.value);
      formData.append("end_date", endDateInput.value);
      console.log(formData);
    });

    titleInput.value = "";
    descInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
  }


  // Use Bootstrap's modal method to show the modal
  const modalElement = document.querySelector('#newModal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Clean up the modal after it is hidden
  modalElement.addEventListener('hidden.bs.modal', function() {
    modalElement.remove();
  });
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
                  <a class="dropdown-item" href="#"><i class="fas fa-bell me-2"></i>Notifications</a>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#" id="logout-btn"><i class="fas fa-sign-out-alt me-2
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

// Event listener for adding a new accomplishment
document.querySelector('#newAccomplishment').addEventListener('click', () => {
  addNew('accomplishment');
});

// Event listener for adding a new project
document.querySelector('#newProject').addEventListener('click', () => {
  addNew('project');
});


