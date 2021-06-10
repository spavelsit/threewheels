from django.db import models

# Create your models here.
class Position(models.Model):
	name            = models.CharField(max_length=255)
	article         = models.CharField(max_length=100, blank=True, null=True)
	quantity        = models.PositiveIntegerField(default=1)
	cost            = models.PositiveIntegerField(default=1)
	cost_of_sale    = models.PositiveIntegerField(default=1)
	alias_id        = models.CharField(max_length=24, unique=True)

	def total(self):
		return self.cost * self.quantity