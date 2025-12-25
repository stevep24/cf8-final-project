from rest_framework import serializers
from .models import Appointment
from patients.serializers import PatientSerializer
from accounts.serializers import PsychologistSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    """
    Serializer για τα ραντεβού.
    Εμφανίζει πλήρη στοιχεία ασθενή & ψυχολόγου (nested),
    αλλά δεν τα αλλάζουμε από εδώ.
    """

    patient = PatientSerializer(read_only=True)
    psychologist = PsychologistSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient",
            "psychologist",
            "session_datetime",
            "duration_minutes",
            "status",
            "session_type",
            "price",
            "notes_from_therapist",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
