from django.urls import path
from .views import ViewExpenseInTerm, ExpenseView

urlpatterns = [
    path('expenses/term/', ViewExpenseInTerm.as_view(), name='view_expenses_in_term'),

    path('expenses/', ExpenseView.as_view(), name='expense_view'),
]
