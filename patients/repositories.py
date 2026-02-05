from django.shortcuts import get_object_or_404
from django.db.models import QuerySet
from django.utils import timezone

from .models import TreatmentPlan, Patient
from accounts.models import Psychologist

class PatientRepository:

    @staticmethod
    def for_psych(psych: Psychologist):
        """
        Επιστρέφει όλους τους ασθενείς που ανήκουν ΣΤΟΝ ΣΥΓΚΕΚΡΙΜΕΝΟ ψυχολόγο.
        Δεν δείχνουμε ποτέ ασθενείς άλλων χρηστών.
        """
        return Patient.objects.filter(psychologist=psych)

    @staticmethod
    def get_by_id_for_psych(psych: Psychologist, patient_id: int):
        """
        Επιστρέφει έναν ασθενή ΜΟΝΟ αν ανήκει στον ψυχολόγο.
        Αν δεν τον βρει τοτε 404.
        """
        return get_object_or_404(Patient, psychologist=psych, id=patient_id)

    @staticmethod
    def search_by_last_name(psych: Psychologist, query: str):
        """
        Αναζήτηση ασθενών με βάση το επώνυμο.
        ΜΟΝΟ οι ασθενείς του ψυχολόγου.
        """
        return Patient.objects.filter(
            psychologist=psych,
            last_name__icontains=query
        )

    @staticmethod
    def created_after(psych: Psychologist, date):
        return Patient.objects.filter(psychologist=psych, created_at__gte=date)

    @staticmethod
    def active_for_psych(psych: Psychologist):
        return Patient.objects.filter(psychologist=psych, status="ACTIVE")

    @staticmethod
    def create_for_psych(psych: Psychologist, data: dict):
        """
        Δημιουργεί έναν νέο ασθενή.
        """
        return Patient.objects.create(psychologist=psych, **data)

    @staticmethod
    def update_patient(patient: Patient, data: dict):
        """
        Κάνει update στα πεδία του ασθενή.
        """
        for key, value in data.items():
            setattr(patient, key, value)
        patient.save()
        return patient

    @staticmethod
    def delete_patient(patient: Patient):
        """
        Διαγραφή ασθενή.
        """
        patient.delete()



class TreatmentPlanRepository:
    """
    Repository Layer για TreatmentPlan.
       """



    @staticmethod
    def for_psych(psych: Psychologist) -> QuerySet[TreatmentPlan]:
        """
        Όλα τα treatment plans του συγκεκριμένου ψυχολόγου.
        """
        return TreatmentPlan.objects.filter(psychologist=psych)

    @staticmethod
    def for_patient(psych: Psychologist, patient: Patient) -> QuerySet[TreatmentPlan]:
        """
        Όλα τα plans ενός ασθενή:
        - plan.psychologist = psych
        - plan.patient = patient
        """
        return TreatmentPlan.objects.filter(psychologist=psych, patient=patient)

    @staticmethod
    def get_by_id_for_psych(psych: Psychologist, plan_id: int) -> TreatmentPlan:
        """
        Επιστρέφει plan μόνο αν ανήκει στον ψυχολόγο.
        Αλλιώς 404.
        """
        return get_object_or_404(TreatmentPlan, id=plan_id, psychologist=psych)

    @staticmethod
    def get_active_for_patient(psych: Psychologist, patient: Patient) -> TreatmentPlan | None:
        """
        Επιστρέφει το ενεργό plan (is_active=True) για έναν ασθενή,
        αν υπάρχει. Αν υπάρχουν πολλά, παίρνει το πρώτο.
        """
        return (
            TreatmentPlan.objects.filter(
                psychologist=psych,
                patient=patient,
                is_active=True,
            )
            .order_by("-created_at")
            .first()
        )


    @staticmethod
    def create(psych: Psychologist, patient: Patient, data: dict) -> TreatmentPlan:
        """
        Δημιουργεί νέο TreatmentPlan συνδεδεμένο με psychologist & patient.
        """

        now = timezone.now()
        if "created_at" not in data:
            data["created_at"] = now
        if "updated_at" not in data:
            data["updated_at"] = now

        return TreatmentPlan.objects.create(
            psychologist=psych,
            patient=patient,
            **data
        )


    @staticmethod
    def update(plan: TreatmentPlan, data: dict) -> TreatmentPlan:
        """
        Update σε plan αλλά ΠΟΤΕ δεν επιτρέπουμε αλλαγή:
        - id/pk
        - patient
        - psychologist
        - created_at
        """
        disallowed = {"id", "pk", "patient", "psychologist", "created_at"}

        for key, value in data.items():
            if key in disallowed:
                continue
            setattr(plan, key, value)

        plan.updated_at = timezone.now()
        plan.save()
        return plan


    @staticmethod
    def set_active(plan: TreatmentPlan) -> TreatmentPlan:
        """
        κάνει το συγκεκριμένο plan active.
        """
        plan.is_active = True
        plan.updated_at = timezone.now()
        plan.save(update_fields=["is_active", "updated_at"])
        return plan

    @staticmethod
    def set_inactive(plan: TreatmentPlan) -> TreatmentPlan:
        """
        Κάνει το plan inactive.
        """
        plan.is_active = False
        plan.updated_at = timezone.now()
        plan.save(update_fields=["is_active", "updated_at"])
        return plan


    @staticmethod
    def delete(plan: TreatmentPlan) -> None:
        """
        Διαγραφή plan.
        """
        plan.delete()
