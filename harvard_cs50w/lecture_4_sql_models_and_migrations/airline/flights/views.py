from django.shortcuts import render
from django.core import exceptions

from .models import Flight

# Create your views here.
def index(request):
  return render(request, "flights/index.html", {
    "flights": Flight.objects.all(),
  })

def flight(request, flight_id):
  try:
    flight = Flight.objects.get(pk=flight_id)
  except Flight.DoesNotExist:
    return render(request, "flights/flight_does_not_exist.html", {
    })
  return render(request, "flights/flight.html", {
    "flight": flight,
  })