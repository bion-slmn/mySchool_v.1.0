from ..serializer import TermSerializer
from rest_framework.views import APIView
from django.http import HttpRequest
from rest_framework.response import Response
from ..utils import TermService
from rest_framework import status
from django.http import HttpRequest


class TermView(APIView):

    def __init__(self, termservice=TermService):
        self.term_service = termservice()
    def get(self, request:HttpRequest) -> Response:
        '''
        Get all terms in a school
        '''
        user = request.user
        terms = self.term_service.get_school_terms(user)
        term_data = TermSerializer(terms, many=True)
        return Response(term_data.data, status=status.HTTP_200_OK)
    

    def post(self, request:HttpRequest) -> Response:
        '''
        Create a term for a schools
        '''
        user = request.user
        school_data = request.data
        term_data = self.term_service.create_school_term(user, school_data)
        return Response(term_data, status=status.HTTP_201_CREATED)
    
    def put(self, request:HttpRequest, term_id: str) -> Response:
        '''
        Update a term
        '''
        user = request.user
        school_data = request.data
        updated_school = self.term_service.update_term(user, school_data, term_id)
        return Response(updated_school, status=status.HTTP_200_OK)
