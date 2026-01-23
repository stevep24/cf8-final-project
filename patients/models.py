from django.db import models
from django.core.validators import RegexValidator
from django.db.models import UniqueConstraint,Index



phone_regex = RegexValidator(
    regex=r'^\+?\d{8,15}$',
    message="Το τηλέφωνο πρέπει να περιέχει 8–15 ψηφία και μπορεί να ξεκινά με +."
)

class Patient(models.Model):
    psychologist = models.ForeignKey(
        'accounts.Psychologist',
        on_delete=models.PROTECT,
        related_name='patients')
    first_name=models.CharField(max_length=20)
    last_name=models.CharField(max_length=35,db_index=True)
    mental_disorder=models.CharField(max_length=25, blank=True, null=True)
    birth_date=models.DateField(blank=True, null=True)
    phone_number=models.CharField(max_length=15,  validators=[phone_regex], db_index=True)
    email=models.EmailField(db_index=True)
    emergency_contact_name=models.CharField(max_length=50)
    emergency_contact_phone=models.CharField(max_length=15, validators=[phone_regex])
    status_choices= [("ACTIVE","Ενεργός"),("INACTIVE","Aνενεργός")]
    status=models.CharField(max_length=10,choices=status_choices, default="ACTIVE",db_index=True)
    first_session_date=models.DateField(blank=True, null=True)
    notes=models.TextField(blank=True, null=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    class Meta:
        constraints = [
            UniqueConstraint(fields=["psychologist", "email"], name="uq_patient_email_per_psych"),
            UniqueConstraint(fields=["psychologist", "phone_number"], name="uq_patient_phone_per_psych"),
        ]
        ordering=[
            "last_name","first_name"
        ]
        indexes = [
            Index(fields=["psychologist", "status", "last_name"]),
        ]

    def __str__(self):
        return f'{self.first_name } {self.last_name}'



class TreatmentPlan(models.Model):
    patient=models.ForeignKey(
        'patients.Patient',
        on_delete=models.PROTECT,
        related_name='treatment_plans'
    )
    psychologist=models.ForeignKey(
        "accounts.Psychologist",
        on_delete=models.PROTECT,
        related_name='treatment_plans'
    )
    created_at=models.DateTimeField(blank=True, null=True)
    updated_at=models.DateTimeField(blank=True, null=True)
    summary=models.TextField(blank=True, null=True )
    goals=models.CharField(max_length=35, blank=True, null=True)
    next_steps=models.CharField(max_length=100,blank=True, null=True)
    is_active=models.BooleanField(default=False)
    class Meta:
        ordering = ['patient','-is_active', '-created_at']

    def __str__(self):
        created = self.created_at.strftime("%d/%m/%Y") if self.created_at else "N/A"
        return f"Plan for {self.patient} ({created})"
