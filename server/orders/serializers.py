from rest_framework import serializers
from django.db.models import F

from .models import Order, PositionToOrder, DetailToOrder, CompanionToOrder

from companions.models import Companion
from companions.serializers import CompanionSerializer

from positions.models import Position
from positions.serializers import PositionSerializer


class OrderSerializer(serializers.ModelSerializer):
  class Meta:
    model   = Order
    fields  = '__all__'


class RequestPositionSerializer(serializers.Serializer):
  position            = serializers.PrimaryKeyRelatedField(queryset=Position.objects.all())
  order               = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), required=False)
  name                = serializers.CharField(required=True)
  article             = serializers.CharField(required=False, allow_blank=True, allow_null=True)
  quantity            = serializers.IntegerField(required=True)
  cost                = serializers.IntegerField(required=True)
  cost_of_sale        = serializers.IntegerField(required=True)
  companion           = serializers.PrimaryKeyRelatedField(queryset=Companion.objects.all(), required=False)
  companion_percent   = serializers.IntegerField(required=False)


class RequestCompanionSerializer(serializers.Serializer):
  companion     = serializers.PrimaryKeyRelatedField(queryset=Companion.objects.all(), required=True)
  cost_of_work  = serializers.IntegerField(required=True)
  done          = serializers.BooleanField(required=False)


class RequestDetailSerializer(serializers.Serializer):
  full_name         = serializers.CharField(required=False, allow_blank=True, allow_null=True)
  phone             = serializers.CharField(required=False, allow_blank=True, allow_null=True)
  address_delivery  = serializers.CharField(required=False)
  sale              = serializers.IntegerField(required=False)
  done              = serializers.BooleanField(required=False)


class OrderDetailSerializer(serializers.ModelSerializer):
  positions   = RequestPositionSerializer(many=True)
  detail      = RequestDetailSerializer(required=True)
  companion   = RequestCompanionSerializer(required=False)

  def create(self, validated_data):
    positions_data   = validated_data.pop('positions', [])
    detail_data      = validated_data.pop('detail', {})
    companion_data   = validated_data.pop('companion', {})

    order_instance = super(OrderDetailSerializer, self).create(validated_data)

    DetailToOrder.objects.create(order=order_instance, **detail_data)

    if len(companion_data) != 0:
      CompanionToOrder.objects.create(order=order_instance, **companion_data)


    for position in positions_data:
      PositionToOrder.objects.create(order=order_instance, **position)
      Position.objects.filter(id=position['position'].id).update(quantity=F('quantity') - position['quantity'])

    return order_instance

  class Meta:
    model   = Order
    fields  = ['id', 'detail', 'companion', 'positions', 'done', 'date_added']


class PositionToOrderSerializer(serializers.ModelSerializer):
  position      = PositionSerializer(read_only=True)
  name          = serializers.CharField(read_only=True)
  article       = serializers.CharField(read_only=True)
  cost          = serializers.IntegerField(read_only=True)
  cost_of_sale  = serializers.IntegerField(read_only=True) 
  order_id      = serializers.IntegerField(read_only=True)

  class Meta:
    model   = PositionToOrder
    fields  = ['id', 'order_id', 'name', 'article', 'quantity', 'cost', 'cost_of_sale', 'companion', 'companion_percent', 'position']


class CompanionToOrderSerializer(serializers.ModelSerializer):
  companion = CompanionSerializer(read_only=True)

  class Meta:
    model   = CompanionToOrder
    fields  = ['companion', 'cost_of_work', 'done']


class DetailToOrderSerializer(serializers.ModelSerializer):
  class Meta:
    model   = DetailToOrder
    fields  = ['full_name', 'phone', 'address_delivery', 'sale']


class OrderListSerializer(serializers.ModelSerializer):
  positions = PositionToOrderSerializer(many=True)
  companion = CompanionToOrderSerializer(read_only=True)
  detail    = DetailToOrderSerializer(read_only=True)

  class Meta:
    model   = Order
    fields  = ['id', 'detail', 'companion', 'positions', 'done', 'date_added']
