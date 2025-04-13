document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    const authUser = JSON.parse(localStorage.getItem("authUser")) || 
                    JSON.parse(sessionStorage.getItem("authUser"));

    if (!authUser) {
        return void (window.location.href = "../index.html");
    }

    const profile = document.getElementById('profile');
    const logoutBtn = document.getElementById('logout-btn');
   
    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear authentication data
            localStorage.removeItem("authUser");
            sessionStorage.removeItem("authUser");
            console.log("Logged out");
            // Redirect to login page
            window.location.href = "/index.html";
        });
    }

    // Set user information in the UI
    document.getElementById("user-username").textContent = authUser.username;

    const userData = getUserData();
    userData.then(data => {
        if (data) {
            populateProfile(data);
        } else {
            console.error('No user data found');
        }
    });
});

async function getUserData() {
    try {
        const response = await fetch('../data/users.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}
    // Populate profile with user data
    function populateProfile(data) {
        for (const d of data) {
        if (d.username != "admin") {
            document.getElementById('name').textContent = d.info.name;
            document.getElementById('position').textContent = d.info.position;
            document.getElementById('contact-number').textContent = d.info.contact_number;
        }
    }
    }
