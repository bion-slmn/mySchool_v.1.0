from .views.password_update import PasswordResetView
from .views.registration import (UserListView, UserView, CreateAdminView, TestApi,
                                CreateParentView, CreateTeacherView)
from .views.loginLogout import  AdminLogin, ParentLogin, TeacherLogin
from rest_framework_simplejwt.views import TokenRefreshView 
from django.urls import path


urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('all/', UserListView.as_view(), name='list-users'),
    path('view/', UserView.as_view(), name='view-user'),
    
    path('add/admin/', CreateAdminView.as_view(), name='add-admin'),
    path('add/teacher/', CreateTeacherView.as_view(), name='add-teacher'),
    path('add/parent/', CreateParentView.as_view(), name='add-parent'),


    path('login/admin/', AdminLogin.as_view(), name='login-admin'),
    path('login/teacher/', TeacherLogin.as_view(), name='login-teacher'),
    path('login/parent/', ParentLogin.as_view(), name='login-parent'),

    path('reset-password/request/', PasswordResetView.as_view(), name='reset_password-request'),
    path('reset-password/confirm-token/', PasswordResetView.as_view(), name='reset_password-confirm-token'),
    path('reset-password/change/', PasswordResetView.as_view(), name='reset_password-change'),
    path('test/', TestApi.as_view())
]