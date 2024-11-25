from django.db import models
import uuid


class BaseModel(models.Model):
    """
    BaseModel is an abstract base class that provides common fields for other models.
    Attributes:
        id (UUIDField): A unique identifier for the model instance.
        created_at (DateTimeField): The timestamp when the instance was created.
        updated_at (DateTimeField): The timestamp when the instance was last updated.

    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        '''
        Table wont be created in th database
        '''
        abstract = True

class BaseModelWithOutUpdatedTime(models.Model):
    """
    BaseModel is an abstract base class that provides common fields for other models.
    Attributes:
        id (UUIDField): A unique identifier for the model instance.
        created_at (DateTimeField): The timestamp when the instance was created.
        updated_at (DateTimeField): The timestamp when the instance was last updated.

    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        '''
        Table wont be created in th database
        '''
        abstract = True