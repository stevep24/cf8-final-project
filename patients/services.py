from accounts.models import Psychologist
from .repositories import PatientRepository, TreatmentPlanRepository
from appointments.repositories import AppointmentRepository
from django.db import transaction


class TreatmentPlanService:
    @staticmethod
    def list_for_patient(psych: Psychologist, patient_id: int):
        """
        Use case:
        - Ο ψυχολόγος βλέπει όλα τα Treatment Plans ενός ασθενή.

        Rules:
        - Ο ασθενής ΠΡΕΠΕΙ να ανήκει στον ψυχολόγο (ownership).
        """

        # 1) Βρίσκουμε τον ασθενή με ασφάλεια (μόνο για τον συγκεκριμένο psych)
        patient = PatientRepository.get_by_id_for_psych(psych, patient_id)

        # 2) Παίρνουμε όλα τα plans του ασθενή.
        return TreatmentPlanRepository.for_patient(psych, patient)

    @staticmethod
    def get_plan(psych: Psychologist, plan_id: int):
        """
        Use case:
        - Προβολή συγκεκριμένου Treatment Plan.

        Rules:
        - Ο ψυχολόγος μπορεί να δει ΜΟΝΟ plans που του ανήκουν.
        """

        # Delegate το ownership & fetch στο repository
        return TreatmentPlanRepository.get_by_id_for_psych(psych, plan_id)

    @staticmethod
    def create_plan(psych: Psychologist, patient_id: int, data: dict):
        """
        Use case:
        - Δημιουργία νέου Treatment Plan για έναν ασθενή.

        Rules:
        - Ο ασθενής ΠΡΕΠΕΙ να ανήκει στον ψυχολόγο.
        - Το plan δημιουργείται ως inactive.
        """

        # Ownership check: ο ασθενής πρέπει να είναι του ψυχολόγου
        patient = PatientRepository.get_by_id_for_psych(psych, patient_id)

        # Ασφαλές create (psych & patient περνάνε από backend)
        plan = TreatmentPlanRepository.create(
            psych=psych,
            patient=patient,
            data=data
        )

        return plan

    @staticmethod
    @transaction.atomic
    def create_and_activate_plan(psych: Psychologist, patient_id: int, data: dict):
        """
        Use case:
        - Δημιουργία ΝΕΟΥ Treatment Plan
        - Το νέο plan γίνεται το ΜΟΝΑΔΙΚΟ active plan του ασθενή

        Business rule:
        - Κάθε ασθενής έχει ΜΟΝΟ ΕΝΑ active plan
        """

        # Ownership check
        patient = PatientRepository.get_by_id_for_psych(psych, patient_id)

        # Βρίσκουμε τυχόν ενεργό plan
        current_active_plan = TreatmentPlanRepository.get_active_for_patient(
            psych, patient
        )

        # Αν υπάρχει ενεργό plan → το απενεργοποιούμε
        if current_active_plan:
            TreatmentPlanRepository.set_inactive(current_active_plan)

        # Δημιουργούμε νέο plan (inactive by default)
        new_plan = TreatmentPlanRepository.create(
            psych=psych,
            patient=patient,
            data=data
        )

        # Το κάνουμε active
        TreatmentPlanRepository.set_active(new_plan)

        return new_plan

    @staticmethod
    @transaction.atomic
    def activate_plan(psych: Psychologist, plan_id: int):
        """
        Use case:
        - Ενεργοποίηση ΥΠΑΡΧΟΝΤΟΣ treatment plan.

        Business rules:
        - Το plan πρέπει να ανήκει στον ψυχολόγο
        - Κάθε ασθενής έχει ΜΟΝΟ ΕΝΑ active plan
        """

        # Παίρνουμε το plan (ownership check)
        plan = TreatmentPlanRepository.get_by_id_for_psych(psych, plan_id)

        patient = plan.patient

        # Αν το plan είναι ήδη active, δεν κάνουμε τίποτα
        if plan.is_active:
            return plan

        #Βρίσκουμε τυχόν άλλο active plan για τον ίδιο ασθενή
        current_active = TreatmentPlanRepository.get_active_for_patient(
            psych, patient
        )

        #Αν υπάρχει και είναι διαφορετικό plan → το απενεργοποιούμε
        if current_active and current_active.id != plan.id:
            TreatmentPlanRepository.set_inactive(current_active)

        #Ενεργοποιούμε το ζητούμενο plan
        TreatmentPlanRepository.set_active(plan)

        return plan


    @staticmethod
    def update_plan(psych: Psychologist, plan_id: int, data: dict):
        """
        Use case:
        - Ενημέρωση περιεχομένου Treatment Plan.

        Rules:
        - Το plan πρέπει να ανήκει στον ψυχολόγο
        - Δεν επιτρέπεται αλλαγή state (is_active) από εδώ
        """

        #Παίρνουμε το plan με ownership check
        plan = TreatmentPlanRepository.get_by_id_for_psych(psych, plan_id)

        #Κόβουμε fields που ΔΕΝ επιτρέπεται να αλλάξουν εδώ
        disallowed_fields = {"is_active"}
        clean_data = {
            key: value
            for key, value in data.items()
            if key not in disallowed_fields
        }

        #Delegate το update στο repository
        return TreatmentPlanRepository.update(plan, clean_data)

    @staticmethod
    def deactivate_plan(psych: Psychologist, plan_id: int):
        """
        Use case:
        - Απενεργοποίηση treatment plan.

        Rules:
        - Το plan πρέπει να ανήκει στον ψυχολόγο
        """

        # Ownership check
        plan = TreatmentPlanRepository.get_by_id_for_psych(psych, plan_id)

        #Αν είναι ήδη inactive, δεν κάνουμε τίποτα
        if not plan.is_active:
            return plan

        #Απενεργοποίηση
        return TreatmentPlanRepository.set_inactive(plan)


    @staticmethod
    def delete_plan(psych: Psychologist, plan_id: int):
        """
        Use case:
        - Οριστική διαγραφή treatment plan.

        Rules:
        - Το plan πρέπει να ανήκει στον ψυχολόγο
        - Δεν επιτρέπεται διαγραφή ACTIVE plan
        """

        # Ownership check
        plan = TreatmentPlanRepository.get_by_id_for_psych(psych, plan_id)



        #  Διαγραφή
        TreatmentPlanRepository.delete(plan)

class PatientService:
    @staticmethod
    def list_for_psych(psych):
        return PatientRepository.for_psych(psych)

    @staticmethod
    def get_patient(psych, patient_id):
        return PatientRepository.get_by_id_for_psych(psych, patient_id)

    @staticmethod
    def create_patient(psych, data):
        disallowed_fields = {"psychologist"}
        clean_data = {k: v for k, v in data.items() if k not in disallowed_fields}
        return PatientRepository.create_for_psych(psych, clean_data)

    @staticmethod
    def update_patient(psych, patient_id, data):
        patient = PatientRepository.get_by_id_for_psych(psych, patient_id)
        disallowed_fields = {"psychologist", "created_at", "updated_at"}
        clean_data = {k: v for k, v in data.items() if k not in disallowed_fields}
        return PatientRepository.update_patient(patient, clean_data)

    @staticmethod
    def delete_patient(psych, patient_id):
        patient = PatientRepository.get_by_id_for_psych(psych, patient_id)
        PatientRepository.delete_patient(patient)
