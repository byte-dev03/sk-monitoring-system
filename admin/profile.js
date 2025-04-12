document.addEventListener('DOMContentLoaded', async function() {
    const profile = document.getElementById('profile');

    const userData = await getUserData();
    console.log(userData);
    userData.map((data) => {
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
        if (data.username == "admin") {
            document.getElementById('name').textContent = data.info.name;
        document.getElementById('position').textContent = data.info.position;
        }
        
    }
