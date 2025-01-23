from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Group
from .models import Student
from ..user.models import User



@receiver(post_migrate)
def create_permissions(sender, **kwargs):
    """
    Signal to create permissions for the student models after migrations.
    """
    permission_groups = {
        "admin": ["can_view_student", "can_create_student", "can_delete_student", 
                    "can_update_student"],
        "teacher": ["can_view_student", ],
        "parent": ["can_view_student",],
    }

    content_type = ContentType.objects.get_for_model(Student)

    groups = [role.value for role in User.studentRoles]
    for group_name in groups:
        group, created = Group.objects.get_or_create(name=group_name)

        for permission_name in permission_groups[group_name]:

            permission, created = Permission.objects.get_or_create(
                codename=permission_name,
                name=f"{permission_name.replace('_', ' ')}",
                content_type=content_type,
            )
            if created:
                group.permissions.add(permission)
                print(f"Permission '{permission_name}' created.")
