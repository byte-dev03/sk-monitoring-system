document.addEventListener("DOMContentLoaded", () => {
  // Check if user is authenticated
  const authUser =
    JSON.parse(localStorage.getItem("authUser")) ||
    JSON.parse(sessionStorage.getItem("authUser"));

  if (!authUser) {
    window.location.href = "/index.html"; // redirect to login
  } else {
    console.log("Logged in as:", authUser.username);

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
  }
});
