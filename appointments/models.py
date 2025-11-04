
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

# Create your models here.
class Appointment(models.Model):
    class Status(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Προγραμματισμένη"
        COMPLETED = "COMPLETED", "Ολοκληρώθηκε"
        CANCELED  = "CANCELED",  "Ακυρώθηκε"
        NO_SHOW   = "NO_SHOW",   "Δεν εμφανίστηκε"
    class Type(models.TextChoices):
        IN_PERSON = "IN_PERSON", "Δια ζώσης"
        ONLINE    = "ONLINE",    "Διαδικτυακά"
    patient = models.ForeignKey(
        "patients.Patient",
        on_delete=models.PROTECT,
        related_name="appointments",
    )
    psychologist = models.ForeignKey(
        "accounts.Psychologist",
        on_delete=models.PROTECT,
        related_name="appointments",
    )
    session_datetime = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(
        validators=[MinValueValidator(15), MaxValueValidator(240)],
        help_text="Διάρκεια σε λεπτά (15–240)."
    )
    status = models.CharField(
        max_length=12, choices=Status.choices, default=Status.SCHEDULED, db_index=True
    )
    session_type = models.CharField(
        max_length=10, choices=Type.choices, default=Type.IN_PERSON, db_index=True
    )
    price = models.DecimalField(
        max_digits=7, decimal_places=2,
        validators=[MinValueValidator(0)],
        null=True, blank=True
    )
    notes_from_therapist = models.TextField(blank=True, null=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-session_datetime"]
        indexes = [
            models.Index(fields=["psychologist", "session_datetime"]),
            models.Index(fields=["patient", "session_datetime"]),
            models.Index(fields=["status", "session_type"]),
        ]


    def __str__(self):
        dt = timezone.localtime(self.session_datetime).strftime("%d/%m/%Y %H:%M") \
             if self.session_datetime else "N/A"
        return f"{self.patient} – {dt} ({self.get_status_display()})"