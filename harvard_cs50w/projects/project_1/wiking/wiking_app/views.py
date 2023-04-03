from django.shortcuts import render
from .models import Entry
from django.http import HttpResponseRedirect
from django.urls import reverse

# Create your views here.
def index(request):
  return render(request, "wiking_app/index.html", {})

def entry(request, entry_title):
  try:
    entry = Entry.objects.get(title=entry_title)
  except Entry.DoesNotExist:
    return HttpResponseRedirect(reverse("no_such_entry"))

  return render(request, "wiking_app/entry.html", {
    "entry": entry,
  })

def no_such_entry(request):
  return render(request, "wiking_app/no_such_entry.html", {

  })