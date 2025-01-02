from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from rest_framework import status
from .serializer import GradeSerializer
from .utils import GradeService


class GradeVIew(APIView):
    def __init__(self, gradeserivice=None):
        self.grade_service = gradeserivice or GradeService()

    def get(self, request:HttpRequest) -> Response:
        '''
        Get all grades in a school
        '''
        user = request.user
        grades = self.grade_service.get_all_school_grade(user)
        grade_data = GradeSerializer(grades, many=True)
        return Response(grade_data.data, status=status.HTTP_200_OK)
    

    def post(self, request:HttpRequest) -> Response:
        '''
        Create a new grade in a school
        '''
        user = request.user
        grade_data = request.data
        grade = self.grade_service.create_grade(user, grade_data)
        return Response(grade, status=status.HTTP_201_CREATED)
    
    def put(self, request:HttpRequest, grade_id: str) -> Response:
        '''
        Update a grade in a school
        '''
        user = request.user
        grade_data = request.data
        grade = self.grade_service.update_grade(user, grade_data, grade_id)
        return Response(grade, status=status.HTTP_200_OK)

    def delete(self, request: HttpRequest ,grade_id: str) ->Response:
        '''
        Remove a grade
        '''
        self.grade_service.delete_class(grade_id)
        return Response('Delete Sucessfully', status=status.HTTP_200_OK)