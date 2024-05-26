import { updateUI } from './ui_utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Fetch user info and update UI
    fetch(urls.user_info)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid content type, expected application/json');
            }
            return response.json();
        })
        .then(data => {
            updateUI(data.currentUser);
        })
        .catch(error => console.error('Error fetching user info:', error));

    const bookList = document.getElementById('bookList');
    const modal = document.getElementById('bookModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.querySelector('.modal .close');

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

    const csrftoken = getCookie('csrftoken');

    // Fetch borrowed books from API
    fetch(urls.borrowed_books, {
        method: 'GET',
        headers: {
            'X-CSRFToken': csrftoken,
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid content type, expected application/json');
        }
        return response.json();
    })
    .then(data => {
        const books = data.books;
        if (books.length === 0) {
            const noBooksMessage = document.createElement('div');
            noBooksMessage.classList.add('no-books-message');
            noBooksMessage.textContent = "You haven't borrowed any books yet.";
            bookList.appendChild(noBooksMessage);
        } else {
            books.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.classList.add('book-card');
                
                const imagePath = book.image.split('image/')[1]; // Extract path after 'image/'
                bookCard.innerHTML = `
                    <img src="${urls.static_url}images/${imagePath}" alt="${book.title}">
                    <h2>${book.title}</h2>
                    <p>${book.author}</p>
                    <button class="show-details" data-id="${book.id}">Show Details</button>
                `;

                bookList.appendChild(bookCard);
            });

            document.querySelectorAll('.show-details').forEach(button => {
                button.addEventListener('click', event => {
                    const bookId = event.target.getAttribute('data-id');
                    const book = books.find(book => book.id == bookId);

                    const imagePath = book.image.split('image/')[1]; // Extract path after 'image/'
                    modalContent.innerHTML = `
                        <h2>${book.title}</h2>
                        <img src="${urls.static_url}images/${imagePath}" alt="${book.title}">
                        <p>${book.author}</p>
                        <p>${book.description}</p>
                        <p><strong>Genre:</strong> ${book.genre}</p>
                    `;

                    modal.style.display = 'block';
                });
            });
        }
    })
    .catch(error => console.error('Error fetching borrowed books:', error));

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', event => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});