import { updateUI } from './ui_utils.js'; // Import the updateUI function

document.addEventListener("DOMContentLoaded", () => {
    fetch(urls.user_info)
        .then(response => response.json())
        .then(data => {
            // Call updateUI with currentUser object received from backend
            updateUI(data.currentUser);
        })
        .catch(error => console.error('Error fetching user info:', error));

    const searchButton = document.getElementById("search-button");
    const searchField = document.getElementById("search-field");
    const categorySelect = document.getElementById("category");
    const resultsContainer = document.getElementById("results");

    searchButton.addEventListener("click", () => {
        const query = searchField.value.trim();
        const category = categorySelect.value;

        if (query) {
            fetch(`${urls.search_books}?query=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
                .then(async response => {
                    if (!response.ok) {
                        const err = await response.json();
                        throw new Error(err.error);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.books) {
                        displayResults(data.books);
                    } else {
                        console.error('Books data is missing:', data);
                    }
                })
                .catch(error => console.error('Error fetching search results:', error));
        } else {
            resultsContainer.innerHTML = '<p>Please enter a search term</p>';
        }
    });

    const displayResults = (books) => {
        resultsContainer.innerHTML = ''; // Clear previous results

        if (!books || books.length === 0) {
            resultsContainer.innerHTML = '<p>No books found</p>';
            return;
        }

        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Author</th>
                <th>Availability</th>
                <th>Actions</th>
            </tr>
        `;

        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${urls.static_url}images/${book.image.split('image/')[1]}" alt="${book.title}" width="50"></td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.availability ? 'Available' : 'Borrowed'}</td>
                <td>
                    <button class="show-button" data-id="${book.id}">Show</button>
                    ${book.availability ? `<button class="borrow-button" data-id="${book.id}">Borrow</button>` : ''}
                </td>
            `;
            table.appendChild(row);
        });

        resultsContainer.appendChild(table);

        // Add event listeners to "Show" and "Borrow" buttons
        attachEventListeners();
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
                modalContent.innerHTML = `
                    <h2>${book.title}</h2>
                    <img src="${urls.static_url}images/${book.image.split('image/')[1]}" alt="${book.title}" width="100">
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Description:</strong> ${book.description}</p>
                    <p><strong>Genre:</strong> ${book.genre}</p>
                    <p><strong>Availability:</strong> ${book.availability ? 'Available' : 'Borrowed'}</p>
                `;
                document.getElementById('bookModal').style.display = 'block';
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

    // Modal handling
    const modal = document.getElementById('bookModal');
    const closeModal = document.querySelector('.close');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});