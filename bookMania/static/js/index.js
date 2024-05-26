import { updateUIIndex } from './ui_utils.js'; // Import the updateUI function

document.addEventListener("DOMContentLoaded", () => {
    fetch(urls.user_info)
        .then(response => response.json())
        .then(data => {
            // Call updateUIIndex with currentUser object received from backend
            updateUIIndex(data.currentUser);
        })
        .catch(error => console.error('Error fetching user info:', error));

    const getStartedButton = document.getElementById("get-started-button");
    if (getStartedButton) {
        getStartedButton.addEventListener("click", () => {
            window.location.href = urls.login;
        });
    }
});