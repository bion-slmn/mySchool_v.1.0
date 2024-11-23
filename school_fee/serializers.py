from .models.school_model import School
from .models.grade_model import Grade
from .models.student_model import Student
from .models.fee_model import Fee
from .models.payment_model import Payment
from .models.term_model import Term
from rest_framework import serializers
from django.db import transaction
from django.db.models import F


class BaseSerializer(serializers.ModelSerializer):
    """
    BaseSerializer is a base class for serializers that provides common fields for model serialization.

    Attributes:
        id (CharField): A read-only field representing identifier of the model.
        created_at (DateTimeField): A read-only field representing the creation

    """
    id = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)


class SchoolSerializer(BaseSerializer):
    '''
    SchoolSerializer is a class that serializes the School model.
    '''
    class Meta:
        model = School
        fields = '__all__'

class GradeSerializer(BaseSerializer):
    '''
    GradeSerializer is a class that serial
    '''
    class Meta:
        model = Grade
        fields = '__all__'

class StudentSerializer(BaseSerializer):
    '''
    StudentSerializer is a class that serializes the Student model.
    '''
    updated_at = None 
    gender = serializers.CharField()
    grade_name = serializers.CharField(source='grade.name', read_only=True)  # Fetch the grade's name directly

    class Meta:
        model = Student
        exclude = ['school']
        extra_fields = ['grade_name']


    def validate_gender(self, value):
        if value in dict(Student.Gender.choices):
            return value
        raise serializers.ValidationError()
    
class FeeSerializer(BaseSerializer):
    ''' 
    FeeSerializer is a class that serial fee model
    '''
    class Meta:
        model = Fee
        fields = '__all__'

class TermSerializer(BaseSerializer):
    '''
    TermSerializer is a class that serial term model
    '''
    class Meta:
        model = Term
        exclude = ['school']

    def validate(self, data):
        """
        Ensure that 'to_date' is after 'from_date'.
        """
        if data['end_date'] < data['start_date']:
            raise serializers.ValidationError("End date must be after start date.")
        return data
    


class PaymentSerializer(BaseSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    date_paid = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'student', 'student_name', 'fee', 'amount', 'date_paid', 'payment_method', 'reference_number']

class BulkCreateListSerializer(serializers.ListSerializer):
    """Custom ListSerializer for bulk creation."""
    
    def create(self, validated_data):
        payments = [Payment(**item) for item in validated_data]
        with transaction.atomic():
            created_payments = Payment.objects.bulk_create(payments)
            for payment in created_payments:
                self.update_fee_total(payment)

        return created_payments

    def update_fee_total(self, payment):
        """Update the total paid for the associated fee."""
        Fee.objects.filter(id=payment.fee.id).update(
            total_paid=F('total_paid') + payment.amount
        )

class PaymentBulkSerializer(serializers.ModelSerializer):
    date_paid = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    class Meta:
        model = Payment
        fields = ['student', 'amount', 'date_paid', 'payment_method', 'fee']
        list_serializer_class = BulkCreateListSerializer

