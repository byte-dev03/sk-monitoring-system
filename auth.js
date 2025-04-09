// DOM elements
const loginForm = document.getElementById("login-form");
const loginSection = document.getElementById("login-section");
const messageDiv = document.getElementById("message");
const rememberMe = document.getElementById("remember-me");

// Check if user is already logged in
document.addEventListener("DOMContentLoaded", function () {
  checkAuthStatus();
});

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Validate inputs
  if (!username || !password) {
    showMessage("Please enter both username and password", "danger");
    return;
  }

  try {
    // Fetch users data from users.json
    const response = await fetch('./data/users.json');
    const users = await response.json();

    // Check if the username and password match any user
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      // Store auth info
      const authData = {
        username: user.username,
        remembered: rememberMe.checked,
        timestamp: new Date().getTime(),
      };

      if (rememberMe.checked) {
        localStorage.setItem("authUser", JSON.stringify(authData));
      } else {
        sessionStorage.setItem("authUser", JSON.stringify(authData));
      }

      showMessage("Login successful! Redirecting to dashboard...", "success");

      // Show dashboard after brief delay
      setTimeout(() => {
        if (user.username === "admin") {
          window.location.href = "/admin/index.html";
        } else {
          window.location.href = "/users/index.html";
        }
      }, 1500);
    } else {
      showMessage("Invalid username or password", "danger");
    }
  } catch (error) {
    console.log("Login error: ", error);
    showMessage("Error fetching user data. Please try again later.", "danger");
  }
});

// Check if user is already logged in
function checkAuthStatus() {
  const authUser =
    JSON.parse(localStorage.getItem("authUser")) ||
    JSON.parse(sessionStorage.getItem("authUser"));

  if (authUser) {
    // Redirect to the appropriate dashboard
    if (authUser.username === "admin") {
      window.location.href = "/admin/index.html";
    } else {
      window.location.href = "/users/index.html";
    }
  } else {
    showLoginForm();
  }
}

// Show login form and hide dashboard
function showLoginForm() {
  loginSection.classList.remove("d-none");
  loginForm.reset();
  messageDiv.innerHTML = "";
}

// Show message to user
function showMessage(message, type) {
  messageDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

