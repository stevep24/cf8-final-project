from django.urls import path
from .views import (
    me_view,
    psychologist_me_view,
    register_psychologist_view,
    update_psychologist_view,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("register/", register_psychologist_view, name="register"),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", me_view, name="me"),
    path("psychologist/", psychologist_me_view, name="psychologist-me"),
    path("psychologist/update/", update_psychologist_view, name="psychologist-update"),
]
