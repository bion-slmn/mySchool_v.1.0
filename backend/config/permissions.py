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