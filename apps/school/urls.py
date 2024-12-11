from django.urls import path
from .views import SchoolView


urlpatterns = [
    path('create/', SchoolView.as_view(), name='create-school'),
    path('view/', SchoolView.as_view(), name='view-school'),
    path('update/', SchoolView.as_view(), name='update-school'),
]