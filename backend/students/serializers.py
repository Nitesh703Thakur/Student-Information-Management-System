from rest_framework import serializers
from .models import Department, Student

class DepartmentSerializer(serializers.ModelSerializer):
    student_count = serializers.IntegerField(source="students.count", read_only=True)
    class Meta:
        model = Department
        fields = ["id", "name", "code", "description", "student_count"]

class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    department_name = serializers.CharField(source="department.name", read_only=True)
    department_code = serializers.CharField(source="department.code", read_only=True)

    class Meta:
        model = Student
        fields = [
            "id", "student_id", "first_name", "last_name", "full_name", "email", "phone",
            "date_of_birth", "gender", "address", "department", "department_name", "department_code",
            "semester", "enrollment_year", "status", "gpa", "created_at", "updated_at",
        ]
