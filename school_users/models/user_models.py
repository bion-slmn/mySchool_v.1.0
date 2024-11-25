from django.db import models
from django.contrib.auth.models import AbstractUser
from .base_model import BaseModel

# Create your models here.

class SchoolRoles(models.TextChoices):
        '''
        Class to define the roles of users in the school
        '''
        ADMIN ='admin', 'school admin'
        TEACHER = 'teacher', 'school teacher'

class User(AbstractUser, BaseModel):
    '''
    Class to define the user model
    '''
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=SchoolRoles.choices, default=SchoolRoles.TEACHER)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    username = None

    def __str__(self) -> str:
        return self.email