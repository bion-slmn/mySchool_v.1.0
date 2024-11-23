from django.shortcuts import get_object_or_404
from ..models.grade_model import Grade
from ..models.student_model import Student
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import GradeSerializer
from ..decorator import handle_exceptions
from django.db.models import Count
from rest_framework import status
from rest_framework.permissions import AllowAny


def check_has_school(request: HttpRequest) -> bool:
    """
    Checks if the user has an associated school.
        This function returns the user's school if it exists, otherwise it returns None.

        Args:
            request (HttpRequest): The HTTP request object containing user information.

        Returns:
            bool: The user's school if it exists, otherwise None.
    """

    my_school = request.user.schools
    if my_school:
        return my_school
    return None


class GradeView(APIView):
    permission_classes = [AllowAny]
    @handle_exceptions
    def get(self, request: HttpRequest) -> Response:
        """
        Retrieves a list of all grades available in the system.
        Args:
            request (HttpRequest): The HTTP request object.

        Returns:
            Response: A response containing a list of grades with their IDs and names.
        """

        grades = Grade.objects.all().values('id', 'name')
        return Response(grades)

    @handle_exceptions
    def post(self, request: HttpRequest) -> Response:
        """
        Creates a new grade record based on the provided request data.
        Args:
            request (HttpRequest): The HTTP request object containing grade data.

        Returns:
            Response: A response containing the serialized grade data if successful,
              or error details if validation fails.

        Raises:
            ValueError: If the user does not have an associated school.
        """

        my_school = check_has_school(request)
        if not my_school:
            raise ValueError('Create a school first be4 adding a grade')
        serializer = GradeSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(school=my_school)
            return Response(serializer.data, 201)
        return Response(serializer.errors, 400)


class StudentInGradeView(APIView):
    permission_classes = [AllowAny]
    @handle_exceptions
    def get(self, request: HttpRequest, grade_id: str) -> Response:
        """
        Get the list of students in a grade.
        """
        students = Student.objects.filter(grade_id=grade_id).values('id', 'name')
        return Response(students)
