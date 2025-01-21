from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpRequest
from rest_framework_simplejwt.views import TokenObtainPairView
from ..serializer import MyTokenObtainPairSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate


class Logout(APIView):
    def post(self, request: HttpRequest) -> Response:
        '''
        Logout the user
        '''
        return Response(status=status.HTTP_200_OK)
    


class LoginUserAPIView(APIView):
    permission_classes = [AllowAny]
    role = None

    def post(self, request, role=None):
        email = request.data.get('email')
        password = request.data.get('password')

        print(email, password, 1111111111)

        # Authenticate the user
        user = authenticate(email=email, password=password)
        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        
        # Check if the user's role matches the provided role
        if role and user.role != self.role:
            return Response({"error": f"Unauthorized: Only {self.role} can log in here."}, status=status.HTTP_403_FORBIDDEN)
        
        # Generate JWT tokens
        serializer = MyTokenObtainPairSerializer()
        tokens = serializer.get_token(user)

        return Response({
            "access": str(tokens.access_token),
            "refresh": str(tokens)
        }, status=status.HTTP_200_OK)


class AdminLogin(LoginUserAPIView):
    role = 'admin'

class TeacherLogin(LoginUserAPIView):
    role = 'teacher'

class ParentLogin(LoginUserAPIView):
    role = 'parent'

