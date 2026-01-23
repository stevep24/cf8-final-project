from .repositories import PsychologistRepository
from accounts.models import Psychologist
from django.contrib.auth.models import User
from django.db import transaction



class PsychologistService:
    """
    Service layer για Psychologist.
    Περιέχει business rules & use cases.
    """

    @staticmethod
    def get_profile_for_user(user: User) -> Psychologist:
        """
        Use case:
        - Ο συνδεδεμένος χρήστης βλέπει το ΠΛΗΡΕΣ προφίλ του.
        """
        return PsychologistRepository.get_by_user(user)

class AuthService:

    @staticmethod
    @transaction.atomic
    def register_psychologist(data: dict) -> User:
        """
        Δημιουργία νέου χρήστη + ψυχολόγου
        """

        # 1️⃣ Δημιουργία User
        user = User.objects.create_user(
            username=data["username"],
            password=data["password"],
            email=data.get("email", ""),
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
        )

        """
        Δημιουργία Psychologist
        """
        PsychologistRepository.create_for_user(
            user=user,
            data={
                "first_name": data["first_name"],
                "last_name": data["last_name"],
                "phone_number": data["phone_number"],
                "specialization": data["specialization"],
                "license_number": data["license_number"],
                "notes": data.get("notes"),
            }
        )

        return user