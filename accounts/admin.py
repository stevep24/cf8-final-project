

# Register your models here.
from django.contrib import admin
from .models import Psychologist  # ή Patient / Appointment
admin.site.register(Psychologist)
