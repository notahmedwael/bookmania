import { updateUI } from './ui_utils.js'; // Import the updateUI function

document.addEventListener("DOMContentLoaded", () => {
    fetch(urls.user_info)
        .then(response => response.json())
        .then(data => {
            // Call updateUI with currentUser object received from backend
            updateUI(data.currentUser);
        })
        .catch(error => console.error('Error fetching user info:', error));
    

    const bookSearch = document.querySelector("#bookSearch");
    const viewAvailableBooks = document.querySelector("#viewAvailableBooks");
    const viewBorrowedBooks = document.querySelector("#viewBorrowedBooks");

    bookSearch.addEventListener("click", ()=>{
        window.location.href = urls.book_search;
    });

    viewAvailableBooks.addEventListener("click", ()=>{
        window.location.href = urls.user_available_books;
    });

    viewBorrowedBooks.addEventListener("click", ()=>{
        window.location.href = urls.borrowed_books;
    });
});