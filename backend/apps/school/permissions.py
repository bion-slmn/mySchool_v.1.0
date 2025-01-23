from rest_framework.permissions import BasePermission


class IsSchoolAdmin(BasePermission):
    """
    Custom permission to check if the user has any of the required group permissions.
    """

    def has_permission(self, request, view):
        if request.method == 'POST' or request.method == 'PUT' or request.method == 'DELETE':
            return request.user.groups.filter(name__in=['admin']).exists()
        return True