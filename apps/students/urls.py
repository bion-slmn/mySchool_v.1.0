from django.urls import path
from .views import StudentView, AllStudentView


urlpatterns = [
    path('create/', StudentView.as_view(), name='create a student'),
    path('view/<str:student_id>/', StudentView.as_view(), name='view-student'),
    path('update/<str:student_id>/', StudentView.as_view(), name='update a student'),
    path('delete/<str:student_id>/', StudentView.as_view(), name='delete a student'),

    path('view-all/', AllStudentView.as_view(), name='view all student'),
]