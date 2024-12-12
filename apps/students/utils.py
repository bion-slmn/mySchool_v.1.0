from .models import Student
from  apps.school.utils import SchoolService
from rest_framework.exceptions import ValidationError
from typing import List
from apps.user.models import User
from .serializer import StudentSerializer
from django.shortcuts import get_object_or_404


class StudentService:
    def __init__(self, school_service=None):
        self.school_service = school_service or SchoolService()

    def get_school_students(self, user: int) -> List[Student]:
        if not self.school_service.check_user_has_school(user):
            raise ValidationError('User does not have a school')
        return user.school.students.all()

    def get_student(self, student_id: int) -> Student:
        '''
        Get students from the id prodived
        '''
        return get_object_or_404(Student, id=student_id)

    def create_student(self, student_info: dict, user: User) -> Student:
        '''
        Create a student
        '''
        if not self.school_service.check_user_has_school(user):
            raise ValidationError('User does not have a school')
        school = user.school
        serializer = StudentSerializer(data=student_info, partial=True)
        serializer.is_valid(raise_exception=True)
        return serializer.save(school=school)

    def update_student(self, student_data: dict, student_id) -> dict:
        '''
        Update a studnet info
        '''
        student = self.get_student(student_id)
        serializer = StudentSerializer(student, data=student_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer.data


    def delete_student(self, student_id: int) -> None:
        '''
        delete a student
        '''
        student = self.get_student(student_id)
        student.delete()
