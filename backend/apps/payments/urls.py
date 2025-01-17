from django.urls import path
from .views import (PaymentonFeeView, PaymentonFeeStudentView,
                     CreateDailyPaymentView, PaymentsinGradeView,
                    TotalPayment)

urlpatterns = [
    path('view/<str:fee_id>/', PaymentonFeeView.as_view(), name='view_payments'),
    path('create/', PaymentonFeeView.as_view(), name='create_payments'),
    path('update/<str:payment_id>/', PaymentonFeeView.as_view(), name='update_payments'),
    path('delete/<str:payment_id>/', PaymentonFeeView.as_view(), name='delete_payments'),
    path('total/', TotalPayment.as_view(), name='total_payments'),

    path('student/', PaymentonFeeStudentView.as_view(), name='view_student_payments'),
    path('create/daily/', CreateDailyPaymentView.as_view(), name='create_daily_payment'),
    path('grade/<str:grade_id>/', PaymentsinGradeView.as_view(), name='view_grade_payments'),
]