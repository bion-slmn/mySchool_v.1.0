from rest_framework import serializers


class BaseSerializer(serializers.ModelSerializer):
    """
    BaseSerializer is a base class for serializers that provides common fields for model serialization.

    Attributes:
        id (CharField): A read-only field representing identifier of the model.
        created_at (DateTimeField): A read-only field representing the creation

    """
    id = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)