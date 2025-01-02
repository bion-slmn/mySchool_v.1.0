from config.baseModel import BaseModel
from apps.students.models import Student
from apps.fees.models import Fee
from django.db import models


class Payment(BaseModel):
    """    Payment represents a financial transaction made by a student for a specific fee.
    Attributes:
        student (ForeignKey): A reference to the Student model,
                            indicating which student made the payment.
        fee (ForeignKey): A reference to the Fee model,
                            indicating which fee is being paid.
        amount (DecimalField): The amount of money paid,
                                with a maximum of 10 digits and 2 decimal places.
        date_paid (DateTimeField): The timestamp when the payment was made,
                                    automatically set to the current time.
        payment_method (CharField): The method used for the payment,
                                    limited to 50 characters.
        reference_number (CharField): A unique identifier for the payment,
                                    limited to 100 characters.

    """
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='payments')
    fee = models.ForeignKey(
        Fee,
        on_delete=models.CASCADE,
        related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_paid = models.DateTimeField(auto_now=True)
    payment_method = models.CharField(max_length=50)

    class Meta:
        ordering = ['-date_paid']


