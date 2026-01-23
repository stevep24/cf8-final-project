from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .models import Psychologist


class PsychologistRepository:
    """
    Repository Layer για το Psychologist model.
    """

    @staticmethod
    def get_by_user(user: User) -> Psychologist:
        """
        Φέρνει το προφίλ ψυχολόγου που είναι συνδεδεμένο
        με τον συγκεκριμένο Django User.
        """
        return get_object_or_404(Psychologist, user=user)

    @staticmethod
    def exists_for_user(user: User) -> bool:
        """
        Επιστρέφει True/False αν ο συγκεκριμένος User έχει ήδη
        προφίλ Psychologist.
        """
        return Psychologist.objects.filter(user=user).exists()

    @staticmethod
    def get_by_id(psych_id: int) -> Psychologist:
        """
        Βρίσκει ψυχολόγο με βάση το primary key (id).
        404 αν δεν βρεθεί.
        """
        return get_object_or_404(Psychologist, id=psych_id)

    @staticmethod
    def create_for_user(user: User, data: dict) -> Psychologist:
        """
         Δημιουργεί νέο Psychologist συνδεδεμένο με έναν User.
        """
        return Psychologist.objects.create(user=user, **data)

    @staticmethod
    def update(psych: Psychologist, data: dict) -> Psychologist:
        """
        Κάνει update το υπάρχον προφίλ ψυχολόγου με νέα δεδομένα.
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
        """
        psych.delete()
