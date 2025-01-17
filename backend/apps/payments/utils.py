from .models import Payment
from django.db.models import Sum
from .serializer import PaymentSerializer
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta



class PaymentService:
    def get_student_with_total_payments(self, fee_id):
        '''
       Return the total amount paid by each student for a specific fee.
       '''
        return (
            Payment.objects.filter(fee_id=fee_id)
            .values('student_id', 'student__name')
            .annotate(total_payments=Sum('amount'))
        )
    
    def create_payment(self, data):
        '''
        Create a new payment for a specific fee.
        '''
        if not data:
            raise ValidationError('Payment Data is required to create a payment')
        serializer = PaymentSerializer(data=data)
        return self._validate_and_save(serializer)
    
    def get_payment_object(self, payment_id):
        '''
        Return a payment object by its ID.
        '''
        return get_object_or_404(Payment, id=payment_id)
    
    def update_payment(self, payment_id, data):
        '''
        Update an existing payment.
        '''
        if not data:
            raise ValidationError('Payment Data is required to update a payment')

        payment = self.get_payment_object(payment_id)
        serializer = PaymentSerializer(payment, data=data, partial=True)
        return self._validate_and_save(serializer)

    # TODO Rename this here and in `create_payment` and `update_payment`
    def _validate_and_save(self, serializer):
        '''
        Validate and save a serializer.
        '''
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer.data
    
    def delete_payment(self, payment_id):
        '''
        Delete an existing payment.
        '''
        payment = self.get_payment_object(payment_id)
        payment.delete()
        return None
    
    def get_student_payment_on_fee(self, student_id, fee_id):
        '''
        Return the total amount paid by a specific student for a specific fee.
        '''
        if not student_id or not fee_id:
            raise ValidationError('Student ID and Fee ID are required to get student payment on fee')
        
        payments = Payment.objects.filter(student_id=student_id, fee_id=fee_id)
        serializer = PaymentSerializer(payments, many=True)
        return serializer.data
    
    def bulk_create_payments(self, data) -> dict:
        '''
        create multiple payments recording both sucess and failure.
        '''
        success_payments = []
        failure_payments = []
        for payment_data in data:
            try:
                payment = self.create_payment(payment_data)
                success_payments.append(payment)
            except ValidationError as e:
                payment_data['error'] = str(e)
                failure_payments.append(payment_data)
        return {'success_payments': success_payments, 'failure_payments': failure_payments}

    def _validate_day(self, days):
        '''
        Validate the number of days to get the total payments.
        '''
        if not days:
            raise ValidationError('Days is required to get the total payments')
        return int(days)


    def get_total_payments(self, days):
        '''
        Return the total amount paid within a speciic period.
        '''
        days = self._validate_day(days)
        start_date = timezone.now() - timedelta(days=days)
        total = Payment.objects.filter(created__gte=start_date).aggregate(total=Sum('amount'))
        return total['total'] or 0
    

    
                