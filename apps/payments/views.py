from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpRequest
from .models import Payment
from .utils import PaymentService



# create a class to view paymentes of a fee
class PaymentonFeeView(APIView):

    def __init__(self, payment_service: PaymentService = None):
        self.payment_service = payment_service or PaymentService()

    def get(self, request: HttpRequest, fee_id: int):
        '''
        Return the total amount paid by each student for a specific fee.
        '''
        payments = self.payment_service.get_student_with_total_payments(fee_id)
        return Response(payments, status=status.HTTP_200_OK)
    

    def post(self, request: HttpRequest):
        '''
        Create a new payment for a specific fee.
        '''
        data = request.data
        payment_created = self.payment_service.create_payment(data)
        return Response(payment_created, status=status.HTTP_201_CREATED)
    

    def put(self, request: HttpRequest, payment_id: int):
        '''
        Update an existing payment.
        '''
        data = request.data
        payment_updated = self.payment_service.update_payment(payment_id, data)
        return Response(payment_updated, status=status.HTTP_200_OK)
    

    def delete(self, request: HttpRequest, payment_id: int):
        '''
        Delete an existing payment.
        '''
        payment_deleted = self.payment_service.delete_payment(payment_id)
        return Response(payment_deleted, status=status.HTTP_200_OK)
    

# get the payment of a fee for a specific student

class PaymentonFeeStudentView(APIView):

    def __init__(self, payment_service: PaymentService = None):
        self.payment_service = payment_service or PaymentService()

    def get(self, request: HttpRequest):
        '''
        Return all payments made by a student for a specific fee.
        '''

        student_id = request.query_params.get('student_id')
        fee_id = request.query_params.get('fee_id')
        payment = self.payment_service.get_student_payment_on_fee(student_id, fee_id)
        return Response(payment, status=status.HTTP_200_OK)
    

class CreateDailyPaymentView(APIView):

    def __init__(self, payment_service: PaymentService = None):
        self.payment_service = payment_service or PaymentService()

    def post(self, request: HttpRequest):
        '''
        Create a new payment for a specific fee.
        '''
        data = request.data.get('payments')
        payment_created = self.payment_service.bulk_create_payments(data)
        return Response(payment_created, status=status.HTTP_201_CREATED)