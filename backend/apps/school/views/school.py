from ..serializer import SchoolSerializer
from rest_framework.views import APIView
from django.http import HttpRequest
from rest_framework.response import Response
from ..utils import SchoolService
from rest_framework import status
from config.permissions import AdminOnlyForSensitiveActions
from rest_framework.permissions import IsAuthenticated

class SchoolView(APIView):
    permission_classes = [AdminOnlyForSensitiveActions, IsAuthenticated]

    def __init__(self, schoolservice=None):
        self.schoolservice = schoolservice or SchoolService()

    def get(self, request: HttpRequest) ->Response:
        '''View school info'''
        user = request.user
        school = self.schoolservice.get_user_school(user)
        serializer = SchoolSerializer(school)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def post(self, request: HttpRequest) -> Response:
        '''Create a school for a user'''
        user = request.user
        school_data = request.data
        school_info = self.schoolservice.create_school(school_data, user)
        return Response(school_info, status=status.HTTP_201_CREATED)
    
    def put(self, request: HttpRequest) -> Response:
        '''
        update school information
        '''
        school_data = request.data
        user = request.user
        school_info =  self.schoolservice.update_school(user, school_data)
        return Response(school_info, status=status.HTTP_200_OK)


class TotalNumberofStudents(APIView):
    permission_classes = [AdminOnlyForSensitiveActions, IsAuthenticated]

    def __init__(self, schoolservice=None):
        self.schoolservice = schoolservice or SchoolService()

    def get(self, request: HttpRequest) ->Response:
        '''View school total number of students'''
        user = request.user
        total_students = self.schoolservice.get_total_students(user)
        return Response(total_students, status=status.HTTP_200_OK) 