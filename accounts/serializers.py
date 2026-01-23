
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Psychologist


class UserSerializer(serializers.ModelSerializer):
    """
    Μεταφράζει τον Django User σε JSON για το frontend.
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

class RegisterPsychologistSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone_number = serializers.CharField()
    specialization = serializers.CharField()
    license_number = serializers.CharField()
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Το username χρησιμοποιείται ήδη")
        return value

    def validate_license_number(self, value):
        if Psychologist.objects.filter(license_number=value).exists():
            raise serializers.ValidationError("Υπάρχει ήδη ψυχολόγος με αυτόν τον αριθμό άδειας")
        return value
