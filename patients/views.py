from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .services import PatientService
from .serializers import PatientSerializer
from accounts.repositories import PsychologistRepository


class PatientViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        psych = PsychologistRepository.get_by_user(request.user)
        patients = PatientService.list_for_psych(psych)
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        psych = PsychologistRepository.get_by_user(request.user)
        patient = PatientService.get_patient(psych, pk)
        serializer = PatientSerializer(patient)
        return Response(serializer.data)

    def create(self, request):
        psych = PsychologistRepository.get_by_user(request.user)
        patient = PatientService.create_patient(psych, request.data)
        serializer = PatientSerializer(patient)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        psych = PsychologistRepository.get_by_user(request.user)
        patient = PatientService.update_patient(psych, pk, request.data)
        serializer = PatientSerializer(patient)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        psych = PsychologistRepository.get_by_user(request.user)
        PatientService.delete_patient(psych, pk)
        return Response(status=status.HTTP_204_NO_CONTENT)
