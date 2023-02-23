from django.shortcuts import render

# Create your views here.

def index(request):
  all_tasks = [
    "go to market",
    "go to home",
    "go to kitchen",
  ]
  return render(request, "tasks/index.html", {
    "tasklist": all_tasks,
  })

def add(request):
  return render(request, "tasks/add.html", {
  })