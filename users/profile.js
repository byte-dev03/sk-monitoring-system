document.addEventListener('DOMContentLoaded', function() {
    const profile = document.getElementById('profile');
   
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
