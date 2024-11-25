from django.db import models
from datetime import timedelta
from django.utils import timezone
from .base_model import BaseModelWithOutUpdatedTime


class  PasswordReset(BaseModelWithOutUpdatedTime):
    """
    Model to store password reset tokens and associated emails.
    """
    email = models.EmailField()
    token = models.CharField(max_length=100)
   

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