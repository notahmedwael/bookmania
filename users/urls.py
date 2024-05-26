from django.urls import path
from . import views

urlpatterns = [
    path('sign_up/', views.sign_up, name='sign_up'),
    path('login/', views.render_login_page, name='login'),
    path('login-handler/', views.handle_login, name='login_handler'),
    path('api/logout/', views.logout_user, name='logout_user'),
    path('user_panel/', views.user_panel, name='user_panel'),
    path('admin_panel/', views.admin_panel, name='admin_panel'),
    path('api/user_info/', views.get_current_user_info, name='user_info'),
]