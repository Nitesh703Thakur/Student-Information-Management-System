from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, StudentViewSet, dashboard

router = DefaultRouter()
router.register("students", StudentViewSet, basename="student")
router.register("departments", DepartmentViewSet, basename="department")

urlpatterns = [path("", include(router.urls)), path("dashboard/", dashboard)]
