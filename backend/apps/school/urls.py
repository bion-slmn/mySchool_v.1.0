from django.urls import path
from .views.school import SchoolView, TotalNumberofStudents
from .views.term import TermView


urlpatterns = [
    path('create/', SchoolView.as_view(), name='create-school'),
    path('view/', SchoolView.as_view(), name='view-school'),
    path('update/', SchoolView.as_view(), name='update-school'),
    path('total_students/', TotalNumberofStudents.as_view(), name='total-students'),

    path('term/create/', TermView.as_view(), name='create-term'),
    path('term/view/', TermView.as_view(), name='view-term'),
    path('term/update/<str:term_id>', TermView.as_view(), name='update-term'),
    path('term/delete/<str:term_id>', TermView.as_view(), name='delete-term')
]