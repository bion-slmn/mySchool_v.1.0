from django.urls import path
from .views.school_view import SchoolView, CreateSchool
from .views.grade_view import GradeView, StudentInGradeView
from .views.fee_view import (FeeView, FeePercentageCollected, 
                             GradeFeeView, FeePerTerm, DailyFeeView)
from .views.student_view import StudentView, CreateStudent, PromoteStudent
from .views.payment_views import (PaymentonFee, CreatePaymentView,
                                   PaymentPerStudent, DailyPaymentView)
from .views.term_view import TermView
from .views.search_view import GetDetailView, SearchView

urlpatterns = [
    # routes for school
    path('view-school/<str:school_id>/', SchoolView.as_view()),
    path('create-school/', CreateSchool.as_view()),

    # create terms
    path('view-terms/', TermView.as_view(), name='view-terms'),
    path('create-term/', TermView.as_view(), name='create-term'),

    # Route for Grades
    path('create-grade/', GradeView.as_view()),
    path('view-all-grades/', GradeView.as_view()),

    # Route For student
    path('register-student/', CreateStudent.as_view()),
    path('view-student/<str:student_id>/', StudentView.as_view()),
    path('students-in-grade/<str:grade_id>/', StudentInGradeView.as_view(), name="list 0f students in grade"),
    path('promote-student/<str:next_grade_id>/', PromoteStudent.as_view()),
    

    # Routes for fee
    path('create-fee/', FeeView.as_view()),
    path('percentage-fee-per-grade/', FeePercentageCollected.as_view()),
    path('fees-in-grade/<str:grade_id>/', GradeFeeView.as_view()),
    path('daily-fee/<str:grade_id>/', DailyFeeView.as_view()),

    # route for payments
    path('payment-on-fee/<str:fee_id>/', PaymentonFee.as_view()),
    path('create-payment/', CreatePaymentView.as_view(), name='create-payment'),
    path('payments-per-student/<str:fee_id>/', PaymentPerStudent.as_view()),
    path('fee-per-term/<str:term_id>/', FeePerTerm.as_view()),
    path('create-daily-payment/', DailyPaymentView.as_view()),

    # search routes
    path('search/', SearchView.as_view()),
    path('get-student-detail/', GetDetailView.as_view()),
]