from .base_model import BaseModel
from django.db import models
from .school_model import School

class Grade(BaseModel):
    """
    Grade represents an academic grade in the system,

    Attributes:
        name (CharField): The unique name of the grade, limited to 100 characters.
        description (TextField): An optional description of the grade,
                                which can be left blank or set to null.

    Methods:
        __str__(): Returns the name of the grade as its string representation.
    """

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    school = models.ForeignKey(
        School, on_delete=models.CASCADE,
        related_name='grade'
    )

    def __str__(self):
        return self.name