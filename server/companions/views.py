from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from .models import Companion
from .serializers import CompanionSerializer


# Create your views here.

# Create your views here.
class CompanionCreateView(generics.CreateAPIView):
  serializer_class    = CompanionSerializer
  permission_classes  = [IsAdminUser]


class CompanionListView(generics.ListAPIView):
  serializer_class    = CompanionSerializer
  permission_classes  = [IsAdminUser]

  queryset            = Companion.objects.all()

class CompanionDetailView(generics.RetrieveUpdateDestroyAPIView):
  serializer_class    = CompanionSerializer
  permission_classes  = [IsAdminUser]

  queryset            = Companion.objects.all()