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
        read_only_fields = ["id", "created_at", "updated_at", "patient", "psychologist"]

class AppointmentWriteSerializer(serializers.ModelSerializer):
    """
    Write serializer (DTO) για create/update.
    Δεν δέχεται patient/psychologist από frontend.
    """
    class Meta:
        model = Appointment
        fields = "__all__"
        extra_kwargs = {
            "patient": {"required": False},
            "session_datetime": {"required": False},
            "duration_minutes": {"required": False},
            "session_type": {"required": False},
            "price": {"required": False},
        }