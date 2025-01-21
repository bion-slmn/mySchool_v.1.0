from django.db import models
import uuid
from apps.user.models import User
from django.utils import timezone
from config.baseModel import BaseModel

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
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='school', null=True)
    parents = models.ManyToManyField(User, related_name='parents', blank=True)
    teachers = models.ManyToManyField(User, related_name='teachers')


class Term(BaseModel):
    """
    Term represents an academic term within the system.

    Attributes:
        name (CharField): The unique name of the term, limited to 100 characters.
        start_date (DateField): The starting date of the term.
        end_date (DateField): The ending date of the term.
    """
    name = models.CharField(max_length=100, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='terms')
    is_current = models.BooleanField(default=True)

    def __str__(self):
        return self.name