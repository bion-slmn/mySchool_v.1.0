'''get the school of the user from the token
'''
import jwt
from django.conf import settings
from django.http import HttpRequest
from .models import User
from  ..school.models import School
from django.core.exceptions import ValidationError
from .serializer import UserSerializer
from django.contrib.auth.models import Group


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
    roles = {
        "admin": User.objects.filter(id=school.owner_id),
        "teachers": school.teachers,
    }

    data = {
        role: list(queryset.values("id", "email", "first_name", "last_name"))
        for role, queryset in roles.items()
    }

    return data

def add_role_to_user(request: HttpRequest, role: str, school=None) -> User:
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


def validate_and_save_data(serializer_class, data):
        '''
        Validates and saves data using the provided serializer class.
        '''
        serializer = serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer.instance, serializer.data


def get_user_from_email(email: str) -> User:
    """
    Fetch the user by their email address.
    """
    if not email:
        raise ValidationError("Email is required.")
    if user := User.objects.filter(email__iexact=email).first():
        return user
    else:
        raise ValidationError("User with this email does not exist.")
        
def validate_school_dependency(self, role, school=None):
    """
    Validate the school dependency for the user.
    """
    roles_requiring_school = (User.SchoolRoles.TEACHER, User.SchoolRoles.PARENT)
    if role in roles_requiring_school and not school:
        raise ValidationError(f"User must have a school to add a {role}.")

    return True

    

def add_admin_to_school(user, school):
    """
    Add an admin to a school.
    """
    if not school:
        raise ValidationError("School is required to assign an admin.")
    if school.owner:
        raise ValidationError("This school already has an admin.")
    school.owner = user
    school.save()

def add_user_to_group(user, role):
    """
    Add a user to a group based on the role.
    """
    group = Group.objects.get(name=role)
    group.user_set.add(user)
    group.save()
    

def add_user_to_school(user, school=None, role=None):
    """
    Add a user to a school based on the role.
    """
    if role == User.SchoolRoles.ADMIN:

        return None
    if school is None:
        raise ValidationError("School is required to assign a role.")
    elif role == User.SchoolRoles.TEACHER:
        school.teachers.add(user)

    elif role == User.SchoolRoles.PARENT:
        school.parents.add(user)

    school.save()
    return user

def get_user_school(request: HttpRequest) -> School:
    """
    Get the school of the user.
    """
    user = request.user
    if not user.is_authenticated:
        return None
    return getattr(user, 'school', None)