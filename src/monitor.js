import "bootstrap/dist/css/boostrap.css"
import "bootstrap/dist/js/bootstrap"

// Check if user is authenticated
const authUser = JSON.parse(localStorage.getItem("authUser")) ||
                 JSON.parse(sessionStorage.getItem("authUser"));

if (!authUser) {
  window.location.href = "/index.html"; // redirect to login
} else {
  console.log("Logged in as:", authUser.username);
  
  // Update username in the navbar
  document.getElementById('admin-username').textContent = authUser.username;
  
  // Handle logout
  document.getElementById('logout-btn').addEventListener('click', function() {
    // Clear authentication data
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authUser");
    
    // Redirect to login page
    window.location.href = "/index.html";
  });
  
  // Initialize sidebar navigation
  initSidebar();
  
  // Initialize dummy data (replace with actual API calls in production)
  initDashboardData();
}

// Sidebar navigation functionality
function initSidebar() {
  const navLinks = document.querySelectorAll('.sidebar .nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Remove active class from all links
      navLinks.forEach(item => item.classList.remove('active'));
      
      // Add active class to clicked link
      e.target.classList.add('active');
      
      // Scroll to section (smooth scroll)
      const targetId = e.target.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
      }
      
      e.preventDefault();
    });
  });
}

// Initialize dashboard data
function initDashboardData() {
  // In a real application, you would fetch this data from an API
  // For now, we'll use static data
  
  // Projects table functionality
  const projectActionButtons = document.querySelectorAll('.btn-info, .btn-warning, .btn-danger');
  
  projectActionButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const action = e.target.classList.contains('btn-info') ? 'view' : 
                     e.target.classList.contains('btn-warning') ? 'edit' : 'delete';
      
      const projectRow = e.target.closest('tr');
      const projectId = projectRow.cells[0].textContent;
      const projectName = projectRow.cells[1].textContent;
      
      if (action === 'view') {
        alert(`Viewing details for project: ${projectName} (${projectId})`);
        // Here you would show a modal with project details or navigate to a project details page
      } else if (action === 'edit') {
        alert(`Editing project: ${projectName} (${projectId})`);
        // Here you would show a modal with editable project fields
      } else if (action === 'delete') {
        if (confirm(`Are you sure you want to delete project: ${projectName} (${projectId})?`)) {
          alert(`Project deleted: ${projectName} (${projectId})`);
          // Here you would call an API to delete the project and then remove the row from the DOM
        }
      }
    });
  });
  
  // Add more event listeners and functionality as needed for other dashboard components
}
