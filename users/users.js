import { renderUploadUI } from "./upload.js";

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is authenticated
  const authUser =
    JSON.parse(localStorage.getItem("authUser")) ||
    JSON.parse(sessionStorage.getItem("authUser"));

  if (!authUser) {
    window.location.href = "/index.html"; // redirect to login
  }

  console.log("Logged in as:", authUser.username);

  // Dynamically add navbar to each users routes, (e.g their profile page, projects page, dashboard, etc.)
  const headers = document.getElementsByTagName('header');
  for (let i = 0; i < headers.length; i++) {
    populateHeader(headers[i]);
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


  // Setup the upload ui for the users dashboard
  renderUploadUI("#uploadModal .modal-body");
});

function populateHeader(header) {
  header.innerHTML = `
        <!-- Navigation Bar -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="#"
                    >SK Federation Monitoring System</a
                >
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item dropdown">
                            <a
                                class="nav-link dropdown-toggle"
                                href="#"
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                            >
                                <div class="avatar">U</div>
                                <span id="user-username">User</span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <a
                                        class="dropdown-item"
                                        href="./profile.html"
                                        ><i class="fas fa-user me-2"></i
                                        >Profile</a
                                    >
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#"
                                        ><i class="fas fa-bell me-2"></i
                                        >Notifications</a
                                    >
                                </li>
                                <li><hr class="dropdown-divider" /></li>
                                <li>
                                    <a
                                        class="dropdown-item"
                                        href="#"
                                        id="logout-btn"
                                        ><i class="fas fa-sign-out-alt me-2"></i
                                        >Logout</a
                                    >
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
  `;
}
