from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpRequest
from rest_framework_simplejwt.views import TokenObtainPairView
from ..serializer import MyTokenObtainPairSerializer    


class Logout(APIView):
    def post(self, request: HttpRequest) -> Response:
        '''
        Logout the user
        '''
        return Response(status=status.HTTP_200_OK)
    


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
