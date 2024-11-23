from django.urls import path
from .views import UserView, CreateAdminView, MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('register-teacher/', UserView.as_view(), name='register-user'),
    path('register-admin/', CreateAdminView.as_view()),
    path('update/<str:user_id>/', UserView.as_view(), name='update-user'),
    path('view-user/<str:user_id>/', UserView.as_view(), name='view-user'),
    path('get-user-info/', CreateAdminView.as_view()),

    #obtain token
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]