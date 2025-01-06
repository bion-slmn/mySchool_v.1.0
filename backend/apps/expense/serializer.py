# serializers.py
from config.base_serializer import BaseSerializer
from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(BaseSerializer):
    term_name = serializers.CharField(source='term.name', read_only=True) 

    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['term_name']

        