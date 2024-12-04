from .views import (UserListView, UserView, MyTokenObtainPairView, 
                    CreateAdminView, PasswordResetView)
from django.urls import path


urlpatterns = [
    path('all/', UserListView.as_view(), name='users'),
    path('view/', UserView.as_view(), name='user'),
    path('add-admin/', CreateAdminView.as_view(), name='admin'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('reset-password/request/', PasswordResetView.as_view(), name='reset_password-request'),
    path('reset-password/change/', PasswordResetView.as_view(), name='reset_password'),

]