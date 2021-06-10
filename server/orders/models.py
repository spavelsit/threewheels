from django.db import models
from companions.models import Companion
from positions.models import Position


# Create your models here.
class Order(models.Model):
	done        = models.BooleanField(default=0)
	date_added  = models.DateTimeField(auto_now_add=True)


class PositionToOrder(models.Model):
	order               = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='positions')
	position            = models.ForeignKey(Position, on_delete=models.SET_NULL, null=True)
	name                = models.CharField(max_length=255)
	article             = models.CharField(max_length=100, blank=True, null=True)
	quantity            = models.PositiveIntegerField(default=1)
	cost                = models.PositiveIntegerField(default=1)
	cost_of_sale        = models.PositiveIntegerField(default=1)
	companion           = models.ForeignKey(Companion, on_delete=models.SET_NULL, blank=True, null=True)
	companion_percent   = models.PositiveIntegerField(default=0)
	date_added					= models.DateTimeField(auto_now_add=True)
	

class CompanionToOrder(models.Model):
	order           = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='companion')
	companion       = models.ForeignKey(Companion, on_delete=models.SET_NULL, null=True)
	cost_of_work    = models.PositiveIntegerField(default=0)
	done						= models.BooleanField(default=0)


class DetailToOrder(models.Model):
	order               = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='detail')
	full_name           = models.CharField(max_length=255, blank=True, null=True)
	phone               = models.CharField(max_length=32, blank=True, null=True)
	address_delivery    = models.CharField(max_length=255, blank=True, null=True)
	sale        				= models.PositiveIntegerField(default=0)