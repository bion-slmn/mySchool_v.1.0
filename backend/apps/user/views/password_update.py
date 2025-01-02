from django.http import HttpRequest
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from ..service import TokenService, PasswordService
from ..utils import get_user_from_email
    

class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def __init__(self, token_service=None, password_service=None):
        self.token_service = token_service or TokenService()
        self.password_service = password_service or PasswordService()


    def get(self, request: HttpRequest) -> Response:
        '''
        Confirm the validity of the password reset token
        '''
        token = request.query_params.get('token')
        self.token_service.verify_passwordreset_token(token)
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
            user = get_user_from_email(email)
            password_reset_token = self.token_service.generate_password_reset_token(user)
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

        user = self.token_service.verify_passwordreset_token(token)
        self.password_service.validate_passwords(password, confirmed_password)
        self.password_service.update_user_password(user, password)

        return Response(
            {'message': 'Password has been reset successfully'},
            status=status.HTTP_200_OK
        )