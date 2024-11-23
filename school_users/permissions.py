# permissions.py
from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """
    Custom permission to only allow access to admins.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class IsTeacher(BasePermission):
    """
    Custom permission to only allow access to teachers.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'teacher'

class IsAdminOrTeacher(BasePermission):
    """
    Custom permission to allow access to either admins or teachers.
    """
    def has_permission(self, request, view):
        """
        Checks if the user has the necessary permissions to access a view.

        This function verifies that the user is authenticated and has either 
        an 'admin' or 'teacher' role, allowing access to the specified view.

        Args:
            request: The HTTP request object containing user information.
            view: The view that the user is attempting to access.

        Returns:
            bool: True if the user is authenticated and has the required role, 
            False otherwise.
        """

        return request.user and request.user.is_authenticated and request.user.role in ['admin', 'teacher']
