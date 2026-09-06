from django.core.management.base import BaseCommand
from students.models import Department, Student

DEPARTMENTS = [
    ("Computer Science & IT", "CSIT"),
    ("Business Administration", "BBA"),
    ("Management", "BBS"),
    ("Civil Engineering", "CIVIL"),
]

STUDENTS = [
    ("STU-2026-001", "Aarav", "Sharma", "aarav.sharma@example.com", "CSIT", 7, 2022, "active", 3.72),
    ("STU-2026-002", "Anisha", "Yadav", "anisha.yadav@example.com", "BBA", 5, 2023, "active", 3.48),
    ("STU-2026-003", "Rohan", "Jha", "rohan.jha@example.com", "CSIT", 6, 2023, "active", 3.86),
    ("STU-2026-004", "Sita", "Thapa", "sita.thapa@example.com", "BBS", 4, 2024, "active", 3.34),
    ("STU-2025-005", "Bibek", "Mandal", "bibek.mandal@example.com", "CIVIL", 8, 2022, "graduated", 3.21),
    ("STU-2026-006", "Prakriti", "Karki", "prakriti.karki@example.com", "CSIT", 3, 2025, "active", 3.91),
]

class Command(BaseCommand):
    help = "Create demo departments and students"
    def handle(self, *args, **options):
        deps = {}
        for name, code in DEPARTMENTS:
            deps[code], _ = Department.objects.get_or_create(code=code, defaults={"name": name})
        for sid, first, last, email, code, semester, year, student_status, gpa in STUDENTS:
            Student.objects.update_or_create(student_id=sid, defaults={
                "first_name": first, "last_name": last, "email": email,
                "department": deps[code], "semester": semester, "enrollment_year": year,
                "status": student_status, "gpa": gpa,
            })
        self.stdout.write(self.style.SUCCESS("Demo data created successfully."))
