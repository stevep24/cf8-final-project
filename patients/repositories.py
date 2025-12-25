from django.shortcuts import get_object_or_404
from django.db.models import QuerySet
from django.utils import timezone

from .models import TreatmentPlan, Patient
from accounts.models import Psychologist

class PatientRepository:
    """
    Repository Layer για το Patient model.
    Εδώ συγκεντρώνουμε ΟΛΑ τα queries που αφορούν ασθενείς.
    Κανένα view / service δεν πρέπει να κάνει raw Patient.objects.filter.
    """

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
        Αν δεν τον βρει → 404 (σωστό για REST APIs).
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
        return Patient.objects.filter(psychologist=psych, is_active=True)

    @staticmethod
    def create_for_psych(psych: Psychologist, data: dict):
        """
        Δημιουργεί έναν νέο ασθενή και τον "δένει" αυτόματα
        με τον τρέχοντα ψυχολόγο.
        Το service layer θα φιλτράρει και θα κάνει validations,
        το repository απλά μιλάει στη βάση.
        """
        return Patient.objects.create(psychologist=psych, **data)

    @staticmethod
    def update_patient(patient: Patient, data: dict):
        """
        Κάνει update στα πεδία του ασθενή.
        Δεν αποφασίζει αν επιτρέπεται ή όχι → αυτό είναι δουλειά του service.
        """
        for key, value in data.items():
            setattr(patient, key, value)
        patient.save()
        return patient

    @staticmethod
    def delete_patient(patient: Patient):
        """
        Διαγραφή ασθενή. Αν δεν επιτρέπεται επιχειρησιακά,
        θα το χειριστεί το service layer.
        """
        patient.delete()



class TreatmentPlanRepository:
    """
    Repository Layer για TreatmentPlan.
    Εδώ μπαίνουν ΜΟΝΟ queries/CRUD προς DB (όχι business rules).
    """

    # -------------------------
    # READ / QUERY METHODS
    # -------------------------

    @staticmethod
    def for_psych(psych: Psychologist) -> QuerySet[TreatmentPlan]:
        """
        Όλα τα treatment plans του συγκεκριμένου ψυχολόγου.
        """
        return TreatmentPlan.objects.filter(psychologist=psych)

    @staticmethod
    def for_patient(psych: Psychologist, patient: Patient) -> QuerySet[TreatmentPlan]:
        """
        Όλα τα plans ενός ασθενή, αλλά ασφαλισμένο:
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
        αν υπάρχει. Αν υπάρχουν πολλά (δεν θα έπρεπε), παίρνει το πρώτο.
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

    # -------------------------
    # CREATE
    # -------------------------

    @staticmethod
    def create(psych: Psychologist, patient: Patient, data: dict) -> TreatmentPlan:
        """
        Δημιουργεί νέο TreatmentPlan συνδεδεμένο με psychologist & patient.
        Δεν εμπιστευόμαστε ποτέ το frontend να δώσει αυτά τα FK.
        """

        # Αν το μοντέλο σου έχει created_at/updated_at ως nullable και δεν είναι auto_now,
        # τα θέτουμε εδώ ώστε να έχουν τιμή.
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

    # -------------------------
    # UPDATE (defensive: block critical fields)
    # -------------------------

    @staticmethod
    def update(plan: TreatmentPlan, data: dict) -> TreatmentPlan:
        """
        Update σε plan αλλά ΠΟΤΕ δεν επιτρέπουμε αλλαγή:
        - id/pk
        - patient
        - psychologist
        - created_at
        (και ενημερώνουμε updated_at εμείς)
        """
        disallowed = {"id", "pk", "patient", "psychologist", "created_at"}

        for key, value in data.items():
            if key in disallowed:
                continue
            setattr(plan, key, value)

        # κρατάμε εμείς consistent το updated_at
        plan.updated_at = timezone.now()
        plan.save()
        return plan

    # -------------------------
    # STATE HELPERS (DB-level operations)
    # -------------------------

    @staticmethod
    def set_active(plan: TreatmentPlan) -> TreatmentPlan:
        """
        Απλά κάνει το συγκεκριμένο plan active.
        Το business rule "μόνο ένα active ανά ασθενή" ανήκει στο Service Layer.
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

    # -------------------------
    # DELETE
    # -------------------------

    @staticmethod
    def delete(plan: TreatmentPlan) -> None:
        """
        Διαγραφή plan.
        """
        plan.delete()
