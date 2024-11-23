from django.shortcuts import get_object_or_404
from ..models.school_model import School
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import SchoolSerializer
from ..decorator import handle_exceptions


class SchoolView(APIView):
    @handle_exceptions
    def get(self, request: HttpRequest, school_id: str) -> Response:
        """
        Retrieves the details of a specific school based on the provided school ID.
        Args:
            request (HttpRequest): The HTTP request object.
            school_id (str): The ID of the school to retrieve.

        Returns:
            Response: A response containing the serialized school data.
        """

        school = get_object_or_404(School, id=school_id)
        serializer = SchoolSerializer(school)
        return Response(serializer.data)


class CreateSchool(APIView):
    @handle_exceptions
    def post(self, request: HttpRequest) -> Response:
        """
        Creates a new school record based on the provided request data.

        Args:
            request (HttpRequest): The HTTP request object containing school data.

        Returns:
            Response: A response containing the serialized school data
            if successful, or error details if validation fails.

        Raises:
            Http400: If the user already has a school associated with their account.
        """

        if self._check_user_has_school(request):
            raise ValueError('User can only have one school')
        
        serializer = SchoolSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)
        return Response(serializer.data, 201)
        

    def _check_user_has_school(self, request: HttpRequest) -> bool:
        """
        Checks if the user has an associated school.
        Args:
            request (HttpRequest): The HTTP request object containing user information.

        Returns:
            bool: True if the user has a school, otherwise False.
        """
        return hasattr(request.user, 'schools')
