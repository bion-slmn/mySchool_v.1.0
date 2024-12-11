from django.urls import path
from .views.school import SchoolView
from .views.term import TermView


urlpatterns = [
    path('create/', SchoolView.as_view(), name='create-school'),
    path('view/', SchoolView.as_view(), name='view-school'),
    path('update/', SchoolView.as_view(), name='update-school'),

    path('term/create/', TermView.as_view(), name='create-term'),
    path('term/view/', TermView.as_view(), name='view-term'),
    path('term/update/<str:term_id>', TermView.as_view(), name='update-term'),
]