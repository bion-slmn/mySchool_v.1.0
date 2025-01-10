from django.urls import path
from .views import FeeView, TermFee, GradeFee, FeeTypeView


urlpatterns = [
    path('create/', FeeView.as_view(), name='create a fee'),
    path('view/<str:fee_id>/', FeeView.as_view(), name='view-fee'),
    path('update/<str:fee_id>/', FeeView.as_view(), name='update a fee'),
    path('delete/<str:fee_id>/', FeeView.as_view(), name='delete a fee'),

    path('term/<str:term_id>/', TermFee.as_view(), name='view-term-fees'),
    path('grade/<str:grade_id>/', GradeFee.as_view(), name='view-grade-fees'),
    path('type/', FeeTypeView.as_view(), name='view-fee-types')
]