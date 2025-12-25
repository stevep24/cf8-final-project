from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .models import Psychologist


class PsychologistRepository:
    """
    Repository Layer για το Psychologist model.

    Εδώ συγκεντρώνουμε ΟΛΑ τα queries που αφορούν τον ψυχολόγο.
    Δεν θέλουμε στα views / services να γράφουμε κατευθείαν
    Psychologist.objects.filter(...) κτλ.
    """

    @staticmethod
    def get_by_user(user: User) -> Psychologist:
        """
        Φέρνει το προφίλ ψυχολόγου που είναι συνδεδεμένο
        με τον συγκεκριμένο Django User.

        Χρήση:
        - Όταν έχουμε request.user και θέλουμε το Psychologist profile.
        - Αν δεν υπάρχει, σηκώνει 404 (χρήσιμο σε REST API).
        """
        return get_object_or_404(Psychologist, user=user)

    @staticmethod
    def exists_for_user(user: User) -> bool:
        """
        Επιστρέφει True/False αν ο συγκεκριμένος User έχει ήδη
        προφίλ Psychologist.

        Χρήση:
        - During signup, για να μη φτιάξεις διπλό προφίλ.
        """
        return Psychologist.objects.filter(user=user).exists()

    @staticmethod
    def get_by_id(psych_id: int) -> Psychologist:
        """
        Βρίσκει ψυχολόγο με βάση το primary key (id).
        Σηκώνει 404 αν δεν βρεθεί.
        """
        return get_object_or_404(Psychologist, id=psych_id)

    @staticmethod
    def create_for_user(user: User, data: dict) -> Psychologist:
        """
        Δημιουργεί νέο Psychologist συνδεδεμένο με έναν User.

        Σημαντικό:
        - Το user έρχεται από το authentication flow (π.χ. signup/login).
        - Δεν εμπιστευόμαστε το frontend να στείλει user_id.
          Το περνάμε εμείς από το backend.

        Παράδειγμα data:
        {
          "first_name": "...",
          "last_name": "...",
          "phone_number": "...",
          "specialization": "...",
          "license_number": "...",
          "notes": "..."
        }
        """
        return Psychologist.objects.create(user=user, **data)

    @staticmethod
    def update(psych: Psychologist, data: dict) -> Psychologist:
        """
        Κάνει update το υπάρχον προφίλ ψυχολόγου με νέα δεδομένα.

        ΔΕΝ αποφασίζει αν επιτρέπεται να αλλάξει κάτι (π.χ. license_number).
        Αυτή η λογική ανήκει στο Service Layer.
        """
        disallowed_fields = {"id", "pk", "user", "created_at", "updated_at"}

        for key, value in data.items():
            if key in disallowed_fields:
                continue
            setattr(psych, key, value)
        psych.save()
        return psych

    @staticmethod
    def delete(psych: Psychologist):
        """
        Διαγράφει το προφίλ ψυχολόγου.

        Συνήθως σε τέτοιο app δεν θα το χρησιμοποιήσεις συχνά,
        αλλά το βάζουμε για πληρότητα.
        """
        psych.delete()
