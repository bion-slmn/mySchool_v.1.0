from django.shortcuts import get_object_or_404
from ..models.student_model import Student
from ..models.fee_model import Fee
from ..models.grade_model import Grade
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import StudentSerializer
from .grade_view import check_has_school
from ..decorator import handle_exceptions
from typing import List


class StudentView(APIView):
    def get(self, request: HttpRequest, student_id: str) -> Response:
        """
        Retrieves a student's information based on the provided student ID.
        Args:
            request (HttpRequest): The HTTP request object.
            student_id (str): The ID of the student to retrieve.

        Returns:
            Response: A response containing the serialized student data.
        """

        student = get_object_or_404(Student, id=student_id)
        serializer = StudentSerializer(student)
        return Response(serializer.data)


class CreateStudent(APIView):
    @handle_exceptions
    def post(self, request: HttpRequest) -> Response:
        """
        Creates a new student record based on the provided request data.

        Args:
            request (HttpRequest): The HTTP request object containing student data.

        Returns:
            Response: A response containing the serialized student data if successful,
              or error details

        Raises:
            Http404: If the specified grade does not exist.
        """
        admission = request.query_params.get('admission')
        school = check_has_school(request)
        if not school:
            return Response('User has no School', 400)      
    
        serializer = StudentSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        student = serializer.save(school=school)
        if admission:
            self.add_addmision_fee(student)
        return Response(serializer.data, 201)
    
    def add_admission_fee(self, student: Student) -> None:
        fees = Fee.objects.filter(fee_type = "ADMISSION")
        student.add.fees(*fees)


class PromoteStudent(APIView):
    @handle_exceptions
    def patch(self, request: HttpRequest, grade_id:str) -> Response:
        """
        Promotes  students in a grade to the next grade level.

        Args:
            request (HttpRequest): The HTTP request object.
            grade_id (str): The ID of the grade to promote students from.

        Returns:
            Response: A response indicating the success of the operation.
        """
        next_grade = get_object_or_404(Grade, id=grade_id)
        student_list = request.data.get('student_ids')
        students =Student.objects.filter(id__in=student_list).update(grade=next_grade)
        self.update_student_fees(students, next_grade)
        return Response('Students promoted successfully', 200)
    

    def update_student_fees(self, students:List, grade: Grade) -> None:
        active_fees = grade.fees.filter(is_active=True)
        for fee in active_fees:
            fee.students.add(*students)
        