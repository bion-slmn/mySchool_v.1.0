from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from django.http import HttpRequest
from .utils import (get_school_from_token, get_user_by_school, 
                    add_role_to_user)
from .serializer import UserSerializer, MyTokenObtainPairSerializer
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import NotAuthenticated



class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Class view for the user 
class UserListView(APIView):
    # get all users/teachers in the school of the admin
    def get(self, request: HttpRequest) -> Response:
        '''
        Get all users/teachers in the school of the admin
        '''
        school = get_school_from_token(request)
        user = get_user_by_school(request, school)
        if isinstance(user, list):
            serializer = UserSerializer(user, many=True)
        else:
            serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class UserView(APIView):
    # get a user/teacher in the school of the admin by id
    def get(self, request: HttpRequest) -> Response:
        '''
        Get a user/teacher in the school of the admin by id
        '''
        user_id = request.query_params.get('id')
        if not user_id:
            return ValueError('User id is required')
        school = get_school_from_token(request)
        user = self.get_user(user_id, request, school)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def get_user(self, user_id: str, request: HttpRequest,  school=None) -> User:
        '''
        Get a user/teacher in the school of the admin by id
        '''
        if school:
            user = get_object_or_404(User, id=user_id, school=school)
        elif user_id.strip('"') != str(request.user.id):  # Check if it's a request for the current user
            print('User id:', user_id, 'Request user id:', request.user.id)
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
        user_data = UserSerializer(user).data
        if hasattr(user, 'schools'):
            school = user.schools
            user_data['school_name'] = school.name
            user_data['school_id'] = school.id

        return Response(user_data, 200)

    def post(self, request: HttpRequest) -> Response:
        data = add_role_to_user(request, 'admin')
        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

        
