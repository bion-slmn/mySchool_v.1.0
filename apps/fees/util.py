from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import Fee, FeeType
from apps.classes.models import Grade
from .serializer import FeeSerializer
from apps.school.utils import SchoolService
from apps.school.models import Term
from django.shortcuts import get_object_or_404
from typing import List
from apps.students.utils import StudentFeeService

class FeeModelService:
    @staticmethod
    def validate_term(fee):
        """
        Validate that a term is present for non-admission fees.
        """
        if fee.term is None and fee.fee_type != FeeType.ADMISSION:
            raise ValidationError('A term is required for fee types other than ADMISSION.')

    @staticmethod
    def generate_name(fee):
        """
        Generate a dynamic name for the fee based on its type and associated data.
        """
        year = timezone.now().year
        today = timezone.now().date()

        if fee.fee_type == FeeType.ADMISSION:
            return f'{fee.fee_type}-{year}-{fee.total_amount} Fee'
        elif fee.fee_type == FeeType.DAILY:
            return f'{fee.name} {fee.grade.name} - {fee.term.name} {today} Fee'
        else:
            return f'{fee.grade.name} - {fee.term.name} - {fee.fee_type} Fee'

    @staticmethod
    def update_is_active(fee):
        """
        Update the is_active field based on the current date and term.
        """
        if fee.term:
            today = timezone.now().date()
            fee.is_active = fee.term.end_date >= today >= fee.term.start_date


class ValidateFeeData:
    def __init__(self, school_service=None):
        self.school_service = school_service or SchoolService()

    def validate_term_id(self, term_id):
        return get_object_or_404(Term, id=term_id)

    def validate_grade_ids(self, grade_ids: list) -> list:
        if not grade_ids or not isinstance(grade_ids, list):
            raise ValidationError("Grade IDs must be provided as a list.")
        
        print(grade_ids, 22222233333333333333)
        grades = Grade.objects.filter(id__in=grade_ids).prefetch_related('students')
        if len(grades) != len(grade_ids):
            raise ValidationError("Some grade IDs are invalid.")
        return grades

    def validate_fee_data(self, fee_data):
        
        serializer = FeeSerializer(data=fee_data, partial=True)
        serializer.is_valid(raise_exception=True)
        return serializer
    
    def validate_grade(self, grade_id):
        return get_object_or_404(Grade, id=grade_id)


class FeeCreationService:
    def __init__(self, validator=None, student_fee_service=None):
        self.validator = validator or ValidateFeeData()
        self.student_fee_service = student_fee_service or StudentFeeService()

    def extract_fee_data(self, request):
        fee_data = request.data.copy()
        
        if not fee_data:
            raise ValidationError("Fee details must be provided.")
        
        print(fee_data, 4444444444444)
        grade_ids = fee_data.pop('grade_ids', None)
        term_id = fee_data.pop('term', None)
        return fee_data, term_id, grade_ids

    def create_admission_fee(self, fee_data):
        serializer = self.validator.validate_fee_data(fee_data)
        serializer.save()
        return serializer.data

    def create_non_admission_fees(self, fee_data, term_id, grade_ids):
        self.validator.validate_fee_data(fee_data)
        term = self.validator.validate_term_id(term_id)
        grades = self.validator.validate_grade_ids(grade_ids)
        fees = self._bulk_create_fees(fee_data, grades, term)
        self.student_fee_service.add_fees_to_students(fees)
        return FeeSerializer(fees, many=True).data

    @staticmethod
    def _bulk_create_fees(fee_data: dict, grades: List[Grade], term: Term):
        fees_to_create = [Fee(**{**fee_data, "grade": grade, "term": term}) for grade in grades]
        return FeeService.bulk_create_with_names(Fee, fees_to_create)

    def create_fees(self, request):
        fee_data, term_id, grade_ids = self.extract_fee_data(request)
        
        print(grade_ids, 22222222222)
        if fee_data.get("fee_type") == "ADMISSION":
            return self.create_admission_fee(fee_data)
        return self.create_non_admission_fees(fee_data, term_id, grade_ids)


class FeeService:
    def __init__(self, school_service=None, fee_creator=None, validator=None):
        self.school_service = school_service or SchoolService()
        self.fee_creator = fee_creator or FeeCreationService()
        self.validator = validator or ValidateFeeData()

    def get_fee_object(self, fee_id):
        return get_object_or_404(Fee, id=fee_id)

    def get_fee_data(self, fee_id):
        fee = self.get_fee_object(fee_id)
        return FeeSerializer(fee).data
    
    def get_fees_by_term(self, term_id):
        term = self.validator.validate_term_id(term_id)
        return term.fees.all()
    
    def get_fees_by_grade(self, grade_id):
        grade = self.validator.validate_grade(grade_id)
        return grade.fees.all()

    def create_fees(self, request):
        if not self.school_service.check_user_has_school(request.user):
            raise ValidationError("User must have a school.")
        return self.fee_creator.create_fees(request)

    @staticmethod
    def bulk_create_with_names(fee_obj, fee_to_create):
        for fee in fee_to_create:
            fee.name = FeeModelService.generate_name(fee)
        return fee_obj.objects.bulk_create(fee_to_create)
    
    def update(self, fee_id, request):
        fee_data = request.data
        if not fee_data:
            raise ValidationError("Fee details must be provided.")

        fee_obj = self.get_fee_object(fee_id)

        serializer = FeeSerializer(fee_obj, data=fee_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer.data

    def delete_fee(self, fee_id):
        fee_obj = self.get_fee_object(fee_id)
        fee_obj.delete()
