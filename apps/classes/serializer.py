from .models import Grade
from config.base_serializer import BaseSerializer

class GradeSerializer(BaseSerializer):
    '''
    GradeSerializer is a class that serial
    '''
    class Meta:
        model = Grade
        fields = '__all__'