from django.db import models
from django.contrib.auth.models import AbstractUser

ms = models

class User(AbstractUser):
  pass

class Auction(ms.Model):
  title = ms.CharField(max_length=64)
  description = ms.CharField(max_length=2048)

#   bids = ms.ForeignKey(
#     Bid, on_delete=ms.CASCADE, related_name="auction_bids"
#   )
#   comments = ms.ForeignKey(
#     Comment, on_delete=ms.CASCADE, related_name="auction_comments"
#   )

  holder = ms.ForeignKey(
    User, on_delete=ms.CASCADE, related_name="user_auctions"
  )

class Comment(ms.Model):
  content = ms.CharField(max_length=1024)
  comment_auction = ms.ForeignKey(
    Auction, on_delete=ms.CASCADE, related_name="auction_comments"
  )

class Bid(ms.Model):
  amount = ms.FloatField()
  bid_auction = ms.ForeignKey(
    Auction, on_delete=ms.CASCADE, related_name="auction_bids"
  )