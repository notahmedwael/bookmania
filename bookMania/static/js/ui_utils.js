export const updateUIIndex = (currentUser) => {
    const links = document.querySelector(".links");
    const navUl = document.querySelector(".nav");
    const welcomeText = document.querySelector(".welcome-text");

    if (currentUser) {
        let navContent = '';
        let textContent = `
            <div class="welcome-text">
                <h2>Welcome to <span id="library-welcome-title">BookMania</span></h2>
            </div>
        `;
        welcomeText.innerHTML = textContent;

        if (currentUser.is_admin) {
            navContent = `
                <ul>
                    <li><a href="${urls.index}">Homepage</a></li>
                    <li><a href="${urls.admin_panel}">Admin Panel</a></li>
                </ul>
            `;
        } else {
            navContent = `
                <ul>
                    <li><a href="${urls.index}">Homepage</a></li>
                    <li><a href="${urls.faq}">FAQ</a></li>
                    <li><a href="${urls.contact_us}">Contact Us</a></li>
                    <li><a href="${urls.user_panel}">User Panel</a></li>
                </ul>
            `;
        }

        navUl.innerHTML = navContent;

        links.innerHTML = `
            <div class="greeting-wrapper">
                <div class="greeting">
                    Hello, ${currentUser.username || "Admin"}!
                </div>
                <button id="sign-out-button" class="button">Sign Out</button>
            </div>`;

        const signOutButton = document.getElementById("sign-out-button");
        signOutButton.addEventListener("click", () => {
            const csrftoken = getCookie('csrftoken');
        
            fetch(urls.logout_user, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': csrftoken,
                }
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = urls.login;
                } else {
                    console.error('Logout failed');
                }
            })
            .catch(error => console.error('Error during logout:', error));
        });
        
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }        
    } else {
        // User is not logged in, show sign-up/login links and default welcome message
        welcomeText.innerHTML = `
            <div class="welcome-text">
                <h2>Welcome to <span id="library-welcome-title">BookMania</span></h2>
                <button id="get-started-button" type="button" class="button">Get Started</button>
            </div>
        `;

        navUl.innerHTML = `
            <ul>
                <li><a href="${urls.index}">Homepage</a></li>
                <li><a href="${urls.faq}">FAQ</a></li>
                <li><a href="${urls.contact_us}">Contact Us</a></li>
            </ul>
        `;

        links.innerHTML = `
            <a href="${urls.signup}">Sign Up</a> | <a href="${urls.login}">Login</a>
        `;
    }
};

export const updateUI = (currentUser) => {
    const links = document.querySelector(".links");
    const navUl = document.querySelector(".nav");

    if (currentUser) {
        let navContent = '';
        if (currentUser.is_admin) {
            navContent = `
                <ul>
                    <li><a href="${urls.index}">Homepage</a></li>
                    <li><a href="${urls.admin_panel}">Admin Panel</a></li>
                </ul>
            `;
        } else {
            navContent = `
                <ul>
                    <li><a href="${urls.index}">Homepage</a></li>
                    <li><a href="${urls.faq}">FAQ</a></li>
                    <li><a href="${urls.contact_us}">Contact Us</a></li>
                    <li><a href="${urls.user_panel}">User Panel</a></li>
                </ul>
            `;
        }

        navUl.innerHTML = navContent;

        // Update greeting and sign-out button
        links.innerHTML = `
            <div class="greeting-wrapper">
                <div class="greeting">
                    Hello, ${currentUser.username || "Admin"}!
                </div>
                <button id="sign-out-button" class="button">Sign Out</button>
            </div>`;

        const signOutButton = document.getElementById("sign-out-button");
        signOutButton.addEventListener("click", () => {
            const csrftoken = getCookie('csrftoken');

            fetch(urls.logout_user, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': csrftoken,
                }
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = urls.login;
                } else {
                    console.error('Logout failed');
                }
            })
            .catch(error => console.error('Error during logout:', error));
        });
        
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }            
    } else {
        // User is not logged in, show sign-up/login links
        navUl.innerHTML = `
            <ul>
                <li><a href="${urls.index}">Homepage</a></li>
                <li><a href="${urls.faq}">FAQ</a></li>
                <li><a href="${urls.contact_us}">Contact Us</a></li>
            </ul>
        `;

        links.innerHTML = `<a href="${urls.signup}">Sign Up</a> | <a href="${urls.login}">Login</a>`;
    }
};