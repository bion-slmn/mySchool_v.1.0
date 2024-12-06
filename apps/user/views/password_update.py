from django.http import HttpRequest
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.contrib.auth.tokens import PasswordResetTokenGenerator, default_token_generator
from rest_framework.permissions import AllowAny
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.shortcuts import get_object_or_404

from ..models import User
from ..serializer import UserSerializer




class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []


    def get(self, request: HttpRequest) -> Response:
        '''
        Confirm the validity of the password reset token
        '''
        token = request.query_params.get('token')
        self.verify_passwordreset_token(token)
        return Response(
            {'message': 'Password reset token is valid'},
            status=status.HTTP_200_OK
        )

    def post(self, request: HttpRequest) -> Response:
        '''
        Reset the user password
        '''
        email = request.data.get('email')
        try:
            user = self.get_user_from_email(email)
            password_reset_token = self.generate_password_reset_token(user)
            # send email with the password reset link
            print(password_reset_token, 33333333333)
        except Exception as e:
            print(e)
        return Response(
            {'message': 'Password reset link has been sent to your email'},
              status=status.HTTP_200_OK)
    
    def put(self, request: HttpRequest) -> Response:
        '''
        Update the password
        '''
        token = request.data.get('token')
        password = request.data.get('password')
        confirmed_password = request.data.get('confirmed_password')
        print(token, password, confirmed_password, 444444444)

        user = self.verify_passwordreset_token(token)
        self.validate_passwords(password, confirmed_password)
        self.update_user_password(user, password)

        return Response(
            {'message': 'Password has been reset successfully'},
            status=status.HTTP_200_OK
        )
    
    def get_uid_and_token(self, token: str) -> tuple:
        '''
        Get the uid and token from the token
        '''
        if not token:
            raise ValidationError('Password reset token is required')
        uid, token = token.split('.')
        return uid, token
    
    def verify_reset_token(self, token: str, user: User) -> bool:

        '''
        Verify the uid and email
        '''
        if not token:
            raise ValidationError('Invalid link')
        if token := default_token_generator.check_token(user, token):
            return True
        else:
            raise ValidationError('Invalid link')
        
    
    def verify_uid(self, uid: str) -> User:
        '''
        Verify the uid
        '''
        if not uid:
            raise ValidationError('Invalid link')
        uid = urlsafe_base64_decode(uid).decode()
        return get_object_or_404(User, id=uid)


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
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)
        return f'{uid}.{token}'
    
    
    def verify_passwordreset_token(self, token: str) -> User:
        '''
        Verify the token
        '''
        uid, token = self.get_uid_and_token(token)
        print(uid, token, 333333333)
        user = self.verify_uid(uid)
        self.verify_reset_token(token, user)
        return user
    
    def validate_passwords(self, password: str, confirmed_password: str) -> bool:
        '''
        Validate the password
        '''
        if not password or not confirmed_password:
            raise ValidationError('Password and confirmed password are required')
        if password != confirmed_password:
            raise ValidationError('Passwords do not match')
        return True

    
    def update_user_password(self, user, password: str):
        '''
        Update the user password
        '''
        serializer = UserSerializer(user, data={'password': password}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
