from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_protect
from .forms import UserRegistrationForm
from django.contrib.auth.models import User
from django.http import JsonResponse

def sign_up(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_admin = form.cleaned_data.get('is_admin')
            user.set_password(form.cleaned_data.get('password'))  # Hash the password
            user.save()
            return redirect('login')  # Redirect to login page after successful sign-up
    else:
        form = UserRegistrationForm()
    return render(request, 'users/sign_up.html', {'form': form})

@csrf_protect
def handle_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            auth_login(request, user)
            return JsonResponse({'success': True, 'is_admin': user.is_admin, 'redirect_url': '/users/admin_panel/' if user.is_admin else '/users/user_panel/'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid email or password'})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'})


def render_login_page(request):
    return render(request, 'users/login.html')

def logout_user(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)


def user_panel(request):
    return render(request, 'users/user_panel.html')

def admin_panel(request):
    return render(request, 'users/admin_panel.html')

def get_current_user_info(request):
    if request.user.is_authenticated:
        current_user = {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'is_admin': request.user.is_admin,
        }
        return JsonResponse({'currentUser': current_user})
    else:
        return JsonResponse({'currentUser': None})
