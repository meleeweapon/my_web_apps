from django.urls import path
from . import views

urlpatterns = [
  path("", views.index, name="index"),
  path("no_such_entry/", views.no_such_entry, name="no_such_entry"),
  path("<entry_title>/", views.entry, name="entry"),
]