from django.urls import path

from .views import (
	OrderCreateView, 
	OrderListView,
	OrderListCount, 
	OrderDetailView,
	PositionToOrderDetailView,
	PositionToOrderAddedView
)

urlpatterns = [
	path('all', OrderListView.as_view()),
	path('count', OrderListCount.as_view()),
	path('create', OrderCreateView.as_view()),
	path('detail/<int:pk>', OrderDetailView.as_view()),
	path('position/add', PositionToOrderAddedView.as_view()),
	path('position/detail/<int:pk>', PositionToOrderDetailView.as_view()),
]