from django.dispatch import receiver
from .models.fee_model import Fee
from .models.student_model import Student
from .models.payment_model import Payment
from django.db.models.signals import post_save, pre_save
from django.db.models import F
from django.utils import timezone



@receiver(post_save, sender=Payment)
def add_fee_paid(sender, instance, created, **kwargs):
    """
    Handles the post-save signal for Payment instances to update the total amount paid for a fee.

    Args:
        sender (type): The model class that sent the signal.
        instance (Payment): The instance of the Payment that was created.
        created (bool): A boolean indicating whether a new instance was created.
        **kwargs: Additional keyword arguments.

    Returns:
        None
    """
    if created:
        fee = Fee.objects.filter(id=instance.fee.id)
        fee.update(total_paid=F('total_paid') + instance.amount)


def grade_changed(instance) -> bool:
    """
    Determines whether the grade of a student instance has
    changed since it was last saved. 

    Args:
        instance: The instance of the Student model being checked.

    Returns:
        bool: True if the grade has changed, False otherwise.
    """

    student = Student.objects.get(id=instance.pk)
    return student.grade != instance.grade


@receiver(post_save, sender=Student)
def add_associated_fee(sender, instance, created, **kwargs):
    """
    Automatically adds associated fees to a student instance before it is saved. 
    This function checks if the student is being added , 
    and adds relevant fees based on the current date.

    Args:
        sender: The model class that sent the signal.
        instance: The instance of the Student model being saved.
        **kwargs: Additional keyword arguments.

    Returns:
        None: This function does not return a value, but modifies the instance's fees.
    """
    if created:
        grade = instance.grade
        relevant_fees = grade.fees.filter(is_active=True)
        instance.fees.add(*relevant_fees)