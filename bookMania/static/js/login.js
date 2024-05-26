const login = () => {
    const userEmail = document.getElementById("email").value;
    const userPassword = document.getElementById("password").value;
    const isAdmin = document.getElementById("adminCheck").checked;

    if (userEmail === "" || userPassword === "") {
        displayErrorMessage("Some input is empty");
        return;
    }

    // Prepare the data to be sent in the request
    const formData = new FormData();
    formData.append('email', userEmail);
    formData.append('password', userPassword);
    formData.append('is_admin', isAdmin);

    // Make an AJAX request to the login-handler endpoint
    fetch('/users/login-handler/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Include CSRF token in the request headers
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (isAdmin && data.is_admin) {
                alert("Admin login successful");
                window.location.href = data.redirect_url;
            } else {
                alert("User login successful");
                window.location.href = data.redirect_url;
            }
        } else {
            displayErrorMessage(`⚠ ` + data.message ); // Display error message
        }
    })
    .catch(error => {
        console.error('There was a problem with the login request:', error);
        displayErrorMessage('There was a problem with the login request. Please try again later.'); // Display error message
    });

    // Clear the form
    document.getElementById("login-form").reset();
};

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    login();
});

// Function to retrieve CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Function to display error message
function displayErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = message;
}