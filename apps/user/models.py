from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class User(AbstractUser):

    class SchoolRoles(models.TextChoices):
        ADMIN ='admin', 'school admin'
        TEACHER = 'teacher', 'school teacher'

    id = models.UUIDField(default=uuid.uuid4,
                          editable=False, primary_key=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=SchoolRoles.choices, default=SchoolRoles.TEACHER)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    username = None

    def __str__(self) -> str:
        return self.email

