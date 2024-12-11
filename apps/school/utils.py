from apps.user.models import User
from .serializer import SchoolSerializer
from rest_framework.exceptions import ValidationError
from .models import School


class SchoolService:
    # check user has school
    @staticmethod
    def check_user_has_school(user: User) -> bool:
        '''
        Check out if the user has a school 
        '''
        return hasattr(user, 'school')
    
    def create_school(self, school_data: dict, user: User) -> dict:
        """
        Create a school for the user.
        """
        if self.check_user_has_school(user):
            raise ValidationError("User can only have one school.")

        serializer = SchoolSerializer(data=school_data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=user)
        return serializer.data
    
    def get_user_school(self, user: User) -> School:
        """
        Retrieve the user's school or raise an error.
        """
        if not self.check_user_has_school(user):
            raise ValidationError("User has no school.")
        return user.school
    

    def update_school(self, user: User, school_data: dict) -> dict:
        """
        Update the school associated with a user.
        """
        if not self.check_user_has_school(user):
            raise ValidationError("User has no school.")
        
        school = user.school
        serializer = SchoolSerializer(school, data=school_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer.data

        
