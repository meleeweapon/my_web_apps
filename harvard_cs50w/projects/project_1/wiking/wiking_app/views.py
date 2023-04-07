from django.shortcuts import render
from .models import Entry
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse

# Create your views here.
def index(request):
  all_entries = Entry.objects.all()

  return render(request, "wiking_app/index.html", {
    "all_entries": all_entries,
  })

def entry(request, entry_title):
  try:
    entry = Entry.objects.get(title=entry_title)
  except Entry.DoesNotExist:
    return HttpResponseRedirect(reverse("no_such_entry"))

  if request.method == "POST":
    if "delete_entry" in request.POST:
      entry.delete()
      return HttpResponseRedirect(reverse("index"))
      


  return render(request, "wiking_app/entry.html", {
    "entry": entry,
  })

def new_entry(request):
  if request.method == "POST":
    title = request.POST["title"]
    try:
      Entry.objects.get(title=title)
    except Entry.DoesNotExist:
      exists = False
    else:
      exists = True

    if not exists:
      content = request.POST["content"]
      Entry(title=title, content=content).save()
      return HttpResponseRedirect(reverse("entry_added"))
    else:
      return HttpResponseRedirect(reverse("entry_add_failed"))

  return render(request, "wiking_app/new_entry.html", {
  })

def no_such_entry(request):
  return render(request, "wiking_app/no_such_entry.html", {

  })

def entry_added(request):
  return render(request, "wiking_app/entry_added.html")

def entry_add_failed(request):
  return render(request, "wiking_app/entry_add_failed.html")