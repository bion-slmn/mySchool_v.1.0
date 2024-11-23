from django.db import models
from .base_model import BaseModel
from .term_model import Term
from django.utils import timezone
from rest_framework.exceptions import ValidationError

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
        'Student', 
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
        'Grade',
        on_delete=models.SET_NULL,
        related_name='fees',
        null=True,
        blank=True,
        help_text="Grade this fee structure applies to."
    )

    def update_is_active(self):
        if self.term:
            today = timezone.now().date()
            self.is_active = self.term.end_date >= today >= self.term.start_date
            self.save()

    def set_name(self):
        year = timezone.now().year
        today = timezone.now().date()
        if self.fee_type == "ADMISSION":
            self.name = f'{self.fee_type}-{year}-{self.total_amount} Fee'
        elif self.fee_type == "DAILY":
            self.name = f'{self.name} {self.grade.name} - {self.term.name} {today} Fee'
        else:            
            self.name = f'{self.grade.name} - {self.term.name} - {self.fee_type} Fee'
            
    def save(self, *args, **kwargs):
        self.set_name()

        if self.term is None and self.fee_type != "ADMISSION":
            raise ValidationError('A term is required for fee types other than ADMISSION.')

        super().save(*args, **kwargs)

    @classmethod
    def bulk_create_with_names(cls, fees):
        for fee in fees:
            fee.set_name()
        return cls.objects.bulk_create(fees)


    def __str__(self) -> str:
        return f'{self.name}'
    