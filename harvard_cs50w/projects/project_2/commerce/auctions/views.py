from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from datetime import datetime

from .models import User, Bid, Comment, Auction

def auction_url(auction_title):
  return f"{reverse('index')}auction/{auction_title}"


def index(request):
  auctions = Auction.objects.all()

  return render(request, "auctions/index.html", {
    "auctions": auctions,
  })


def login_view(request):
  if request.method == "POST":

    # Attempt to sign user in
    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)

    # Check if authentication successful
    if user is not None:
      login(request, user)
      return HttpResponseRedirect(reverse("index"))
    else:
      return render(request, "auctions/login.html", {
        "message": "Invalid username and/or password.",
      })
  else:
    return render(request, "auctions/login.html")


def logout_view(request):
  logout(request)
  return HttpResponseRedirect(reverse("index"))


def register(request):
  if request.method == "POST":
    username = request.POST["username"]
    email = request.POST["email"]

    # Ensure password matches confirmation
    password = request.POST["password"]
    confirmation = request.POST["confirmation"]
    if password != confirmation:
      return render(request, "auctions/register.html", {
          "message": "Passwords must match.",
      })

    # Attempt to create new user
    try:
      user = User.objects.create_user(username, email, password)
      user.save()
    except IntegrityError:
      return render(request, "auctions/register.html", {
        "message": "Username already taken.",
      })
    login(request, user)
    return HttpResponseRedirect(reverse("index"))
  else:
    return render(request, "auctions/register.html")

def auction(request, auction_title):
  try:
    auction = Auction.objects.get(title=auction_title)
  except:
    return HttpResponseRedirect(reverse("no_auction"))
  
  bids = Bid.objects.filter(bid_auction__title=auction_title)
  
  if request.method == "POST":
    if "bid_amount" in request.POST:
      current_bid = Bid(
        amount=request.POST["bid_amount"], 
        bid_auction=auction,
        date=datetime.now()
      )
      current_bid.save()
      return HttpResponseRedirect(auction_url(auction_title))
    else:
      return HttpResponseRedirect(reverse("no_auction"))
  
  return render(request, "auctions/auction.html", {
    "auction": auction,
    "bids": bids,
  })

def no_auction(request):
  return render(request, "auctions/no_auction.html")
