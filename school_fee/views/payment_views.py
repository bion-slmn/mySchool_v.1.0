from django.shortcuts import get_object_or_404
from ..models.fee_model import Fee
from ..models.student_model import Student
from ..models.payment_model import Payment
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import PaymentSerializer, PaymentBulkSerializer
from ..decorator import handle_exceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from .fee_view import group_by_key
from typing import List, Dict, Any
from django.db import transaction


class PaymentonFee(APIView):
    permission_classes = [AllowAny]

    def get(self, request: HttpRequest, fee_id: str) -> Response:
        """
        Handles GET requests to retrieve payment information for a specific fee.
        This method fetches the fee object, retrieves associated payments,
        and groups them by student name before returning the results.

        Args:
            self:
            request (HttpRequest): The HTTP request object containing metadata about the request.
            fee_id: The identifier of the fee for which payments are being retrieved.

        Returns:
            Response: A response object containing the grouped payment data organized by student name.
        """
        
        all_payment = self.get_payment_per_student(fee_id)
        return Response(all_payment, 200)
    
    def get_payment_per_student(self, fee_id):
    # Fetch the fee and related students and their payments in a single optimized query
        fee = get_object_or_404(Fee.objects.prefetch_related("students__payments"), id=fee_id)
        if fee.fee_type == "ADMISSION":
            return self.get_admission_payment(fee)
        
        results = {}
        for student in fee.students.all():
            student_payments = student.payments.all()
            print(student_payments, 222222)
            
            if len(student_payments) == 0:
                results[student.name] = {'student_id': student.id, 'amount': 0}
            else:
                total_payment = self.get_total_payments(student_payments)
                results[student.name] = {'student_id': student.id, 'amount': total_payment}
        
        return results

    def get_total_payments(self, student_payments):
        return sum(payment.amount for payment in student_payments)

    
    def get_admission_payment(self, fee):
        payments = fee.payments.prefetch_related("student")
        results = {}
        for payment in payments.all():
            if payment.student.name not in results:
                results[payment.student.name] = {
                    'student_id': payment.student.id, 'amount': payment.amount}
            else:
                results[payment.student.name]['amount'] += payment.amount
        return results
    
    def get_total_paid_per_student(self, source: List[Dict[str, Any]]) -> List[Dict[str, int]]:
        """
        Calculate the total amount paid by each student based on a list of payment records.

        Args:
            source (List[Dict[str, Any]]): A list of dictionaries where each
              dictionary contains 
            payment details, including 'student_name', 'id', and 'amount'.

        Returns:
            List[Dict[str, int]]: A list of dictionaries, each containing 
            'id' and 'amount' for each student, representing the total amount paid.
        """

        if not source:
            return []
        
        results = {}
        for item in source:
            key = item.get('student_name')
            if key not in results:
                results[key] = {'student_id': item.get('student'), 'amount': float(item.get('amount', 0))}
            else:
                results[key]['amount'] += float(item.get('amount'))

        return results





class CreatePaymentView(APIView):
    permission_classes = [AllowAny]

    @handle_exceptions
    def post(self, request: HttpRequest) -> Response:
        """
        Create a new payment record for a student.
        """
        serializer = PaymentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentPerStudent(APIView):
    permission_classes = [AllowAny]
    @handle_exceptions
    def get(self, request: HttpRequest, fee_id: str) -> Response:
        """
        Retrieve payment records for a specific student based on the provided fee ID. 
        This method checks for the student ID in the request parameters and returns the
          associated payment records in a structured format.

        Args:
            request (HttpRequest): The HTTP request object containing query parameters.
            fee_id (str): The ID of the fee for which payments are being retrieved.

        Returns:
            Response: A response object containing the payment records in JSON format
            or an error message if the student ID is missing.

        Raises:
            ValueError: If the student ID is not provided in the request parameters.
        """

        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response('Student id must be passed', 400)
        payments = Payment.objects.filter(fee=fee_id, student=student_id)
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, 200)
    

class DailyPaymentView(APIView):
    permission_classes = [AllowAny]
   

    @handle_exceptions
    @transaction.atomic  # Ensures all or nothing behavior
    def post(self, request):
        """
        Create multiple payment records for students in one database operation.
        """
        payment_data = request.data.copy()
        payment_dict = payment_data.pop('payments', None)

        if not payment_dict:
            return Response(
                {"detail": "Payment details must be a non-empty dict."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        student_ids = payment_dict.keys()
        existing_students = Student.objects.filter(id__in=student_ids)

        # Ensure all provided student IDs exist
        if len(existing_students) != len(student_ids):
            missing_ids = set(student_ids) - set(existing_students.values_list('id', flat=True))
            return Response(
                {"detail": f"Some student IDs don't exist: {missing_ids}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


        # Prepare payment instances
        payment_instances = [
            {
                'student': student_id,
                'amount': amount,
                **payment_data,
            }
            for student_id, amount in payment_dict.items()
        ]
        print(payment_instances, 2323)
        # Use the bulk serializer to create payments
        serializer = PaymentBulkSerializer(data=payment_instances, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)