from django.db.models.signals import pre_save, post_migrate
from django.dispatch import receiver
from django.utils.timezone import now
from .models import Term, School
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Group
from ..user.models import User


@receiver(pre_save, sender=Term)
def update_is_current(sender, instance, **kwargs):
    """
    Signal to update the `is_current` field before saving a Term instance.
    """
    today = now().date()
    instance.is_current = instance.start_date <= today <= instance.end_date


@receiver(post_migrate)
def create_permissions(sender, **kwargs):
    """
    Signal to create permissions for the School and Term models after migrations.
    """
    permission_groups = {
        "admin": ["can_view_school", "can_change_school", "can_delete_school", 
                    "can_view_term", "can_change_term", "can_delete_term"],
        "teacher": ["can_view_school", "can_view_term"],
        "parent": ["can_view_school", "can_view_term"],
    }

    school_content_type = ContentType.objects.get_for_model(School)
    term_content_type = ContentType.objects.get_for_model(Term)

    groups = [role.value for role in User.SchoolRoles]
    for group_name in groups:
        group, created = Group.objects.get_or_create(name=group_name)

        for permission_name in permission_groups[group_name]:
            model = School if "school" in permission_name else Term
            content_type = school_content_type if model == School else term_content_type

            permission, created = Permission.objects.get_or_create(
                codename=permission_name,
                name=f"{permission_name.replace('_', ' ')}",
                content_type=content_type,
            )
            if created:
                group.permissions.add(permission)
                print(f"Permission '{permission_name}' created.")
