from django.urls import path

from .views import CompanionCreateView, CompanionListView, CompanionDetailView

urlpatterns = [
	path('all', CompanionListView.as_view()),
	path('create', CompanionCreateView.as_view()),
	path('detail/<int:pk>', CompanionDetailView.as_view())
]