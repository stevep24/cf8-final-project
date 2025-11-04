from django.core.validators import RegexValidator
from django.db import models
from django.contrib.auth.models import User


phone_regex = RegexValidator(
    regex=r'^\+?\d{8,15}$',
    message="Το τηλέφωνο πρέπει να περιέχει 8–15 ψηφία και μπορεί να ξεκινά με +."
)
# Create your models here.

class Psychologist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name=models.CharField(max_length=25)
    last_name=models.CharField(max_length=40)
    phone_number=models.CharField(max_length=15, validators=[phone_regex])
    specialization=models.CharField(max_length=15)
    license_number=models.CharField(max_length=10, unique=True)
    notes=models.TextField(blank=True, null=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True )



    def __str__(self):
        return f"{self.first_name} {self.last_name} με ID: {self.id}"