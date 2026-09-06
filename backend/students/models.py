from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=120, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.code} - {self.name}"

class Student(models.Model):
    STATUS_CHOICES = [("active", "Active"), ("inactive", "Inactive"), ("graduated", "Graduated")]
    GENDER_CHOICES = [("male", "Male"), ("female", "Female"), ("other", "Other")]

    student_id = models.CharField(max_length=30, unique=True)
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=80)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=25, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    address = models.CharField(max_length=255, blank=True)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name="students")
    semester = models.PositiveSmallIntegerField(default=1)
    enrollment_year = models.PositiveSmallIntegerField()
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default="active")
    gpa = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["first_name", "last_name"]

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def __str__(self):
        return f"{self.student_id} - {self.full_name}"
