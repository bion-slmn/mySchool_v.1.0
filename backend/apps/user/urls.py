from .views.password_update import PasswordResetView
from .views.registration import UserListView, UserView, CreateAdminView, TestApi
from .views.loginLogout import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView 
from django.urls import path


urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('all/', UserListView.as_view(), name='users'),
    path('view/', UserView.as_view(), name='user'),
    path('add-admin/', CreateAdminView.as_view(), name='admin'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('reset-password/request/', PasswordResetView.as_view(), name='reset_password-request'),
    path('reset-password/confirm-token/', PasswordResetView.as_view(), name='reset_password-request'),
    path('reset-password/change/', PasswordResetView.as_view(), name='reset_password'),
    path('test/', TestApi.as_view())
]