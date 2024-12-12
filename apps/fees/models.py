from django.db import models
from django.utils import timezone
from apps.school.models import Term
from config.baseModel import BaseModel
from apps.classes.models import Grade
from apps.students.models import Student


class FeeType(models.TextChoices):
    ADMISSION = 'ADMISSION', 'Admission Fee'
    TERM = 'TERM', 'Term Fee'
    ONCE = 'ONCE', 'One-time Fee'
    DAILY = 'DAILY', 'Daily Fee'

class Fee(BaseModel):
    """
    Model to represent the Fee structure for different Grades.
    """
    name = models.CharField(
        max_length=100, 
        unique=True, 
        help_text="Unique name for the fee structure (e.g., 'Term 1 Fees')."
    )
    total_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        default=0.00,
        help_text="Total fee amount for the grade."
    )
    total_paid = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0.00, 
        help_text="Amount that has been paid towards the total fee."
    )
    students = models.ManyToManyField(
        Student, 
        related_name='fees', 
        blank=True, 
        help_text="Students associated with this fee."
    )
    term = models.ForeignKey(
        Term,
        on_delete=models.SET_NULL, 
        related_name='fees', 
        null=True, 
        help_text="Term this fee structure applies to."
    )
    description = models.TextField(null=True)
    fee_type = models.CharField(
        max_length=50, 
        choices=FeeType.choices, 
        default=FeeType.TERM,
        help_text="Type of fee structure."
    )
    is_active = models.BooleanField(default=True)
    grade = models.ForeignKey(
        Grade,
        on_delete=models.SET_NULL,
        related_name='fees',
        null=True,
        blank=True,
        help_text="Grade this fee structure applies to."
    )

    def save(self, *args, **kwargs):
        from .util import FeeModelService 
        FeeModelService.validate_term(self)
        self.name = FeeModelService.generate_name(self)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f'{self.name}'
