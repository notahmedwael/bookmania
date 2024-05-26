import { updateUI } from './ui_utils.js';

document.addEventListener("DOMContentLoaded", () => {
    fetch(urls.user_info)
        .then(response => response.json())
        .then(data => {
            updateUI(data.currentUser);
        })
        .catch(error => console.error('Error fetching user info:', error));

    const modal = document.getElementById('bookModal');
    const closeModal = modal.querySelector('.close');
    const filterSelect = document.getElementById("filter");
    const bookList = document.getElementById("bookList");

    const fetchAvailableBooks = async (availability) => {
        let url = urls.get_available_books;
        if (availability && availability !== 'all') {
            url += `?filter=${availability}`;
        }

        try {
            const response = await fetch(url, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch available books");
            }
            const data = await response.json();
            displayBooks(data.books);
        } catch (error) {
            console.error("Error fetching available books:", error);
        }
    };

    const displayBooks = (books) => {
        bookList.innerHTML = "";
        if (books.length === 0) {
            const noBooksMessage = document.createElement('div');
            noBooksMessage.textContent = "No books available to show";
            noBooksMessage.classList.add('no-books-message');
            bookList.appendChild(noBooksMessage);
        } else {
            books.forEach((book) => {
                const bookCard = createBookCard(book);
                bookList.appendChild(bookCard);
            });
        }
    
        attachEventListeners();
    };
    

    const createBookCard = (book) => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
    
        const image = document.createElement("img");
        const imagePath = book.image.split('image/')[1]; // Extract path after 'image/'
        image.src = `${urls.static_url}images/${imagePath}`;
        image.alt = book.title;
        bookCard.appendChild(image);
    
        const title = document.createElement("h2");
        title.textContent = book.title;
        bookCard.appendChild(title);
    
        const author = document.createElement("p");
        author.textContent = `Author: ${book.author}`;
        bookCard.appendChild(author);
    
        const genre = document.createElement("p");
        genre.textContent = `Genre: ${book.genre}`;
        bookCard.appendChild(genre);
    
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");
    
        const showButton = document.createElement("button");
        showButton.textContent = "Show";
        showButton.classList.add("show-button");
        showButton.dataset.id = book.id;
        buttonContainer.appendChild(showButton);
    
        if (book.availability) {
            const borrowButton = document.createElement("button");
            borrowButton.textContent = "Borrow";
            borrowButton.classList.add("borrow-button");
            borrowButton.dataset.id = book.id;
            buttonContainer.appendChild(borrowButton);
        }
    
        bookCard.appendChild(buttonContainer);
    
        return bookCard;
    };
    
    
    
    const attachEventListeners = () => {
        document.querySelectorAll('.show-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const bookId = event.target.dataset.id;
                showBookDetails(bookId);
            });
        });

        document.querySelectorAll('.borrow-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const bookId = event.target.dataset.id;
                borrowBook(bookId);
            });
        });
    };

    const showBookDetails = (bookId) => {
        fetch(`${urls.get_book_details}?book_id=${bookId}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            const book = data.book;
            const modalContent = document.getElementById('modalContent');
            const imagePath = book.image.split('image/')[1]; // Extract path after 'image/'
            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <h2>${book.title}</h2>
                <img src="${urls.static_url}images/${imagePath}" alt="${book.title}">
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Description:</strong> ${book.description}</p>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p><strong>Availability:</strong> ${book.availability ? 'Available' : 'Not Available'}</p>
            `;
            modal.style.display = 'block';
    
            // Add event listener to close button
            const closeButton = modalContent.querySelector('.close');
            closeButton.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        })
        .catch(error => console.error('Error fetching book details:', error));
    };


    const borrowBook = (bookId) => {
        fetch(`${urls.borrow.replace('0', bookId)}`, {  // Correctly replace '0' with the actual bookId
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Book borrowed successfully');
                searchButton.click(); // Refresh the search results to update availability status
            } else {
                alert(data.message || 'Failed to borrow the book');
            }
        })
        .catch(error => console.error('Error borrowing book:', error));
    };
    
    
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


    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    filterSelect.addEventListener("change", (event) => {
        fetchAvailableBooks(event.target.value);
    });

    // Fetch and display books on initial load
    fetchAvailableBooks('all');
});
