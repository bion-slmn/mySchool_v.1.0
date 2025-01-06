from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpRequest
from .services import ExpenseService


class ViewExpenseInTerm(APIView):
    def __init__(self, expense_service: ExpenseService = None):
        self.expense_service = expense_service or ExpenseService()

    def get(self, request: HttpRequest) -> Response:
        '''
        get all expenses of a term
        '''
        term_id = self.expense_service.get_query_param(term_id, request)     
        term_expenses = self.expense_service.get_expenses_in_term(term_id)

        return Response(term_expenses, status=status.HTTP_200_OK)


class ExpenseView(APIView):
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
        return Response("Expense deleted successfully", status=status.HTTP_204_NO_CONTENT)

    def put(self, request: HttpRequest) -> Response:
        """
        Update an existing expense.
        """
        expense_id = self.expense_service.get_query_param("expense_id", request)
        update_data = request.data
        updated_expense = self.expense_service.update_expense(expense_id, update_data)
        return Response(updated_expense, status=status.HTTP_200_OK)