from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from datetime import timedelta
from django.utils import timezone
# Create your models here.


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
        

        
    

class  PasswordReset(models.Model):
    """
    Model to store password reset tokens and associated emails.
    """
    email = models.EmailField()
    token = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Password reset for {self.email} created at {self.created_at}"

    def is_expired(self):
        """
        Check if the password reset token is expired.

        The token is considered expired if the current time exceeds the token's
        expiration time, which is set to 1 hour after the token's creation.

        Returns:
            bool: True if the token is expired, False otherwise.
        """
        expiration_time = self.created_at + timedelta(hours=1)
        return timezone.now() > expiration_time