from .models import Grade
from config.base_serializer import BaseSerializer
from rest_framework import serializers

class GradeSerializer(BaseSerializer):
    '''
    GradeSerializer is a class that serial
    '''
    total_students = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Grade
        fields = '__all__'

    def get_total_students(self, obj):
        '''
        Get total students in a grade
        '''
        return obj.students.count()