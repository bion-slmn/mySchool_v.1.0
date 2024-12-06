from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import User
from django.http import HttpRequest
from ..utils import (get_school_from_token, get_user_by_school, 
                    add_role_to_user, validate_and_save_data)
from ..serializer import UserSerializer
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotAuthenticated, ValidationError



class UserListView(APIView):
    # get all users/teachers in the school of the admin
    def get(self, request: HttpRequest) -> Response:
        '''
        Get all users/teachers in the school of the admin
        '''
        school = get_school_from_token(request)
        user = get_user_by_school(request, school)
        user_data = self.get_serialized_user(user)
        return Response(user_data, status=status.HTTP_200_OK)
    
    def get_serialized_user(self, user: User) -> dict:
        '''
        Serialize the user
        '''
        if isinstance(user, list):
            serializer = UserSerializer(user, many=True)
        else:
            serializer = UserSerializer(user)
        return serializer.data
        
    

class UserView(APIView):
    # get a user/teacher in the school of the admin by id
    def get(self, request: HttpRequest) -> Response:
        '''
        Get a user/teacher in the school of the admin by id
        '''
        user_id = self.validate_user_id(request)
        school = get_school_from_token(request)
        user = self.get_user(user_id, request, school)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def validate_user_id(self, request: HttpRequest) -> str:
        '''
        Validate the user id
        '''
        if user_id := request.query_params.get('id'):
            return user_id
        else:
            raise ValidationError('User id is required')
    
    def get_user(self, user_id: str, request: HttpRequest,  school=None) -> User:
        '''
        Get a user/teacher in the school of the admin by id
        '''
        if school:
            user = get_object_or_404(User, id=user_id, school=school)
        elif user_id.strip('"') != str(request.user.id):  
            raise NotAuthenticated('You are not authorized to view this user')
        else:
            user = request.user

        return user
    


class CreateAdminView(APIView):
    #permission_classes = [AllowAny]

    def get(self, request: HttpRequest) -> Response:
        '''
        get user admin information
        '''
        user = request.user
        user_data = self.add_school_to_user_info(user)

        return Response(user_data, 200)

    def add_school_to_user_info(self, user: User) -> dict:
        '''
        Add the school information to the user information
        '''
        user_data = UserSerializer(user).data
        if hasattr(user, 'school'):
            school = user.school
            user_data['school_name'] = school.name
            user_data['school_id'] = school.id
        return user_data

    def post(self, request: HttpRequest) -> Response:
        ''' Create an admin user '''
        data = add_role_to_user(request, 'admin')
        data = validate_and_save_data(UserSerializer, data)
        return Response(data, status=status.HTTP_201_CREATED)

    
  

