from django.shortcuts import get_object_or_404
from .models import Appointment
from accounts.models import Psychologist
from patients.models import Patient
from django.utils import timezone


class AppointmentRepository:


    @staticmethod
    def for_psych(psych: Psychologist):

        return Appointment.objects.filter(psychologist=psych)

    @staticmethod
    def get_by_id_for_psych(psych: Psychologist, appointment_id: int):

        return get_object_or_404(
            Appointment,
            id=appointment_id,
            psychologist=psych
        )

    @staticmethod
    def for_patient(psych: Psychologist, patient: Patient):
        """
        Φέρνει όλα τα ραντεβού συγκεκριμένου ασθενή
        ΑΛΛΑ μόνο αν ο ασθενής ανήκει στον ψυχολόγο.
        """
        return Appointment.objects.filter(
            psychologist=psych,
            patient=patient
        )

    @staticmethod
    def upcoming_for_psych(psych: Psychologist):
        """
        Επιστρέφει όλα τα ΜΕΛΛΟΝΤΙΚΑ ραντεβού.
        """
        return Appointment.objects.filter(
            psychologist=psych,
            session_datetime__gte=timezone.now()
        ).order_by("session_datetime")


    @staticmethod
    def create(psych: Psychologist, patient: Patient, data: dict):
        """
        Δημιουργεί νέο ραντεβού.
        """
        return Appointment.objects.create(
            psychologist=psych,
            patient=patient,
            **data
        )


    @staticmethod
    def update(app: Appointment, data: dict):
        """
        Κάνει update σε ένα ραντεβού αλλά ΔΕΝ επιτρέπει αλλαγή των:
        - id / pk
        - patient
        - psychologist
        - created_at
        - updated_at
        """
        disallowed = {
            "id", "pk", "patient", "psychologist",
            "created_at", "updated_at"
        }

        for key, value in data.items():
            if key in disallowed:
                continue
            setattr(app, key, value)

        app.save()
        return app


    @staticmethod
    def delete(app: Appointment):
        """
        Διαγράφει ραντεβού.
        """
        app.delete()
