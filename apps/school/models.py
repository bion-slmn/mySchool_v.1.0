from django.db import models
import uuid


class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


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
    