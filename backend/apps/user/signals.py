from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group
from .models import User

@receiver(post_migrate)
def create_user_groups(sender, **kwargs):
    groups = [role.value for role in User.SchoolRoles]  # Dynamically get roles
    for group_name in groups:
        group, created = Group.objects.get_or_create(name=group_name)
        if created:
            print(f"Group '{group_name}' created.")
