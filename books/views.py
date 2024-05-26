from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Book
from .forms import BookForm

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

def borrowed_books(request):
    user = request.user
    if is_ajax(request):
        books = Book.objects.filter(borrowed_by=user)
        books_data = list(books.values('id', 'image', 'title', 'author', 'description', 'availability', 'genre'))
        return JsonResponse({'books': books_data})
    return render(request, 'books/borrowed_books.html')

def render_user_available_books(request):
    return render(request, 'books/user_available_books.html')

def get_available_books(request):
    if is_ajax(request):
        filter_option = request.GET.get('filter', 'all')

        if filter_option == 'available':
            books = Book.objects.filter(availability=True)
        elif filter_option == 'borrowed':
            books = Book.objects.filter(availability=False)
        else:
            books = Book.objects.all()

        books_data = list(books.values('id', 'image', 'title', 'author', 'description', 'availability', 'genre'))
        return JsonResponse({'books': books_data})
    
    return JsonResponse({'error': 'Invalid request'})

def render_book_search(request):
    return render(request, 'books/book_search.html')

def search_books(request):
    if is_ajax(request):
        query = request.GET.get('query', '').strip()
        category = request.GET.get('category', 'title')

        if not query:
            return JsonResponse({'error': 'Query parameter is missing or empty'}, status=400)

        books = []
        if category == 'title':
            books = Book.objects.filter(title__icontains=query)
        elif category == 'author':
            books = Book.objects.filter(author__icontains=query)
        elif category == 'genre':
            books = Book.objects.filter(genre__icontains=query)
        else:
            return JsonResponse({'error': 'Invalid category'}, status=400)

        books_data = list(books.values('id', 'image', 'title', 'author', 'description', 'availability', 'genre'))
        return JsonResponse({'books': books_data})
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

from django.http import JsonResponse

def get_book_details(request):
    if is_ajax(request):
        book_id = request.GET.get('book_id')
        if not book_id:
            return JsonResponse({'error': 'Book ID is missing'}, status=400)

        try:
            book = get_object_or_404(Book, id=book_id)
            book_data = {
                'title': book.title,
                'image': book.image,
                'author': book.author,
                'description': book.description,
                'genre': book.genre,
                'availability': book.availability
            }
            return JsonResponse({'book': book_data})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)


def borrow_book(request, book_id):
    if request.method == 'POST':
        book = get_object_or_404(Book, id=book_id)
        if book.availability:
            book.availability = False
            book.borrowed_by = request.user
            book.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'message': 'Book is not available'})
    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)



@csrf_exempt
@require_http_methods(["POST", "PUT"])
def add_edit_book(request, book_id=None):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    if request.method == 'POST':
        form = BookForm(data)
    elif request.method == 'PUT':
        book = get_object_or_404(Book, id=book_id)
        form = BookForm(data, instance=book)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    if form.is_valid():
        book = form.save(commit=False)
        if not book_id:  # If adding a new book
            book.borrowed_by = None  # Ensure the new book is not borrowed
        book.save()
        return JsonResponse({'success': True, 'book_id': book.id}, status=201)
    else:
        return JsonResponse({'error': form.errors}, status=400)



@csrf_exempt
@require_http_methods(["DELETE"])
def delete_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    book.delete()
    return JsonResponse({'success': True})