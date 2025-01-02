from apps.user.models import User
from .serializer import SchoolSerializer, TermSerializer
from rest_framework.exceptions import ValidationError
from .models import School, Term
from django.shortcuts import get_object_or_404


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



class TermService:
    def __init__(self, school_service=None):
        """
        Initialize TermService with an optional SchoolService dependency.
        """
        self.school_service = school_service or SchoolService()

    

    def get_school_terms(self, user: User) -> list:
        """
        Retrieve the terms for the school associated with the given user.

        """
        # Ensure the user has an associated school
        if not self.school_service.check_user_has_school(user):
            raise ValidationError('The user has no associated school and thus no terms.')

        terms = user.school.terms.all()
        return terms
    
    def create_school_term(self, user: User, school_data: dict) -> dict:
        '''
        Create a school term
        '''
        if not self.school_service.check_user_has_school(user):
            raise ValidationError('The user has no associated school')
        
        serializer = TermSerializer(data=school_data)
        school = user.school
        serializer.is_valid(raise_exception=True)
        serializer.save(school=school)
        return serializer.data
    
    def get_term_object(self, term_id) -> Term:
        '''
        Retrieve a Term object by ID, raising a 404 error if not found.
        '''
        return get_object_or_404(Term, id=term_id)

    
    def update_term(self, user: User, school_data: dict, term_id: str) -> dict:
        if not self.school_service.check_user_has_school(user):
            raise ValidationError('The user has no associated school')
        term = self.get_term_object(term_id)

        serializer = TermSerializer(term, data=school_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer.data

    def delete_term(self, term_id: str):
        term = self.get_term_object(term_id)
        term.delete()
        return None
        