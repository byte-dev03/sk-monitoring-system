import "./style.css"

// Check if user is authenticated
const authUser = JSON.parse(localStorage.getItem("authUser")) ||
                 JSON.parse(sessionStorage.getItem("authUser"));

if (!authUser) {
  window.location.href = "/index.html"; // redirect to login
} else {
  console.log("Logged in as:", authUser.username);
  
  // Set user information in the UI
  document.getElementById('user-username').textContent = authUser.username;
  document.getElementById('welcome-name').textContent = authUser.username;
  
  // Handle logout
  document.getElementById('logout-btn').addEventListener('click', function() {
    // Clear authentication data
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authUser");
    
    // Redirect to login page
    window.location.href = "/index.html";
  });
  
  // Initialize file upload functionality
  initFileUpload();
  
  // Initialize project cards functionality
  initProjectCards();
}

// File upload functionality
function initFileUpload() {
  const dragDropArea = document.getElementById('drag-drop-area');
  const fileInput = document.getElementById('file-input');
  const browseFilesBtn = document.getElementById('browse-files');
  const selectedFilesDiv = document.getElementById('selected-files');
  const submitReportBtn = document.getElementById('submit-report');
  
  let uploadedFiles = [];
  
  // Handle click on "Browse Files" button
  browseFilesBtn.addEventListener('click', () => {
    fileInput.click();
  });
  
  // Handle file selection through the file input
  fileInput.addEventListener('change', handleFileSelection);
  
  // Handle drag and drop events
  dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.style.borderColor = '#007bff';
    dragDropArea.style.backgroundColor = '#f8f9fa';
  });
  
  dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.style.borderColor = '#ddd';
    dragDropArea.style.backgroundColor = 'transparent';
  });
  
  dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.style.borderColor = '#ddd';
    dragDropArea.style.backgroundColor = 'transparent';
    
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  });
  
  // Handle submit report button
  submitReportBtn.addEventListener('click', () => {
    const projectSelect = document.getElementById('projectSelect');
    const reportType = document.getElementById('reportType');
    const comments = document.getElementById('comments');
    
    if (projectSelect.value === 'Choose a project...') {
      alert('Please select a project.');
      return;
    }
    
    if (reportType.value === 'Choose report type...') {
      alert('Please select a report type.');
      return;
    }
    
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file.');
      return;
    }
    
    // Here you would normally send the data to the server
    // For demonstration purposes, we'll just show an alert
    alert(`Report submitted successfully for ${projectSelect.options[projectSelect.selectedIndex].text}!`);
    
    // Reset form
    projectSelect.selectedIndex = 0;
    reportType.selectedIndex = 0;
    comments.value = '';
    uploadedFiles = [];
    selectedFilesDiv.innerHTML = '';
  });
  
  function handleFileSelection(e) {
    if (e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }
  
  function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum file size is 10MB.`);
        continue;
      }
      
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                         'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                         'image/jpeg', 'image/png'];
      
      if (!validTypes.includes(file.type)) {
        alert(`File ${file.name} has an invalid type. Please upload only PDF, DOC, DOCX, XLS, XLSX, JPG, or PNG files.`);
        continue;
      }
      
      uploadedFiles.push(file);
      
      // Create file element in the UI
      const fileElement = document.createElement('div');
      fileElement.className = 'alert alert-secondary d-flex justify-content-between align-items-center';
      
      // Determine file icon based on type
      let fileIcon;
      if (file.type === 'application/pdf') {
        fileIcon = 'fas fa-file-pdf text-danger';
      } else if (file.type.includes('word')) {
        fileIcon = 'fas fa-file-word text-primary';
      } else if (file.type.includes('excel')) {
        fileIcon = 'fas fa-file-excel text-success';
      } else if (file.type.includes('image')) {
        fileIcon = 'fas fa-file-image text-warning';
      } else {
        fileIcon = 'fas fa-file text-secondary';
      }
      
      fileElement.innerHTML = `
        <div>
          <i class="${fileIcon} me-2"></i>
          ${file.name} <span class="text-muted">(${formatFileSize(file.size)})</span>
        </div>
        <button class="btn btn-sm btn-outline-danger remove-file" data-index="${uploadedFiles.length - 1}">
          <i class="fas fa-times"></i>
        </button>
      `;
      
      selectedFilesDiv.appendChild(fileElement);
    }
    
    // Add event listeners to remove file buttons
    const removeButtons = document.querySelectorAll('.remove-file');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        uploadedFiles.splice(index, 1);
        e.currentTarget.parentElement.remove();
        
        // Update indexes for remaining remove buttons
        document.querySelectorAll('.remove-file').forEach((btn, idx) => {
          btn.setAttribute('data-index', idx);
        });
      });
    });
  }
  
  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  }
}

// Project cards functionality
function initProjectCards() {
  // Add click handler for "Upload Report" buttons on project cards
  const uploadButtons = document.querySelectorAll('.btn-outline-success');
  
  uploadButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get project name from the card
      const projectCard = e.target.closest('.card');
      const projectName = projectCard.querySelector('.card-title').textContent;
      
      // Set the project in the upload form dropdown
      const projectSelect = document.getElementById('projectSelect');
      
      for (let i = 0; i < projectSelect.options.length; i++) {
        if (projectSelect.options[i].text === projectName) {
          projectSelect.selectedIndex = i;
          break;
        }
      }
      
      // Scroll to upload form
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Focus on report type dropdown
      document.getElementById('reportType').focus();
    });
  });
  
  // Add click handler for "View" buttons on project cards
  const viewButtons = document.querySelectorAll('.btn-outline-primary');
  
  viewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get project name from the card
      const projectCard = e.target.closest('.card');
      const projectName = projectCard.querySelector('.card-title').textContent;
      
      alert(`Viewing details for project: ${projectName}`);
      // In a real application, you would navigate to a project details page or show a modal
    });
  });
}
