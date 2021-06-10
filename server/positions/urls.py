from django.urls import path

from .views import (
	PositionCreateView, 
	PositionListView, 
	PositionDetailView,
	PositionTotalView
)


urlpatterns = [
	path('all', PositionListView.as_view()),
	path('create', PositionCreateView.as_view()),
	path('detail/<int:pk>', PositionDetailView.as_view()),

	path('total', PositionTotalView.as_view()),
]