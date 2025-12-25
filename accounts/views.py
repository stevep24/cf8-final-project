from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

def homePage(request):
    return HttpResponse('<h1>Home Page</h1>')