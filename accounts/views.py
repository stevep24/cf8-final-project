from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import PsychologistSerializer, RegisterPsychologistSerializer
from .services import AuthService, PsychologistService
from rest_framework import status

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user

    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
    })

@api_view(["POST"])
@permission_classes([AllowAny])
def register_psychologist_view(request):
    serializer = RegisterPsychologistSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    AuthService.register_psychologist(serializer.validated_data)

    return Response(
        {"message": "Psychologist account created successfully"},
        status=status.HTTP_201_CREATED
    )




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def psychologist_me_view(request):
    """
    Επιστρέφει το ΠΛΗΡΕΣ προφίλ του ψυχολόγου.
    """
    psychologist = PsychologistService.get_profile_for_user(request.user)
    serializer = PsychologistSerializer(psychologist)
    return Response(serializer.data)