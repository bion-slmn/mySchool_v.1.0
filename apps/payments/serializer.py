from rest_framework import serializers
from .models import Payment
from config.base_serializer import BaseSerializer

class PaymentSerializer(BaseSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    date_paid = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'student', 'student_name', 'fee', 'amount', 'date_paid', 'payment_method']



