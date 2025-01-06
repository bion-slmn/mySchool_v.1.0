from django.urls import path
from .views import ViewExpenseInTerm, ExpenseView

urlpatterns = [
    path('term/', ViewExpenseInTerm.as_view(), name='view_expenses_in_term'),

    path('create/', ExpenseView.as_view(), name='expense_create'),
    path('view/', ExpenseView.as_view(), name='expense_view'),
    path('update/', ExpenseView.as_view(), name='expense_update'),
    path('delete/', ExpenseView.as_view(), name='expense_view'),
]
