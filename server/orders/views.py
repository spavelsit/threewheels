from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from django.db.models import F

from .models import (
	Order, 
	DetailToOrder, 
	CompanionToOrder,
	PositionToOrder
)

from .serializers import (
	OrderDetailSerializer, 
	OrderListSerializer, 
	PositionToOrderSerializer,

	RequestCompanionSerializer,
	RequestDetailSerializer,
	RequestPositionSerializer
)

from companions.models import Companion
from positions.models import Position

# Create your views here.
class OrderCreateView(generics.CreateAPIView):
	serializer_class    = OrderDetailSerializer
	permission_classes  = [IsAdminUser]

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		
		for position in request.data['positions']:
			position_instance = Position.objects.get(id=position['position'])

			if position_instance.quantity < position['quantity']:
				return Response(
					data={'positions': {'name': position['name'], 'max_quantity': position_instance.quantity}}, 
					status=status.HTTP_400_BAD_REQUEST
				)

		self.perform_create(serializer)

		serializer = OrderListSerializer(instance=serializer.instance)

		return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
	serializer_class    = OrderListSerializer
	permission_classes  = [IsAdminUser]

	def list(self, request, *args, **kwargs):
		limit		= int(request.query_params.get('limit', 1000))
		offset	= int(request.query_params.get('offset', 0))
		order 	= request.query_params.get('order')
		phone 	= request.query_params.get('phone', '')

		params = dict()

		if order:
			params['id'] = int(order)

		if phone:
			details = DetailToOrder.objects.filter(phone=phone)
			if len(details) == 0:
				return Response(data={
					'count': 0,
					'results': []
				})
			else:
				data = []
				for detail in details:
					queryset = Order.objects.get(id=detail.order_id)
					serializer	= self.get_serializer(queryset)
					data.append(serializer.data)

				return Response(data={
					'count': len(data),
					'results': data
				})
		
		queryset 		= Order.objects.filter(**params).order_by('-id')[offset:limit+offset]
		serializer	= self.get_serializer(queryset, many=True)

		return Response(data={
			'count': len(queryset),
			'results': serializer.data
		})


class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class		= OrderDetailSerializer
	permission_classes	= [IsAdminUser]

	def update(self, request, *args, **kwargs):
		try:
			instance = Order.objects.get(id=kwargs['pk'])
		except Order.DoesNotExist:
			return Response(data={'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

		validated_data_companion = RequestCompanionSerializer(data=request.data.pop('companion', {}))
		validated_data_companion.is_valid(raise_exception=False)

		validated_data_detail = RequestDetailSerializer(data=request.data.pop('detail', {}))
		validated_data_detail.is_valid(raise_exception=False)

		detail_data 		= validated_data_detail.data.copy()
		companion_data 	= validated_data_companion.data.copy()

		if bool(detail_data):
			DetailToOrder.objects.filter(order_id=instance.id).update(**detail_data)

		if bool(companion_data):
			try:
				CompanionToOrder.objects.get(order_id=instance.id)
				
				if 'companion' in companion_data:
					companion_data['companion']	= Companion.objects.get(id=companion_data['companion'])

				CompanionToOrder.objects.filter(order_id=instance.id).update(**companion_data)

			except CompanionToOrder.DoesNotExist:
				validated_data_companion.is_valid(raise_exception=True)

				companion_data['companion']	= Companion.objects.get(id=companion_data['companion'])
				companion_data['order']			= instance

				CompanionToOrder.objects.create(**companion_data)

		serializer = OrderListSerializer(instance=Order.objects.get(id=instance.id))

		return Response(data=serializer.data)


	def destroy(self, request, *args, **kwargs):
		try:
			instance = Order.objects.get(id=kwargs['pk'])
		except Order.DoesNotExist:
			return Response(data={'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

		serializer = OrderListSerializer(instance=instance)

		if len(serializer.data['positions']) != 0:
			for position in serializer.data['positions']:
				if position['position']:
					Position.objects.filter(id=position['position']['id']).update(quantity=F('quantity') + position['quantity'])

		instance.delete()

		return Response()


class PositionToOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class 		= PositionToOrderSerializer
	permission_classes 	= [IsAdminUser]

	def update(self, request, *args, **kwargs):
		try:
			instance = PositionToOrder.objects.get(id=kwargs['pk'])
		except Order.DoesNotExist:
			return Response(data={'detail': 'Position not found'}, status=status.HTTP_404_NOT_FOUND)

		serializer = PositionToOrderSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		if 'quantity' in serializer.data:
			if instance.position == None:
				return Response(
					data={
						'position': 'Does not exist'
					},
					status=status.HTTP_400_BAD_REQUEST
				)

			if instance.position.quantity + instance.quantity < serializer.data['quantity']:
				return Response(
					data={'position': {'name': instance.name, 'max_quantity': instance.position.quantity + instance.quantity}}, 
					status=status.HTTP_400_BAD_REQUEST
				)
			
			Position.objects.filter(id=instance.position.id).update(quantity=(instance.position.quantity + instance.quantity)-serializer.data['quantity'])

		PositionToOrder.objects.filter(id=kwargs['pk']).update(**serializer.data)

		serializer = PositionToOrderSerializer(instance=PositionToOrder.objects.get(id=kwargs['pk']))

		return Response(serializer.data)


	def destroy(self, request, *args, **kwargs):
		try:
			instance = PositionToOrder.objects.get(id=kwargs['pk'])
		except PositionToOrder.DoesNotExist:
			return Response(data={'detail': 'Position not found'}, status=status.HTTP_404_NOT_FOUND)

		order_instance = Order.objects.get(id=instance.order_id)
		order = OrderListSerializer(instance=order_instance)

		serializer = self.get_serializer(instance=instance)

		if serializer.data['position']:
			Position.objects.filter(id=serializer.data['position']['id']).update(quantity=F('quantity') + serializer.data['quantity'])

		if len(order.data['positions']) == 1:
			order_instance.delete()

			return Response()

		instance.delete()

		return Response()
		

class PositionToOrderAddedView(generics.CreateAPIView):
	serializer_class    = RequestPositionSerializer
	permission_classes  = [IsAdminUser]

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		position_data = serializer.data.copy()

		if 'order' in position_data:
			position_data['order'] 		= Order.objects.get(id=position_data['order'])
			position_data['position']	= Position.objects.get(id=position_data['position'])

			PositionToOrder.objects.create(**position_data)
			
			return Response(
				data=serializer.data, 
				status=status.HTTP_201_CREATED
			)

		return Response(
			data={'order': ["This fields is required"]},
			status=status.HTTP_400_BAD_REQUEST
		)


class OrderListCount(generics.ListAPIView):
	serializer_class    = OrderListSerializer
	permission_classes 	= [IsAdminUser]

	def list(self, request, *args, **kwargs):
		return Response(data={
			'count': Order.objects.filter(done=False).count()
		})