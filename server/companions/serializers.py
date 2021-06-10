from rest_framework import serializers

from .models import Companion


class CompanionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Companion
    fields = '__all__'