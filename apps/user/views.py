from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User, PasswordReset
from django.http import HttpRequest
from .utils import (get_school_from_token, get_user_by_school, 
                    add_role_to_user, validate_and_save_data)
from .serializer import UserSerializer, MyTokenObtainPairSerializer, ResetPasswordRequestSerializer
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import NotAuthenticated, ValidationError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.permissions import AllowAny



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

    

class Logout(APIView):
    def post(self, request: HttpRequest) -> Response:
        '''
        Logout the user
        '''
        return Response(status=status.HTTP_200_OK)

class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request: HttpRequest) -> Response:
        '''
        Reset the user password
        '''
        email = request.data.get('email')
        try:
            user = self.get_user_from_email(email)
            token = self.generate_password_reset_token(user)
            data = validate_and_save_data(
                ResetPasswordRequestSerializer, 
                {'email': email, 'token': token})
        except Exception as e:
            print(e)
        return Response(
            {'message': 'Password reset link has been sent to your email', 'data': data},
              status=status.HTTP_200_OK)
    
    def get_user_from_email(self, email: str) -> User:
        '''
        Get the user from the email
        '''
        if not email:
            raise ValidationError('Email is required')
        if user := User.objects.filter(email__iexact=email).first():
            return user
        else:
            raise ValidationError('User with this email does not exist')
        
    def generate_password_reset_token(self, user: User) -> str:
        '''
        Generate the password reset token
        '''
        return PasswordResetTokenGenerator().make_token(user)
    
    def put(self, request: HttpRequest) -> Response:
        '''
        Update the password
        '''
        token = request.data.get('token')
        password = request.data.get('password')
        confirmed_password = request.data.get('confirmed_password')

        self.verify_passwordreset_token(token)
        self.validate_passwords(password, confirmed_password)
        user = self.get_user_from_token(token)
        self.update_user_password(user, password)

        return Response(
            {'message': 'Password has been reset successfully'},
            status=status.HTTP_200_OK
        )



    def verify_passwordreset_token(self, token: str) -> bool:
        '''
        Verify the token
        '''
        if not token:
            raise ValidationError('Password reset token is required')
        password_reset = PasswordReset.objects.filter(token=token).first()
        if not password_reset:
            raise ValidationError('Invalid  Password reset token')
        if password_reset.is_expired():
            raise ValidationError('Password reset token has expired')
        return True
    
    def validate_passwords(self, password: str, confirmed_password: str) -> bool:
        '''
        Validate the password
        '''
        if not password or not confirmed_password:
            raise ValidationError('Password and confirmed password are required')
        if password != confirmed_password:
            raise ValidationError('Passwords do not match')
        return True
    
    def get_user_from_token(self, token: str) -> User:
        '''
        Get the user from the token
        '''
        password_reset = PasswordReset.objects.filter(token=token).first()
        return User.objects.filter(email__iexact=password_reset.email).first()
    
    def update_user_password(self, user, password: str):
        '''
        Update the user password
        '''
        serializer = UserSerializer(user, data={'password': password}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

    
  

