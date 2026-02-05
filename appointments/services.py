from accounts.models import Psychologist
from .repositories import AppointmentRepository
from patients.repositories import PatientRepository
from .models import Appointment


class AppointmentService:

    @staticmethod
    def list_for_psych(psych: Psychologist):
        """
        Use case:
        - Ο ψυχολόγος βλέπει όλα τα ραντεβού του.

        Rules:
        - Επιστρέφονται ΜΟΝΟ ραντεβού του συγκεκριμένου ψυχολόγου.
        """

        return AppointmentRepository.for_psych(psych)

    @staticmethod
    def list_for_patient(psych: Psychologist, patient_id: int):
        """
        Use case:
        - Ο ψυχολόγος βλέπει όλα τα ραντεβού ενός ασθενή.

        Rules:
        - Ο ασθενής ΠΡΕΠΕΙ να ανήκει στον ψυχολόγο.
        """

        patient = PatientRepository.get_by_id_for_psych(psych, patient_id)

        return AppointmentRepository.for_patient(psych, patient)


    @staticmethod
    def get_appointment(psych: Psychologist, appointment_id: int):
        """
        Use case:
        - Προβολή συγκεκριμένου ραντεβού.

        Rules:
        - Ο ψυχολόγος μπορεί να δει ΜΟΝΟ ραντεβού που του ανήκουν.
        """

        return AppointmentRepository.get_by_id_for_psych(psych, appointment_id)

    @staticmethod
    def create_appointment(psych: Psychologist, patient_id: int, data: dict):
        """
        Use case:
        - Δημιουργία νέου ραντεβού για ασθενή.

        Rules:
        - Ο ασθενής ΠΡΕΠΕΙ να ανήκει στον ψυχολόγο.
        - Το status ορίζεται αρχικά σε SCHEDULED.
        """

        patient = PatientRepository.get_by_id_for_psych(psych, patient_id)

        disallowed_fields = {"status", "psychologist", "patient"}
        clean_data = {
            key: value
            for key, value in data.items()
            if key not in disallowed_fields
        }

        # Δημιουργούμε το ραντεβού με default status
        appointment = AppointmentRepository.create(
            psych=psych,
            patient=patient,
            data={
                **clean_data,
                "status": Appointment.Status.SCHEDULED,
            }
        )

        return appointment

    @staticmethod
    def update_appointment(psych: Psychologist, appointment_id: int, data: dict):
        """
        Use case:
        - Ενημέρωση στοιχείων ραντεβού.

        Rules:
        - Το ραντεβού πρέπει να ανήκει στον ψυχολόγο
        - COMPLETED ραντεβού δεν τροποποιούνται
        - Δεν αλλάζουμε ownership ή status από εδώ
        """

        appointment = AppointmentRepository.get_by_id_for_psych(psych, appointment_id)

        if appointment.status == Appointment.Status.COMPLETED:
            allowed_fields = {"notes_from_therapist"}
            if not set(data.keys()).issubset(allowed_fields):
                raise ValueError(
                    "Σε ολοκληρωμένο ραντεβού επιτρέπονται μόνο σημειώσεις"
                )

        disallowed_fields = {
            "status",
            "psychologist",
            "patient",
            "created_at",
            "updated_at",
        }

        clean_data = {
            key: value
            for key, value in data.items()
            if key not in disallowed_fields
        }

        return AppointmentRepository.update(appointment, clean_data)

    @staticmethod
    def cancel_appointment(psych: Psychologist, appointment_id: int):
        """
        Use case:
        - Ακύρωση ραντεβού.

        Rules:
        - Το ραντεβού πρέπει να ανήκει στον ψυχολόγο
        - Δεν ακυρώνεται COMPLETED ραντεβού
        """

        appointment = AppointmentRepository.get_by_id_for_psych(psych, appointment_id)

        if appointment.status == Appointment.Status.CANCELED:
            return appointment

        if appointment.status == Appointment.Status.COMPLETED:
            raise ValueError("Δεν επιτρέπεται ακύρωση ολοκληρωμένου ραντεβού")

        return AppointmentRepository.update(
            appointment,
            {"status": Appointment.Status.CANCELED}
        )

    @staticmethod
    def complete_appointment(psych: Psychologist, appointment_id: int):
        """
        Use case:
        - Ολοκλήρωση ραντεβού.

        Rules:
        - Το ραντεβού πρέπει να ανήκει στον ψυχολόγο
        - Δεν ολοκληρώνεται ακυρωμένο ραντεβού
        """

        appointment = AppointmentRepository.get_by_id_for_psych(psych, appointment_id)

        if appointment.status == Appointment.Status.COMPLETED:
            return appointment

        if appointment.status == Appointment.Status.CANCELED:
            raise ValueError("Δεν επιτρέπεται ολοκλήρωση ακυρωμένου ραντεβού")

        return AppointmentRepository.update(
            appointment,
            {"status": Appointment.Status.COMPLETED}
        )