# services.py
from .models import Expense
from .serializer import ExpenseSerializer
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError


class ExpenseService:
    def get_expenses_in_term(self, term_id: str) -> list:
        '''
        get expenses in a term, return id, name, amount
        '''
        term_expenses = Expense.objects.filter(term=term_id)
        if term_expenses:  
            return list(term_expenses.values("id", "name", "amount"))
        return []

    def get_expense_object(self, expense_id) -> dict:
        '''
        get and objec from id
        '''
        return get_object_or_404(Expense, id=expense_id)

    def get_detail_of_expense(self, expense_id: str):
        '''
        get details of an expense object
        '''
        expense = self.get_expense_object(expense_id)
        return ExpenseSerializer(expense).data

    def get_query_param(self, param, request) -> str:
        '''
        get the param passed from the request
        '''
        value = request.query_params.get(param)  
        if not value:
            raise ValidationError(f"{param } is required")

        return value

    def create_expense(self, expense_data: dict) -> dict:
        """
        Create a new expense.
        
        :param expense_data: A dictionary containing the expense details.
        :return: Serialized data of the created expense.
        """
        serializer = ExpenseSerializer(data=expense_data)
        return self._validate_and_save(serializer)

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
        serializer = ExpenseSerializer(expense, data=update_data, partial=True) 
        return self._validate_and_save(serializer)

    def _validate_and_save(self, serializer):
        '''
        validate serializer and save the data
        '''
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer.data






    


