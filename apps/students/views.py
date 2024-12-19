from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Student
from django.http import HttpRequest
from .utils import StudentService
from .serializer import StudentSerializer



class StudentView(APIView):
    def __init__(self, student_service=None):
        self.student_service = student_service or StudentService()

    def get(self, request: HttpRequest, student_id: str) ->Response:
        '''
        Get all students in the school
        ''' 
        students = self.student_service.get_student(student_id)
        students = StudentSerializer(students).data
        return Response(students)

    def post(self, request: HttpRequest) ->Response:
        '''
        Create a students
        '''
        user = request.user
        student_data = request.data
        student = self.student_service.create_student(student_data, user)
        student_info = StudentSerializer(student).data
        # add add mission fee if the studnt is created
        return Response(student_info, status=status.HTTP_201_CREATED)
    
    def put(self, request: HttpRequest, student_id: str) ->Response:
        
        student_data = request.data
        print(student_data, 4444444)
        student_info = self.student_service.update_student(student_data, student_id)
        return Response(student_info, status=status.HTTP_200_OK)
    

    def delete(self, request: HttpRequest, student_id: str) ->Response:
        '''
        Delete a student from the school
        '''
        self.student_service.delete_student(student_id)
        return Response('Deleted Successfully', status=status.HTTP_200_OK)


class AllStudentView(APIView):
    def __init__(self, student_service=None):
        self.student_service = student_service or StudentService()

    def get(self, request: HttpRequest) ->Response:
        '''
        Get all students in the school
        ''' 
        students = self.student_service.get_school_students(request.user)
        students = StudentSerializer(students, many=True).data
        return Response(students)
    

class StudentInGradeView(APIView):
    def __init__(self, student_service=None):
        self.student_service = student_service or StudentService()

    def get(self, request: HttpRequest, grade_id:str) ->Response:
        '''
        Get all students in the grade
        ''' 
        students = self.student_service.student_in_grade(grade_id)
        return Response(students, status=status.HTTP_200_OK)