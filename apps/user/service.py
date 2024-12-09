from django.contrib.auth.tokens import PasswordResetTokenGenerator, default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from .models import User
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from .serializer import UserSerializer
from django.http import HttpRequest
from rest_framework.exceptions import NotAuthenticated



class TokenService:
    @staticmethod
    def generate_password_reset_token(user: User) -> str:
        """
        Generate the password reset token.
        """
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)
        return f"{uid}.{token}"
    
    @staticmethod
    def verify_uid(uid: str) -> User:
        """
        Verify the uid.
        """
        if not uid:
            raise ValidationError("Invalid link")
        uid = urlsafe_base64_decode(uid).decode()
        return get_object_or_404(User, id=uid)
    
    @staticmethod
    def verify_reset_token(token: str, user: User) -> bool:
        """
        Verify the uid and email.
        """
        if not token:
            raise ValidationError("Invalid link")
        if default_token_generator.check_token(user, token):
            return True
        else:
            raise ValidationError("Invalid link")
    
    @staticmethod    
    def verify_passwordreset_token(token: str) -> User:
        """
        Verify the token.
        """
        uid, token = TokenService.get_uid_and_token(token)
        user = TokenService.verify_uid(uid)
        TokenService.verify_reset_token(token, user)
        return user
    
    @staticmethod
    def get_uid_and_token(token: str) -> tuple:
        """
        Get the uid and token from the token.
        """
        if not token:
            raise ValidationError("Password reset token is required")
        uid, token = token.split(".")
        return uid, token


class PasswordService:
    @staticmethod
    def validate_passwords(password: str, confirmed_password: str) -> bool:
        """
        Validate the passwords.
        """
        if not password or not confirmed_password:
            raise ValidationError("Password and confirmed password are required.")
        if password != confirmed_password:
            raise ValidationError("Passwords do not match.")
        return True

    @staticmethod
    def update_user_password(user, password: str):
        """
        Update the user's password.
        """
        serializer = UserSerializer(user, data={"password": password}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()


class Userservice:

    @staticmethod
    def get_serialized_user(user: User) -> dict:
        '''
        Serialize the user
        '''
        if isinstance(user, list):
            serializer = UserSerializer(user, many=True)
        else:
            serializer = UserSerializer(user)
        return serializer.data

    @staticmethod
    def validate_user_id(request: HttpRequest) -> str:
        '''
        Validate the user id
        '''
        if user_id := request.query_params.get('id'):
            return user_id
        else:
            raise ValidationError('User id is required')
    
    @staticmethod
    def get_user(user_id: str, request: HttpRequest,  school=None) -> User:
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
    
    @staticmethod
    def add_school_to_user_info(user: User) -> dict:
        '''
        Add the school information to the user information
        '''
        user_data = UserSerializer(user).data
        if hasattr(user, 'school'):
            school = user.school
            user_data['school_name'] = school.name
            user_data['school_id'] = school.id
        return user_data
