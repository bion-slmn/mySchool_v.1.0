# services.py
from .models import Expense
from .serializers import ExpenseSerializer
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError


class ExpenseService:
    def get_expenses_in_term(self, term_id: str) -> list:
        '''
        get expenses in a term, return id, name, amount
        '''
        term_expenses = Expense.objects.filter(term=term_id)
        if term_expenses.exists():  
            return list(term_expenses.values("id", "name", "amount"))
        return []

    def get_expense_object(self, expense_id) -> dict:
        '''
        get and objec from id
        '''
        return get_object_or_404(Expense, id=expense_id)

    def get_detail_of_expense(self, expense_id: str);
        '''
        get details of an expense object
        '''
        expense = self.get_expense_object(expense_id)
        return ExpenseSerializer(expense).default_auto_field

    def get_query_param(self, param, request) -> str:
        '''
        get the param passed from the request
        '''
        param = request.query_params.get("param")  
        if not param:
            raise ValidationError(f"{param }is required")

        return param

    def create_expense(self, expense_data: dict) -> dict:
        """
        Create a new expense.
        
        :param expense_data: A dictionary containing the expense details.
        :return: Serialized data of the created expense.
        """
        serializer = ExpenseSerializer(data=expense_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()  # Save the instance after validation
        return serializer.data

    def delete_expense(self, expense_id: str) -> None:
        """
        Delete an existing expense.
        
        :param expense_id: The ID of the expense to delete.
        :return: None
        """
        expense = self.get_expense_object(expense_id)
        expense.delete()

    def update_expense(self, expense_id: str, update_data: dict) -> dict:
        """
        Update an existing expense.
        
        :param expense_id: The ID of the expense to update.
        :param update_data: A dictionary containing the updated expense details.
        :return: Serialized data of the updated expense.
        """
        expense = self.get_expense_object(expense_id)
        serializer = ExpenseSerializer(expense, data=update_data) 
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer.data






    


