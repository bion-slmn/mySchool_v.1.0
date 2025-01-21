from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..service import Userservice
from django.http import HttpRequest
from ..utils import (get_school_from_token, get_user_by_school, 
                    add_role_to_user, validate_and_save_data,
                    validate_school_dependency, add_user_to_school, get_user_school)
from ..serializer import UserSerializer
from rest_framework.permissions import AllowAny
from ..models import User
from ..permission import IsAdmin, IsTeacher, IsTeacherOrAdmin
from django.db import transaction




class UserListView(APIView):
    permission_classes = [IsAdmin]
    # get all users/teachers in the school of the admin
    def __init__(self, userservice=None):
        self.userservice = userservice or Userservice()

    def get(self, request: HttpRequest) -> Response:
        '''
        Get all users/teachers in the school of the admin
        '''
        school = get_user_school(request)
        user_data = get_user_by_school(request, school)
        return Response(user_data, status=status.HTTP_200_OK)
       

class UserView(APIView):
    permission_classes = [IsTeacherOrAdmin]

    def __init__(self, userservice=None):
        self.userservice = userservice or Userservice()

    def get(self, request: HttpRequest) -> Response:
        '''
        Get a user/teacher in the school of the admin by id
        '''
        school = get_school_from_token(request)
    
        user = get_user_by_school(request, school)
        user_data = self.userservice.get_serialized_user(user)
        return Response(user_data, status=status.HTTP_200_OK) 


class CreateUser(APIView):
    role = None
    permission_classes = [AllowAny]
    
    def __init__(self, userservice=None):
        self.userservice = userservice or Userservice()

    def get(self, request: HttpRequest) -> Response:
        '''
        get user admin information
        '''
        user = request.user
        user_data = self.userservice.add_school_to_user_info(user)
        return Response(user_data, 200)
    
    @transaction.atomic
    def post(self, request: HttpRequest) -> Response:
        ''' Create a user, parent, teacher or admin'''
        data = add_role_to_user(request, self.role)
        school = get_user_school(request)
        validate_school_dependency(self.role, school)

        user_instance, user_data = validate_and_save_data(UserSerializer, data)
        
        print(school, 33333333333333333333)
        add_user_to_school(user_instance, school, self.role)
        
        return Response(user_data, status=status.HTTP_201_CREATED)


class CreateAdminView(CreateUser):
    permission_classes = [IsAdmin]
    role = User.SchoolRoles.ADMIN

class CreateParentView(CreateUser):
    permission_classes = [IsTeacherOrAdmin]
    role = User.SchoolRoles.PARENT

class CreateTeacherView(CreateUser):
    permission_classes = [IsAdmin]
    role = User.SchoolRoles.TEACHER



class TestApi(APIView):
     permission_classes = [AllowAny]

     def get(self, request: HttpRequest) -> Response:
        return Response('Application server is live.................')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      