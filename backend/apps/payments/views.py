from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpRequest
from .models import Payment
from .utils import PaymentService
from apps.fees.util import FeeService
from apps.classes.utils import GradeService




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
        self.payment_service.delete_payment(payment_id)
        return Response('Deleted ....', status=status.HTTP_200_OK)
    

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

class PaymentsinGradeView(APIView):

    def __init__(self, grade_service: GradeService = None,fess_service: FeeService = None):
        self.grade_service = grade_service or GradeService()
        self.fess_service = fess_service or FeeService()

    def get(self, request: HttpRequest, grade_id: int):
        '''
        Return a list fees for each fee total amount, total paid and total number of students ina grade.
        '''
        fees_in_grade = self.fess_service.get_fees_by_grade(grade_id)
        serialised_fees = self.fess_service.serialize_fees(fees_in_grade)
        num_students = self.grade_service.get_total_number_of_students(grade_id)
        payments = {'students': num_students, 'fees': serialised_fees}
        return Response(payments, status=status.HTTP_200_OK)
    

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


class TotalPayment(APIView):
    '''
    Get total payment within a certain period default is 30 days
    '''

    def __init__(self, payment_service: PaymentService = None):
        self.payment_service = payment_service or PaymentService()

    def get(self, request: HttpRequest):
        '''
        Return the total amount paid by each student for a specific fee.
        '''
        days = request.query_params.get('days')
        total_payment = self.payment_service.get_total_payments(days)
        return Response(total_payment, status=status.HTTP_200_OK)

class PeriodPaymentView(APIView):
    
    def __init__(self, payment_service: PaymentService = None):
        self.payment_service = payment_service or PaymentService()

    def get(self, request: HttpRequest):
        '''
        get payment of a specifce fee type and period
        '''
        fee_type, start_date, end_date = self.payment_service.get_query_params(request, "fee_type", "start_date", "end_date")
        payments = self.payment_service.get_period_payments(fee_type, start_date, end_date)
        return Response(payments, status=status.HTTP_200_OK)



    