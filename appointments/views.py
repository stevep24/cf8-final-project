from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from accounts.services import PsychologistService
from .serializers import AppointmentSerializer
from .services import AppointmentService
from .repositories import AppointmentRepository


class AppointmentViewSet(viewsets.ViewSet):
    """
    ViewSet για Appointments.
    Ownership rule:
    - κάθε ψυχολόγος βλέπει/πειράζει ΜΟΝΟ τα δικά του ραντεβού.
    """
    permission_classes = [IsAuthenticated]

    def _get_psych(self, request):
        # Συνδέουμε τον Django User με το domain entity Psychologist
        return PsychologistService.get_profile_for_user(request.user)

    def list(self, request):
        psych = self._get_psych(request)
        qs = AppointmentService.list_for_psych(psych)
        serializer = AppointmentSerializer(qs, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        psych = self._get_psych(request)
        appointment = AppointmentService.get_appointment(psych, int(pk))
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)

    def create(self, request):
        """
        Expected body (frontend):
        {
          "patient_id": 123,
          "session_datetime": "...",
          "duration_minutes": 60,
          "session_type": "IN_PERSON",
          "price": "50.00",
          "notes_from_therapist": "..."
        }
        """
        psych = self._get_psych(request)

        patient_id = request.data.get("patient_id")
        if not patient_id:
            raise ValidationError({"patient_id": "Απαιτείται patient_id"})

        # Αφαιρούμε patient_id πριν περάσει στο service ως model fields
        data = dict(request.data)
        data.pop("patient_id", None)

        try:
            appointment = AppointmentService.create_appointment(
                psych=psych,
                patient_id=int(patient_id),
                data=data
            )
        except ValueError as e:
            raise ValidationError({"detail": str(e)})

        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk=None):
        psych = self._get_psych(request)

        try:
            appointment = AppointmentService.update_appointment(
                psych=psych,
                appointment_id=int(pk),
                data=request.data
            )
        except ValueError as e:
            raise ValidationError({"detail": str(e)})

        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        psych = self._get_psych(request)

        appointment = AppointmentRepository.get_by_id_for_psych(psych, int(pk))
        AppointmentRepository.delete(appointment)
        return Response(status=status.HTTP_204_NO_CONTENT)


    @action(detail=False, methods=["get"], url_path=r"by-patient/(?P<patient_id>\d+)")
    def by_patient(self, request, patient_id=None):
        psych = self._get_psych(request)
        qs = AppointmentService.list_for_patient(psych, int(patient_id))
        serializer = AppointmentSerializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="upcoming")
    def upcoming(self, request):
        psych = self._get_psych(request)
        qs = AppointmentRepository.upcoming_for_psych(psych)
        serializer = AppointmentSerializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        psych = self._get_psych(request)
        try:
            appointment = AppointmentService.cancel_appointment(psych, int(pk))
        except ValueError as e:
            raise ValidationError({"detail": str(e)})

        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        psych = self._get_psych(request)
        try:
            appointment = AppointmentService.complete_appointment(psych, int(pk))
        except ValueError as e:
            raise ValidationError({"detail": str(e)})

        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)
