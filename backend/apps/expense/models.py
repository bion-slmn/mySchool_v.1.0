from config.baseModel import BaseModel
from ..school.models import Term
from django.db import models


# Create your models here.
class Expense(BaseModel):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=250, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2) 
    term = models.ForeignKey(Term, on_delete=models.CASCADE, related_name='expense')

