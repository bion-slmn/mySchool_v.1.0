from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .serializer.user_serializer import UserSerializer
from .models import User
from django.http import HttpRequest
from rest_framework.response import Response
from .permissions import IsAdmin
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializer.user_serializer import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView



class MyTokenObtainPairView(TokenObtainPairView):
    print('here')
    serializer_class = MyTokenObtainPairSerializer



class UserView(APIView):
    permission_classes = [IsAdmin]
    def get(self, request: HttpRequest, user_id: str) -> Response:
        """
        Retrieves user data based on the provided user ID.

        Args:
            request: The HTTP request object containing the request data.
            user_id: The unique identifier of the user to retrieve.

        Returns:
            Response: A response object containing the serialized user data.

        Raises:
            Http404: If the user with the specified ID does not exist.
        """

        user = get_object_or_404(User, id=user_id)
        user_data = UserSerializer(user).data
        return Response(user_data)
    
    def post(self, request: HttpRequest) ->Response:
        """
        Handles the creation of a new user based on the 
        provided request data.

        Args:
            request: The HTTP request object containing the
            user data to be created.

        Returns:
            Response: A response object indicating the result 
            of the operation, 
            either a success message with a 201 status or 
            validation errors with a 400 status.
        """
        data = request.data.copy()
        data['role'] = 'teacher'

        serializer =  UserSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
        return Response(serializer.data, status=201)
        
    
    def put(self, request: HttpRequest, user_id: str) -> Response:
        """
        Updates an existing user's information based on the 
        provided user ID and request data. It doesnt update pasword

        Args:
            request: The HTTP request object containing
              the data to update the user.
            user_id: The unique identifier of the user to be updated.

        Returns:
            Response: A response object containing the updated user 
            data with a 201 status if successful, 
            or validation errors with a 400 status if the update fails.

        Raises:
            Http404: If the user with the specified ID does not exist.
        """

        if not request.data:
            return Response('You have to pass data', status=400)
        user = get_object_or_404(User, id=user_id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data, status=200)
        
    
class CreateAdminView(APIView):
    def get_permissions(self):
        """
        Dynamically assign permissions based on the request method.
        """
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        elif self.request.method == 'POST':
            return [AllowAny()]
        return super().get_permissions()

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

        data = request.data.copy()
        data['role'] = 'admin'

        serializer = UserSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            # Save the user instance
            user = serializer.save()
            user.save()  # Save after setting flags

        return Response(serializer.data, status=201)

