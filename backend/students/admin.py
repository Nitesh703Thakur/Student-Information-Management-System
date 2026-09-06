from django.contrib import admin
from .models import Department, Student

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "description")
    search_fields = ("code", "name")

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("student_id", "full_name", "email", "department", "semester", "gpa", "status")
    list_filter = ("status", "department", "semester")
    search_fields = ("student_id", "first_name", "last_name", "email")
