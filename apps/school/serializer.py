from rest_framework import serializers
from .models import School, Term


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


class SchoolSerializer(BaseSerializer):
    '''
    SchoolSerializer is a class that serializes the School model.
    '''
    class Meta:
        model = School
        fields = '__all__'


class TermSerializer(serializers.ModelSerializer):
    '''
    TermSerializer is a class that serializes the Term model
    '''

    class Meta:
        model = Term
        exclude = ['school']

    def validate(self, data):
        """
        Validate that the end date is not earlier than the start date.
        """
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError('End date must be greater than start date')

        return data
