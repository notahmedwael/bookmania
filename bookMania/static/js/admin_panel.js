import { updateUI } from './ui_utils.js';

document.addEventListener("DOMContentLoaded", () => {
    fetch(urls.user_info)
        .then(response => response.json())
        .then(data => updateUI(data.currentUser))
        .catch(error => console.error('Error fetching user info:', error));

    const modal = document.getElementById('bookModal');
    const closeModal = modal.querySelector('.close');
    const filterSelect = document.getElementById("filter");
    const resultsContainer = document.getElementById("results");
    const addEditBookModal = document.getElementById('addEditBookModal');
    const closeAddEditBookModal = addEditBookModal.querySelector('.close-add-edit-book-modal');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const closeDeleteConfirmModal = deleteConfirmModal.querySelector('.close-delete-confirm-modal');

    const fetchAvailableBooks = async (availability) => {
        let url = urls.get_available_books;
        if (availability && availability !== 'all') {
            url += `?filter=${availability}`;
        }

        try {
            const response = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
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
        resultsContainer.innerHTML = ''; 

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
                <th>Genre</th>
                <th>Availability</th>
                <th>Actions</th>
            </tr>
        `;

        books.forEach(book => {
            const row = document.createElement('tr');
            const imagePath = book.image.split('image/')[1]; // Extract path after 'image/'
            row.innerHTML = `
                <td><img src="${urls.static_url}images/${imagePath}" alt="${book.title}" width="100"></td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.genre}</td>
                <td>${book.availability ? 'Available' : 'Borrowed'}</td>
                <td>
                    <button class="show-button" data-id="${book.id}">Show</button>
                    <button class="edit-button" data-id="${book.id}">Edit</button>
                    <button class="delete-button" data-id="${book.id}">Delete</button>
                </td>
            `;
            table.appendChild(row);
        });

        const addRow = document.createElement('tr');
        addRow.innerHTML = `
            <td colspan="6" class="add-book-placeholder">
                <button class="add-book-button">Add New Book</button>
            </td>
        `;
        table.appendChild(addRow);

        resultsContainer.appendChild(table);

        attachEventListeners();
    };

    const attachEventListeners = () => {
        document.querySelectorAll('.show-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const bookId = event.target.dataset.id;
                showBookDetails(bookId);
            });
        });

        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const bookId = event.target.dataset.id;
                showAddEditBookModal(bookId);
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const bookId = event.target.dataset.id;
                showDeleteConfirmModal(bookId);
            });
        });

        document.querySelector('.add-book-button').addEventListener('click', () => {
            showAddEditBookModal();
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        closeAddEditBookModal.addEventListener('click', () => {
            addEditBookModal.style.display = 'none';
        });

        closeDeleteConfirmModal.addEventListener('click', () => {
            deleteConfirmModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
            if (event.target == addEditBookModal) {
                addEditBookModal.style.display = 'none';
            }
            if (event.target == deleteConfirmModal) {
                deleteConfirmModal.style.display = 'none';
            }
        });

        document.querySelectorAll('.close-delete-confirm-modal').forEach(button => {
            button.addEventListener('click', () => {
                deleteConfirmModal.style.display = 'none';
            });
        });
    };

    const showBookDetails = (bookId) => {
        fetch(`${urls.get_book_details}?book_id=${bookId}`, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
            .then(response => response.json())
            .then(data => {
                const book = data.book;
                const modalContent = document.getElementById('modalContent');
                const imagePath = book.image.split('image/')[1]; // Extract path after 'image/'
                modalContent.innerHTML = `
                    <h2>${book.title}</h2>
                    <img src="${urls.static_url}images/${imagePath}" alt="${book.title}">
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Description:</strong> ${book.description}</p>
                    <p><strong>Genre:</strong> ${book.genre}</p>
                    <p><strong>Availability:</strong> ${book.availability ? 'Available' : 'Borrowed'}</p>
                `;
                document.getElementById('bookModal').style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching book details:', error);
                const modalContent = document.getElementById('modalContent');
                modalContent.innerHTML = '<p>Error fetching book details. Please try again later.</p>';
                document.getElementById('bookModal').style.display = 'block';
            });
    };

    const showAddEditBookModal = (bookId) => {
        const isEdit = Boolean(bookId);
        const modalTitle = document.getElementById('addEditBookModalTitle');
        const modalForm = document.getElementById('addEditBookForm');
    
        if (isEdit) {
            modalTitle.innerText = 'Edit Book';
            fetch(`${urls.get_book_details}?book_id=${bookId}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            })
                .then(response => response.json())
                .then(data => {
                    const book = data.book;
                    modalForm.bookId.value = bookId;
                    modalForm.title.value = book.title;
                    modalForm.author.value = book.author;
                    modalForm.description.value = book.description;
                    modalForm.genre.value = book.genre;
                    modalForm.image.value = book.image;
                    modalForm.availability.checked = book.availability;
                    addEditBookModal.style.display = 'block';
                })
                .catch(error => console.error('Error fetching book details:', error));
        } else {
            modalTitle.innerText = 'Add New Book';
            modalForm.reset();
            modalForm.bookId.value = '';
            addEditBookModal.style.display = 'block';
        }
    
        const saveButton = document.getElementById('saveBookButton');
        saveButton.onclick = () => {
            const bookId = modalForm.bookId.value;
            const bookData = {
                title: modalForm.title.value,
                author: modalForm.author.value,
                description: modalForm.description.value,
                genre: modalForm.genre.value,
                image: modalForm.image.value,
                availability: modalForm.availability.checked
            };
    
            const method = isEdit ? 'PUT' : 'POST';
            const url = isEdit ? `${urls.edit_book}${bookId}/` : urls.add_book;
    
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(bookData)
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(text => { throw new Error(JSON.stringify(text)) });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        addEditBookModal.style.display = 'none';
                        fetchAvailableBooks(filterSelect.value);
                    } else {
                        console.error('Error saving book:', data.error);
                    }
                })
                .catch(error => {
                    console.error('Error saving book:', error);
                    alert('Error saving book: ' + error.message);
                });
        };
    };
    
        

    const showDeleteConfirmModal = (bookId) => {
        const deleteButton = document.getElementById('confirmDeleteButton');
        deleteConfirmModal.style.display = 'block';

        deleteButton.onclick = () => {
            fetch(`${urls.delete_book}${bookId}/`, {
                method: 'DELETE',
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        deleteConfirmModal.style.display = 'none';
                        fetchAvailableBooks(filterSelect.value);
                    } else {
                        console.error('Error deleting book:', data.error);
                    }
                })
                .catch(error => console.error('Error deleting book:', error));
        };
    };

    filterSelect.addEventListener("change", () => {
        fetchAvailableBooks(filterSelect.value);
    });

    fetchAvailableBooks(filterSelect.value);

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
});