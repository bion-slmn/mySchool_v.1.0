from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpRequest
from .utils import ExpenseService
from config.permissions import AdminOnly


class ViewExpenseInTerm(APIView):
    permission_classes = [AdminOnly]

    def __init__(self, expense_service: ExpenseService = None):
        self.expense_service = expense_service or ExpenseService()

    def get(self, request: HttpRequest) -> Response:
        '''
        get all expenses of a term
        '''
        term_id = self.expense_service.get_query_param("term_id", request)     
        term_expenses = self.expense_service.get_expenses_in_term(term_id)

        return Response(term_expenses, status=status.HTTP_200_OK)


class ExpenseView(APIView):
    permission_classes = [AdminOnly]
    
    def __init__(self, expense_service: ExpenseService = None):
        self.expense_service = expense_service or ExpenseService()

    def get(self, request: HttpRequest) -> Response:
        """
        Get details of an expense.
        """
        expense_id = self.expense_service.get_query_param("expense_id", request)
        expense_details = self.expense_service.get_detail_of_expense(expense_id)
        return Response(expense_details, status=status.HTTP_200_OK)

    def post(self, request: HttpRequest) -> Response:
        """
        Create a new expense.
        """
        expense_data = request.data
        created_expense = self.expense_service.create_expense(expense_data)
        return Response(created_expense, status=status.HTTP_201_CREATED)

    def delete(self, request: HttpRequest) -> Response:
        """
        Delete an expense.
        """
        expense_id = self.expense_service.get_query_param("expense_id", request)
        self.expense_service.delete_expense(expense_id)
        return Response("Expense deleted successfully", status=status.HTTP_200_OK)

    def put(self, request: HttpRequest) -> Response:
        """
        Update an existing expense.
        """
        expense_id = self.expense_service.get_query_param("expense_id", request)        
        updated_expense = self.expense_service.update_expense(expense_id, request.data)
        
        return Response(updated_expense, status=status.HTTP_200_OK)


class TotalExpense(APIView):
    permission_classes = [AdminOnly]

    def __init__(self, expense_service: ExpenseService = None):
        self.expense_service = expense_service or ExpenseService()

    def get(self, request: HttpRequest) -> Response:
        """
        Get the total expenses of a specific period., can be a number of days, or from a specific date to another.
        """
        days = request.query_params.get("days")
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        
        total_expense = self.expense_service.get_total_expense(days, start_date, end_date)
        return Response(total_expense, status=status.HTTP_200_OK)

            
        