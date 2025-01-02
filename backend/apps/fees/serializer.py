from config.base_serializer import BaseSerializer
from .models import Fee
from rest_framework import serializers


class FeeSerializer(BaseSerializer):
    ''' 
    FeeSerializer is a class that serial fee model
    '''
    grade_name = serializers.CharField(source='grade.name')
    class Meta:
        model = Fee
        fields = '__all__'