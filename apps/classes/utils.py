from ..school.utils import SchoolService
from  ..user.models import User
from rest_framework.exceptions import ValidationError
from .serializer import GradeSerializer
from .models import Grade
from django.shortcuts import get_object_or_404

class GradeService:

    def __init__(self, school_service=None):
        self.school_service = school_service or SchoolService()

    def get_all_school_grade(self, user: User) -> list:
        if not self.school_service.check_user_has_school(user):
            raise ValidationError('User has no school')
        grades = user.school.grades.all()
        return grades
    
    def create_grade(self, user: User, grade_data: dict) -> dict:
        '''
        create a new grade in a school
        '''
        if not self.school_service.check_user_has_school(user):
            raise ValidationError('User has no school')
        grade_data['school'] = user.school.id
        serializer = GradeSerializer(data=grade_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer.data
    
    def get_grade_object(self, grade_id: str) ->Grade:
        '''
        Get a grade object
        '''
        return get_object_or_404(Grade, id=grade_id)
    
    def update_grade(self, user: User, grade_data: dict, grade_id: str) -> dict:
        '''
        Update a grade in a school
        '''
        if not self.school_service.check_user_has_school(user):
            raise ValidationError('User has no school')
        grade = self.get_grade_object(grade_id)
        serializer = GradeSerializer(grade, data=grade_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer.data