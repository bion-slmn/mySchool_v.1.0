from django.db import models
from config.baseModel import BaseModel
from apps.school.models import School
from apps.classes.models import Grade


class Gender(models.TextChoices):
        MALE = 'male'
        FEMALE = 'female'

# Create your models here.
class Student(BaseModel):
    """
    Student represents a student entity in the system,
                inheriting common fields from BaseModel.
    Attributes:
        name (CharField): The name of the student, limited to 200 characters.
        date_of_birth (DateField): The birth date of the student.
        gender (CharField): The gender of the student,
                            which can be either 'male' or 'female'.
        grade (ForeignKey): A reference to the Grade model,
                            allowing for a relationship with the student's grade
    """
    name = models.CharField(max_length=200)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=7,
                              choices=Gender.choices)
    grade = models.ForeignKey(
        Grade,
        on_delete=models.SET_NULL,
        related_name='students',
        null=True)
    school = models.ForeignKey(
        School, on_delete=models.CASCADE,
        related_name='students'
    )

  
    class Meta:
        unique_together = ('name', 'date_of_birth') 