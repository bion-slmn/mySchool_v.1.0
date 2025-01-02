from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import F
from .models import Payment
from apps.fees.models import Fee


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