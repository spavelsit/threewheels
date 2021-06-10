from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from django.db.models import Q

from .models import Position
from .serializers import PositionSerializer


# Create your views here.
class PositionCreateView(generics.CreateAPIView):
	serializer_class 		= PositionSerializer
	permission_classes 	= [IsAdminUser]


class PositionListView(generics.ListAPIView):
	serializer_class 	= PositionSerializer
	
	def list(self, request, *args, **kwargs):
		limit		= int(request.query_params.get('limit', 1000))
		offset	= int(request.query_params.get('offset', 0))
		text 		= request.query_params.get('search', '')
		qrcode  = request.query_params.get('qrcode', '')

		if bool(text):
			queryset = Position.objects.filter(Q(name__icontains=text) | Q(article__icontains=text)).order_by('-quantity')[offset:limit+offset]
		elif bool(qrcode):
			queryset = Position.objects.filter(alias_id=qrcode)
		else:
			queryset = Position.objects.all().order_by('-quantity')[offset:limit+offset]

		serializer	= self.get_serializer(queryset, many=True)

		return Response(data={
			'count': len(queryset),
			'results': serializer.data
		})


class PositionDetailView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class 			= PositionSerializer
	permission_classes 		= [IsAdminUser]

	queryset 							= Position.objects.all()


class PositionTotalView(generics.ListAPIView):
	serializer_class = PositionSerializer
	permission_classes = [IsAdminUser]

	def list(self, request, *args, **kwargs):
		queryset 	= Position.objects.all()
		total 		= queryset.extra(select={'total': 'SUM(quantity * cost)'})

		return Response(data={
			'count': len(queryset),
			'result': total[0].total
		})