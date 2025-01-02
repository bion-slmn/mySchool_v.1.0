from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..service import Userservice
from django.http import HttpRequest
from ..utils import (get_school_from_token, get_user_by_school, 
                    add_role_to_user, validate_and_save_data)
from ..serializer import UserSerializer
from rest_framework.permissions import AllowAny





class UserListView(APIView):
    # get all users/teachers in the school of the admin
    def __init__(self, userservice=None):
        self.userservice = userservice or Userservice()

    def get(self, request: HttpRequest) -> Response:
        '''
        Get all users/teachers in the school of the admin
        '''
        school = get_school_from_token(request)
        user = get_user_by_school(request, school)
        user_data = self.userservice.get_serialized_user(user)
        return Response(user_data, status=status.HTTP_200_OK)
       

class UserView(APIView):
    # get a user/teacher in the school of the admin by id
    def __init__(self, userservice=None):
        self.userservice = userservice or Userservice()

    def get(self, request: HttpRequest) -> Response:
        '''
        Get a user/teacher in the school of the admin by id
        '''
        user_id = self.validate_user_id(request)
        school = get_school_from_token(request)
        user = self.userservice.get_user(user_id, request, school)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)   


class CreateAdminView(APIView):
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


    def post(self, request: HttpRequest) -> Response:
        ''' Create an admin user '''
        data = add_role_to_user(request, 'admin')
        data = validate_and_save_data(UserSerializer, data)
        return Response(data, status=status.HTTP_201_CREATED)