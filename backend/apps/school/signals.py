from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils.timezone import now
from .models import Term


@receiver(pre_save, sender=Term)
def update_is_current(sender, instance, **kwargs):
    """
    Signal to update the `is_current` field before saving a Term instance.
    """
    today = now().date()
    instance.is_current = instance.start_date <= today <= instance.end_date
