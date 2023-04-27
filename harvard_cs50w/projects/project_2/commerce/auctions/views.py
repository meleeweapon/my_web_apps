from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from datetime import datetime
from django.contrib.auth.decorators import login_required
from .forms import AuctionForm, BidForm, CommentForm

from .models import User, Bid, Comment, Auction

# TODO: user shouldn't be able to bid self auction, if already bid should only be able to update the bid
# TODO: fixed auction image size
# TODO: in new auction, if no url is provided, display a default img

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

  if request.method == "POST":
    if not request.user.is_authenticated:
      return HttpResponseRedirect(reverse("login"))

    bid_form = BidForm(request.POST)
    comment_form = CommentForm(request.POST)
    if bid_form.is_valid():
      if bid_form.cleaned_data["amount"] < auction.starting_bid:
        return HttpResponseRedirect(auction_url(auction.title))
      current_bid = Bid(
        amount=bid_form.cleaned_data["amount"], 
        bid_auction=auction,
        date=datetime.now(),
        user=request.user,
      )
      current_bid.save()
      return HttpResponseRedirect(auction_url(auction_title))
    elif comment_form.is_valid():
      comment = Comment(
        content=comment_form.cleaned_data["content"],
        date=datetime.now(),
        comment_auction=auction,
        user=request.user
      )
      comment.save()
      return HttpResponseRedirect(auction_url(auction_title))
    else:
      return HttpResponseRedirect(reverse("no_auction"))
  
  bids = auction.auction_bids.all()
  comments = auction.auction_comments.all()
  bid_form = BidForm()
  comment_form = CommentForm()
  return render(request, "auctions/auction.html", {
    "auction": auction,
    "bids": bids,
    "comments": comments,
    "bid_form": bid_form,
    "comment_form": comment_form,
  })

def no_auction(request):
  return render(request, "auctions/no_auction.html")

def new_auction_view(request):
  if not request.user.is_authenticated:
    return HttpResponseRedirect(reverse("login"))
  if request.method == "POST":
    auction_form = AuctionForm(request.POST)
    if not auction_form.is_valid():
      return HttpResponseRedirect(reverse("no_auction"))
    data = auction_form.cleaned_data
    auction = Auction(
      title=data["title"], 
      description=data["description"],
      date=datetime.now(),
      holder=request.user,
      starting_bid=data["starting_bid"],
      picture_url=data["picture_url"],
    )
    auction.save()
    return HttpResponseRedirect(auction_url(auction.title))

  auction_form = AuctionForm()
  return render(request, "auctions/new_auction.html", {
    "auction_form": auction_form
  })
