from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import FeeSerializer
from .models import Fee
from .util import FeeService
from django.http import HttpRequest
from rest_framework.permissions import IsAuthenticated
from config.permissions import AdminOnlyForSensitiveActions, TeacherorAdminOnly


class FeeView(APIView):
    permission_classes = [AdminOnlyForSensitiveActions, IsAuthenticated]

    def __init__(self, fee_service: FeeService = None):
        self.fee_service = fee_service or FeeService()

    def get(self, request:HttpRequest, fee_id:str) -> Response:
        '''
        Retrieve a fee object by its ID.
        '''
        fee_data = self.fee_service.get_fee_data(fee_id)
        return Response(fee_data, status=status.HTTP_200_OK)
    
    def post(self, request:HttpRequest) -> Response:
        '''
        Create a new fee object.
        '''
        fee = self.fee_service.create_fees(request)
        return Response(fee, status=status.HTTP_201_CREATED)
    

    def put(self, request:HttpRequest, fee_id:str) -> Response:
        '''
        Update a fee object
        '''
        updated_fee = self.fee_service.update(fee_id, request)
        return Response(updated_fee, status=status.HTTP_200_OK)
    
    def delete(self, request:HttpRequest, fee_id:str) -> Response:
        '''
        Delete a fee object
        '''
        self.fee_service.delete_fee(fee_id)
        return Response('deleted', status=status.HTTP_200_OK)
    


class TermFee(APIView):

    def __init__(self, fee_service: FeeService = None):
        self.fee_service = fee_service or FeeService()

    def get(self, request: HttpRequest, term_id) -> Response:
        '''
        Retrieve all fees for a term.
        '''
        fees = self.fee_service.get_fees_by_term(term_id)
        fees_data = FeeSerializer(fees, many=True).data
        return Response(fees_data, status=status.HTTP_200_OK)
    

class GradeFee(APIView):


    def __init__(self, fee_service: FeeService = None):
        self.fee_service = fee_service or FeeService()

    def get(self, request: HttpRequest, grade_id) -> Response:
        '''
        Retrieve all fees for a grade.
        '''
        fees = self.fee_service.get_fees_by_grade(grade_id)
        fees_data = FeeSerializer(fees, many=True).data
        return Response(fees_data, status=status.HTTP_200_OK)

class FeeTypeView(APIView):
    def __init__(self, fee_service: FeeService = None):
        self.fee_service = fee_service or FeeService()

    def get(self, request: HttpRequest) -> Response:
        '''
        Retrieve all fee of a specific type and year
        if year is not provided in the request, the current year is used.
        '''
        fee_type = request.query_params.get('fee_type')
        year = request.query_params.get('year')
        fees = self.fee_service.get_fee_by_type_and_year(fee_type, year)
        return Response(fees, status=status.HTTP_200_OK)
