
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Psychologist


class UserSerializer(serializers.ModelSerializer):
    """
    Μεταφράζει τον Django User (Python object)
    σε JSON για το frontend, αλλά μόνο με ασφαλή πεδία.
    """

    class Meta:
        model = User

        # Τι θα δει το frontend
        fields = ["id", "username", "email"]

        # Δεν επιτρέπουμε αλλαγές σε αυτά μέσω αυτού του serializer
        read_only_fields = ["id", "username", "email"]


class PsychologistSerializer(serializers.ModelSerializer):
    """
    Serializer για το προφίλ του ψυχολόγου.
    Περιλαμβάνει nested τον User, μόνο για ανάγνωση.
    """

    user = UserSerializer(read_only=True)

    class Meta:
        model = Psychologist
        fields = [
            "id",
            "user",
            "first_name",
            "last_name",
            "phone_number",
            "specialization",
            "license_number",
            "notes",
            "created_at",
            "updated_at",
        ]
        # timestamps μόνο read-only
        read_only_fields = ["id", "created_at", "updated_at"]

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )

        Psychologist.objects.create(user=user)

        return user