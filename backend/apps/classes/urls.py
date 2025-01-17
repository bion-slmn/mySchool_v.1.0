from django.urls import path
from .views import GradeVIew, TotalNumberofGrades

urlpatterns = [
    path('view/', GradeVIew.as_view(), name='view-grades'),
    path('create/', GradeVIew.as_view(), name='create-grade'),
    path('update/<str:grade_id>/', GradeVIew.as_view(), name='update-grade'),
    path('delete/<str:grade_id>/', GradeVIew.as_view(), name='delete-grade'),
    path('total/', TotalNumberofGrades.as_view(), name='total-grades'),
]   