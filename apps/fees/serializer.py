from config.base_serializer import BaseSerializer
from .models import Fee


class FeeSerializer(BaseSerializer):
    ''' 
    FeeSerializer is a class that serial fee model
    '''
    class Meta:
        model = Fee
        fields = '__all__'