from django.db import models


# Create your models here.
class Companion(models.Model):
	full_name   = models.CharField(max_length=255)
	phone       = models.CharField(max_length=32)
	percent     = models.PositiveIntegerField(default=0)
