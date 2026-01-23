# patients/serializers.py

from rest_framework import serializers
from .models import Patient, TreatmentPlan
from accounts.serializers import PsychologistSerializer


class PatientSerializer(serializers.ModelSerializer):
    """
    Serializer για τους ασθενείς.
    """

    psychologist = PsychologistSerializer(read_only=True)

    class Meta:
        model = Patient
        fields = [
            "id",
            "psychologist",
            "first_name",
            "last_name",
            "mental_disorder",
            "birth_date",
            "phone_number",
            "email",
            "emergency_contact_name",
            "emergency_contact_phone",
            "status",
            "first_session_date",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class TreatmentPlanSerializer(serializers.ModelSerializer):
    """
    Πλάνο θεραπείας για έναν ασθενή.
    """

    patient = PatientSerializer(read_only=True)
    psychologist = PsychologistSerializer(read_only=True)

    class Meta:
        model = TreatmentPlan
        fields = [
            "id",
            "patient",
            "psychologist",
            "created_at",
            "updated_at",
            "summary",
            "goals",
            "next_steps",
            "is_active",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
