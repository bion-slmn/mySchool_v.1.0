from rest_framework.permissions import BasePermission

def HasAnyGroupPermission(*permissions):
    class PermissionClass(BasePermission):
        def has_permission(self, request, view):
            return any(request.user.has_perm(perm) for perm in permissions)

    return PermissionClass


def HasAllGroupPermission(*permissions):
    class PermissionClass(BasePermission):
        def has_permission(self, request, view):
            return all(request.user.has_perm(perm) for perm in permissions)

    return PermissionClass


class AdminOnlyForSensitiveActions(BasePermission):
    """
    Custom permission to check if the user has any of the required group permissions.
    """

    def has_permission(self, request, view):
        if request.method == 'POST' or request.method == 'PUT' or request.method == 'DELETE':
            return request.user.groups.filter(name__in=['admin']).exists()

        return True


class AdminOnly(BasePermission):
    """
    Custom permission to check if the user has any of the required group permissions.
    """

    def has_permission(self, request, view):
        return request.user.groups.filter(name__in=['admin']).exists()

class TeacherorAdminOnly(BasePermission):
    """
    Custom permission to check if the user has any of the required group permissions.
    """

    def has_permission(self, request, view):
        return request.user.groups.filter(name__in=['admin', 'teacher']).exists()