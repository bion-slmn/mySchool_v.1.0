from config.base_serializer import BaseSerializer
from rest_framework import serializers
from .models import Student, Gender
from rest_framework.validators import UniqueTogetherValidator



class StudentSerializer(BaseSerializer):
    '''
    StudentSerializer is a class that serializes the Student model.
    '''
    updated_at = None 
    gender = serializers.CharField()
    grade_name = serializers.CharField(source='grade.name', read_only=True)  # Fetch the grade's name directly

    class Meta:
        model = Student
        exclude = ['school']
        extra_fields = ['grade_name']


    def validate_gender(self, value):
        '''
        Validate gender
        '''
        if value in dict(Gender.choices):
            return value
        raise serializers.ValidationError(f'{value} is not Gender')
