from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Department, Student
from .serializers import DepartmentSerializer, StudentSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    queryset = Student.objects.select_related("department").all()

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get("search", "").strip()
        department = self.request.query_params.get("department")
        student_status = self.request.query_params.get("status")
        if search:
            qs = qs.filter(Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_id__icontains=search) | Q(email__icontains=search))
        if department:
            qs = qs.filter(department_id=department)
        if student_status:
            qs = qs.filter(status=student_status)
        return qs

@api_view(["GET"])
def dashboard(request):
    students = Student.objects.all()
    return Response({
        "total_students": students.count(),
        "active_students": students.filter(status="active").count(),
        "graduated_students": students.filter(status="graduated").count(),
        "inactive_students": students.filter(status="inactive").count(),
        "departments": Department.objects.count(),
        "average_gpa": round(float(sum(float(s.gpa) for s in students) / students.count()), 2) if students.exists() else 0,
        "recent_students": StudentSerializer(students.select_related("department").order_by("-created_at")[:5], many=True).data,
    })
