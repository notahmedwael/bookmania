import { updateUI } from './ui_utils.js'; // Import the updateUI function

document.addEventListener("DOMContentLoaded", () => {
    fetch(urls.user_info)
        .then(response => response.json())
        .then(data => {
            // Call updateUI with currentUser object received from backend
            updateUI(data.currentUser);
        })
        .catch(error => console.error('Error fetching user info:', error));
});