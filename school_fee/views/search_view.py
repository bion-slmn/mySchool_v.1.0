from ..models.student_model import Student
from rest_framework.views import APIView
from django.http import HttpRequest, Http404
from rest_framework.response import Response
from ..decorator import handle_exceptions
from django.shortcuts import get_object_or_404
from ..serializers import StudentSerializer
from rest_framework.permissions import AllowAny



class SearchView(APIView):
    permission_classes = [AllowAny]
    @handle_exceptions
    def get(self, request: HttpRequest) -> Response:
        search_param = request.query_params.get('search')

        if not search_param:
            return Response({"error": "Missing query parameter 'search'"}, status=400)
        if students := Student.objects.filter(name__icontains=search_param):
            students = StudentSerializer(students, many=True).data
            return Response(students)

        return Response([])

class GetDetailView(APIView):
    permission_classes = [AllowAny]
    @handle_exceptions
    def get(self, request: HttpRequest) -> Response:
        search_id = request.query_params.get("id")
        student = get_object_or_404(
            Student.objects.prefetch_related("fees__payments"), id=search_id)
        student_info = StudentSerializer(student)
        student_info = student_info.data
        payment_info = self.get_payment_info(student)
        student_info["payment_info"] = payment_info
        return Response(student_info)
        
    def get_payment_info(self, student):
        
        payment_info = {}
        for fee in student.fees.all():
            payment_info[fee.name] = {"total": fee.total_paid, "payments": []} 
            for payment in fee.payments.all():
                payment_info[fee.name]["payments"].append(
                    {"amount": payment.amount, "date": payment.date_paid})
                
        return payment_info
    

