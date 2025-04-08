import './style.css'

// Mock user database (in a real app, this would be on the server)
const users = [
    { username: 'user1', password: 'pass1' },
    { username: 'user2', password: 'pass2' },
    { username: 'admin', password: 'admin123' }
];

// DOM elements
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const dashboard = document.getElementById('dashboard');
const messageDiv = document.getElementById('message');
const userName = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const rememberMe = document.getElementById('remember-me');

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
});

// Handle login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validate inputs
    if (!username || !password) {
        showMessage('Please enter both username and password', 'danger');
        return;
    }
    
    // Authenticate user
    const user = authenticateUser(username, password);
    
    if (user) {
        // Store auth info
        const authData = { 
            username: user.username,
            remembered: rememberMe.checked,
            timestamp: new Date().getTime()
        };
        
        if (rememberMe.checked) {
            localStorage.setItem('authUser', JSON.stringify(authData));
        } else {
            sessionStorage.setItem('authUser', JSON.stringify(authData));
        }
        
        showMessage('Login successful! Redirecting to dashboard...', 'success');
        
        // Show dashboard after brief delay
        setTimeout(() => {
          if (user.username === "admin") {
            window.location.href = "/monitor.html";
          } else {
            window.location.href = "/upload.html";
          }
        }, 1500);
    } else {
        showMessage('Invalid username or password', 'danger');
    }
});

// // Handle logout
// logoutBtn.addEventListener('click', function() {
//     // Clear both storage types to be safe
//     localStorage.removeItem('authUser');
//     sessionStorage.removeItem('authUser');
//     showLoginForm();
// });
//
// Authentication function
function authenticateUser(username, password) {
    return users.find(user => 
        user.username === username && user.password === password
    );
}

// Check if user is already logged in
function checkAuthStatus() {
    // Check both localStorage and sessionStorage
    const authUser = JSON.parse(localStorage.getItem('authUser')) || 
                    JSON.parse(sessionStorage.getItem('authUser'));
    
    if (authUser) {
        // Optional: Check if the session has expired (if you want to implement session timeout)
        const currentTime = new Date().getTime();
        const sessionTime = authUser.timestamp;
        const sessionTimeout = 1000 * 60 * 30; // 30 minutes
        
        if (currentTime - sessionTime > sessionTimeout && !authUser.remembered) {
            // Session expired
            sessionStorage.removeItem('authUser');
            showLoginForm();
        } else {
          if (authUser.username == "admin") {
            window.location.href = "monitor.html";
          } else {
            window.location.href = "upload.html"; 
          }
        }
    } else {
        showLoginForm();
    }
}


// Show login form and hide dashboard
function showLoginForm() {
    loginSection.classList.remove('d-none');
    loginForm.reset();
    messageDiv.innerHTML = '';
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
