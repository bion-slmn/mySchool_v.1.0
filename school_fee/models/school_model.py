from .base_model import BaseModel
from django.db import models
from school_users.models import User

class School(BaseModel):
    """
    School represents an educational institution within the system.

    Attributes:
        name (CharField): The unique name of the school, limited to 100 characters.
        address (TextField): The physical address of the school.
        owner (ForeignKey): A reference to the User model,
    """
    name =  models.CharField(max_length=100, unique=True)
    address = models.TextField()
    owner = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='schools'
    )