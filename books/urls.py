from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

urlpatterns = [
    path('user_available_books/', views.render_user_available_books, name='user_available_books'),  # Render the user available books page
    path('get_available_books/', views.get_available_books, name='get_available_books'),  # Retrieve available books
    path('borrowed_books/', views.borrowed_books, name='borrowed_books'), # Retrieve the user's borrowed books
    path('book_search/', views.render_book_search, name='book_search'),  # Render the book search page
    path('search_books/', views.search_books, name='search_books'),  # Search for books
    path('get_book_details/', views.get_book_details, name='get_book_details'), # Show details for a definite book
    path('borrow/<int:book_id>/', views.borrow_book, name='borrow_book'), # Borrow a book
    path('add_edit_book/<int:book_id>/', views.add_edit_book, name='edit_book'),
    path('add_edit_book/', views.add_edit_book, name='add_book'),
    path('delete_book/<int:book_id>/', views.delete_book, name='delete_book'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)