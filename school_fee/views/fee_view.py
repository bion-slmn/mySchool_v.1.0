from django.shortcuts import get_object_or_404
from ..models.fee_model import Fee, FeeType
from ..models.grade_model import Grade
from ..models.term_model import Term
from ..models.student_model import Student
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from ..serializers import FeeSerializer
from rest_framework import status
from rest_framework.permissions import AllowAny
from typing import List, Dict, Any
from collections import defaultdict
from django.db.models import Count, Prefetch
from django.db.models import Q
from django.utils import timezone
from django.db import transaction
from ..decorator import handle_exceptions



def group_by_key(source: List[Dict[str, Any]],
                 group_by: str) -> Dict[str, List[Dict[str, Any]]]:
    """
    Groups a list of dictionaries by a specified key.

    Args:
        source (List[Dict[str, Any]]): A list of dictionaries to be grouped.
        group_by (str): The key by which to group the dictionaries.

    Returns:
        Dict[str, List[Dict[str, Any]]]: A dictionary where each key is a value from the specified key,
                                         and each value is a list of dictionaries that have that key value.
    """

    if not source:
        return {}

    result = defaultdict(list)

    for item in source:
        key_value = item.get(group_by, 'Unknown')
        result[key_value].append(item)

    return dict(result)


class FeeView(APIView):
    permission_classes = [AllowAny]
    def get(self, request: HttpRequest, fee_id) -> Response:
        """
        Retrieves a specific fee object and returns its serialized data.
        Args:
            request (HttpRequest): The HTTP request object.
            fee_id (int): The ID of the fee to retrieve.

        Returns:
            Response: A response containing the serialized fee data.

        Raises:
            Http404: If the fee with the specified ID does not exist.
        """

        fee = get_object_or_404(Fee, id=fee_id)
        serializer = FeeSerializer(fee)
        return Response(serializer.data)

    def post(self, request: HttpRequest) -> Response:
        """
        Creates a new fee associated with a and assigns it to all students in that grade.

        Returns:
            Response: A response containing the serialized fee data if
            the creation is successful, or error details if validation fails.

        Raises:
            Http404: If the grade with the specified ID does not exist.
        """      
        
        fee_data = request.data.copy()
        fee_data.pop('grade_ids', None)
        term = fee_data.pop('term')
        
        if not fee_data:
            raise ValueError({"detail": "Fee details must be provided."})
        
        serializer = FeeSerializer(data=fee_data, partial=True)
        serializer.is_valid(raise_exception=True)

        if fee_data.get("fee_type") == "ADMISSION":
            serializer.save()
            return Response(serializer.data, 201)
        
        grades = self.validate_grade_id(request)
        term = get_object_or_404(Term, id=term)
        fees_to_create = [
            Fee(**{**fee_data, "grade": grade, "term": term}) for grade in grades]
        results = self.create_fee(fees_to_create)
        return Response(results, status=status.HTTP_201_CREATED)
    
    def validate_grade_id(self, request) -> List[Grade]:
        """
        Validates the provided grade IDs and returns the corresponding Grade objects.

        Returns:
            List[Grade]: A list of Grade objects corresponding to the provided grade IDs.

        Raises:
            Http404: If any of the provided grade IDs are invalid.
        """

        grade_ids = request.data.get('grade_ids', [])
        if not grade_ids or not isinstance(grade_ids, list):
            raise ValueError({"detail": "Grade IDs must be provided as a list."})

        grades = Grade.objects.filter(id__in=grade_ids).prefetch_related('students')

        if len(grades) != len(grade_ids):
            raise ValueError({"detail": "Some grade IDs are invalid."})
        return grades
    

    def create_fee(self, fees_list):
        with transaction.atomic():
            # Create all fees in a single query.
            created_fees = Fee.bulk_create_with_names(fees_list)
            for fee in created_fees:
                grade = fee.grade
                fee.students.add(*grade.students.all())

        return FeeSerializer(created_fees, many=True).data



class FeePercentageCollected(APIView):
    permission_classes = [AllowAny]
    def get(self, request: HttpRequest) -> Response:
        """
        Get the percentage of fees collected per grade, optimized for performance.
        """
        today = timezone.now().date()
        term_id = request.query_params.get('term_id')
        fee_type = request.query_params.get('fee_type', "TERM")
        date = request.query_params.get('date', today)
        
        if fee_type not in FeeType.values:
            raise ValueError(f"Invalid fee_type: {fee_type}")

        # Get filtered queryset for fees
        fees_queryset = self.get_queryset(term_id, fee_type)

        result = self.get_results(term_id, fee_type, fees_queryset, date)

        return Response(result, status=status.HTTP_200_OK)

    
    def get_queryset(self, term_id: int, fee_type: str) -> List[Grade]:
        return (
            Fee.objects.filter(fee_type=fee_type)
            if fee_type == "ADMISSION"
            else Fee.objects.filter(Q(fee_type=fee_type) & Q(term=term_id))
        )
    
    def get_results(self, term_id: int, fee_type: str, query_set, date):
        
        if not query_set:
            return {}

        if fee_type == "ADMISSION":
            results = query_set.values( 
                'id', 'name', 'total_amount', 'total_paid',
            )
            return group_by_key(results, 'name') if results else {}
        grade_filter = Q(fees__term=term_id) & Q(fees__fee_type=fee_type)

        # Apply date filter if fee_type is DAILY
        if fee_type == "DAILY":
            grade_filter &= Q(fees__created_at__date=date)

        # Get the annotated grades with prefetched fees
        results = (
            Grade.objects.filter(grade_filter)
            .prefetch_related(Prefetch('fees', queryset=query_set))
            .annotate(total_students=Count('students'))
            .values(
                'id', 'name', 'total_students',
                'fees__id', 'fees__total_amount',
                'fees__name', 'fees__total_paid',
            )
        )

        return group_by_key(results, 'name') if results else {}
            
        

    
    



class GradeFeeView(APIView):
    permission_classes = [AllowAny]
    def get(self, request: HttpRequest, grade_id) -> Response:
        """
        Handles GET requests to retrieve fee information for a specific grade.

        Args:
            request (HttpRequest): The HTTP request object.
            grade_id (int): The ID of the grade for which to retrieve fee information.

        Returns:
            Response: A Response object containing the fee details for the specified grade.
        """ 
        results = []
        admission_fee = Fee.objects.filter(fee_type='ADMISSION').values('id', 'name', 'total_amount')

        if admission_status := request.query_params.get('admission_status'):
            results = [*admission_fee]
        else:
            grade = get_object_or_404(Grade, id=grade_id)
            fee = grade.fees.all().values('id', 'name', 'total_amount')
            results = [*fee, *admission_fee]
        return Response(results, 200)


class DailyFeeView(APIView):
    permission_classes = [AllowAny]
    def get(self, request: HttpRequest, grade_id) -> Response:
        """
        Handles GET requests to retrieve daily fee information for a specific grade.

        Args:
            request (HttpRequest): The HTTP request object.
            grade_id (int): The ID of the grade for which to retrieve daily fee information.

        Returns:
            Response: A Response object containing the daily fee details for the specified grade.
        """
        grade = get_object_or_404(Grade, id=grade_id)
        if date := request.query_params.get('created_at'):
            daily_fee = Fee.objects.filter(grade=grade_id, fee_type='DAILY', created_at__contains=date)
        else:
            daily_fee = Fee.objects.filter(grade=grade, fee_type='DAILY')
        daily_fee = daily_fee.values('id', 'name', 'total_amount', 'created_at')
        return Response(daily_fee, 200)

    


class FeePerTerm(APIView):
    permission_classes = [AllowAny]
    def get(self, request: HttpRequest, term_id) -> Response:
        term  = get_object_or_404(Term.objects.prefetch_related('fees'), id=term_id)
        fees = term.fees.all().values('id', 'name', 'total_amount','fee_type', 'is_active')
        return Response(fees, 200)