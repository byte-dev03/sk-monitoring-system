import "./style.css";

// Mock user database (in a real app, this would be on the server)
// const users = [
//   { username: "user1", password: "pass1" },
//   { username: "admin", password: "admin123" },
// ];

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
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    console.log(result);
  
    if (response.ok) {
      // Store auth info
      const authData = {
        username: result.username,
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
        if (result.username === "admin") {
          window.location.href = "/admin/index.html";
        } else {
          window.location.href = "/users/index.html";
        }
      }, 1500);
    } else {
      showMessage(result.message || "Invalid username or password", "danger");
    }
  } catch (error) {
    console.log("Login error: ", error);
    showMessage("Server error. Please try again later.", "danger");
  }


});

// Check if user is already logged in
async function checkAuthStatus() {
  // Check both localStorage and sessionStorage
  const authUser =
    JSON.parse(localStorage.getItem("authUser")) ||
    JSON.parse(sessionStorage.getItem("authUser"));

  if (!authUser) {
    showLoginForm();
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/session", {
      method: "GET",
      credentials: "include"
    });

    const result = await response.json();

    if (response.ok && result.isAuthenticated) {
      // Optional: Check if the session has expired (if you want to implement session timeout)
      const currentTime = new Date().getTime();
      const sessionTime = authUser.timestamp;
      const sessionTimeout = 1000 * 60 * 30; // 30 minutes

      if (currentTime - sessionTime > sessionTimeout && !authUser.remembered) {
        // Session expired
        sessionStorage.removeItem("authUser");
        showLoginForm();
      } else {
        if (authUser.username === "admin") {
          window.location.href = "/admin/index.html";
        } else {
          window.location.href = "/users/index.html";
        }
      }
    } else {
      // Session isnt valid on the server
      localStorage.removeItem("authUser");
      sessionStorage.removeItem("authUser");
      showLoginForm();
    }
  } catch (error) {
    console.error("Error verifying session:", error);
    showMessage("Server error. Please try again later.", "danger");
  }
}

// Show login form and hide dashboard
function showLoginForm() {
  loginSection.classList.remove("d-none");
  loginForm.reset();
  messageDiv.innerHTML = "";
}

// Show mkssage to user
function showMessage(message, type) {
  messageDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}
