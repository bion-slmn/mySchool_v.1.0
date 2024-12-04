'''get the school of the user from the token
'''
import jwt
from django.conf import settings
from django.http import HttpRequest
from .models import User
from  ..school.models import School
from django.core.exceptions import ValidationError

def get_school_from_token(request: HttpRequest) -> str:
    """
    Get the school of the user from the token.

    Args:
        request (HttpRequest): The request object.

    Returns:
        str: The school of the user.
    """
    auth_header = request.headers.get("Authorization")
    token = auth_header.split(" ")[1]
    decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    return decoded_token.get("school", None)


def get_user_by_school( request: HttpRequest, school: School = None) -> User:
    """
    Get the user by the school.

    Args:
        school (School): The school object.

    Returns:
        User: The user object.
    """
    user = User.objects.get(school=school) if school else request.user
    return user

def add_role_to_user(request: HttpRequest, role: str) -> User:
    """
    Add a role to the user.

    Args:
        request (HttpRequest): The request object.
        role (str): The role to add.

    Returns:
        User: The user object.
    """
    valid_roles = [choice[0] for choice in User.SchoolRoles.choices]
    if role not in valid_roles:
        raise ValidationError(f"Invalid role: {role}")
    request_copy = request.data.copy()
    request_copy["role"] = role

    return request_copy 