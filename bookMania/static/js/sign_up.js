const handleSubmit = async (event) => {
    event.preventDefault();

    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = ''; // Clear previous error messages

    if (!checkMatch()) {
        errorMessage.textContent = 'Passwords do not match';
        return;
    }

    const form = document.getElementById('signup-form');
    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': form.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });

        if (response.ok) {
            alert("Sign up successful");
            window.location.href = urls.login;
        } else {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                const errorData = await response.json();
                errorMessage.textContent = `Sign up failed: ${JSON.stringify(errorData)}`;
            } else {
                const errorText = await response.text();
                errorMessage.textContent = `Sign up failed: ${errorText}`;
            }
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'An error occurred while signing up';
    }
};

const checkMatch = () => {
    const password = document.getElementById('id_password').value;
    const confirmPassword = document.getElementById('id_confirm_password').value;

    return password === confirmPassword;
};

// Event listener for form submission
const form = document.getElementById('signup-form');
form.addEventListener('submit', handleSubmit);