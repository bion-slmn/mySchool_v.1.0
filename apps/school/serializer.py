from rest_framework import serializers
from .models import School, Term
from config.base_serializer import BaseSerializer


class SchoolSerializer(BaseSerializer):
    '''
    SchoolSerializer is a class that serializes the School model.
    '''
    class Meta:
        model = School
        fields = '__all__'


class TermSerializer(BaseSerializer):
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
