from django.test import TestCase
from ..models import Student, School, Grade, Fee, Payment
import uuid
from school_users.models import User
from django.db.models.query import QuerySet


class SchoolTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(email='bon@gmail', password=1234)
        self.school = School.objects.create(name="Test School", address="123 Main St", owner=user)

    def test_school_creation(self):
        self.assertEqual(self.school.name, "Test School")
        self.assertEqual(self.school.address, "123 Main St")
        self.assertIsInstance(self.school.id, uuid.UUID)

    def test_change_user(self):
        user2 = User.objects.create(email='bonf@gmail', password=1234)
        self.school.owner = user2
        self.school.save()
        self.assertEqual(self.school.owner, user2)

class GradeTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(email='bon@gmail', password=1234)
        self.school = School.objects.create(name="Test School", address="123 Main St", owner=user)
        self.grade = Grade.objects.create(name="Grade 10", description="Tenth grade", school=self.school)
        self.grade11 = Grade.objects.create(name="Grade 11", description="Tenth grade", school=self.school)
        self.grade12 = Grade.objects.create(name="Grade 12", description="Tenth grade", school=self.school)

    def test_grade_creation(self):
        self.assertEqual(self.grade.name, "Grade 10")
        self.assertEqual(self.grade.description, "Tenth grade")
        self.assertEqual(self.grade.school, self.school)
        self.assertIsInstance(self.school.grade.all(), QuerySet)
        self.assertEqual(len(self.school.grade.all()), 3)

    def test_str_method(self):
        self.assertEqual(str(self.grade), "Grade 10")

class StudentTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(email='bon@gmail', password=1234)
        self.school = School.objects.create(name="Test School", address="123 Main St", owner=user)
        self.grade11 = Grade.objects.create(name="Grade 11", description="Tenth grade", school=self.school)
        self.grade12 = Grade.objects.create(name="Grade 12", description="Tenth grade", school=self.school)
        self.student = Student.objects.create(name="John Doe", date_of_birth="1990-01-01", gender='male', grade=self.grade12, school=self.school)
        self.student2 = Student.objects.create(name="Jane Doe", date_of_birth="1990-01-01", gender='female', grade=self.grade11, school=self.school)

    def test_student_creation(self):
        self.assertEqual(self.student.name, "John Doe")
        self.assertEqual(self.student.date_of_birth, "1990-01-01")
        self.assertEqual(self.student.gender, 'male')
        self.assertEqual(self.student.school, self.school)
        self.assertEqual(self.student.grade, self.grade12)
        self.assertEqual(self.student2.school, self.school)
        self.assertEqual(self.student2.grade, self.grade11)
        self.assertIsInstance(self.grade11.students.all(), QuerySet)
        self.assertIsInstance(self.grade12.students.all(), QuerySet)


from decimal import Decimal

class FeeModelTests(TestCase):

    def setUp(self):
        user = User.objects.create(email='bon@gmail', password=1234)
        self.school = School.objects.create(name='Test School', address="123 Main St", owner=user)
        self.grade12 = Grade.objects.create(name="Grade 12", description="Tenth grade", school=self.school)
        self.student1 = Student.objects.create(name='John Doe', school=self.school, date_of_birth="1990-01-01", gender='male', grade=self.grade12)
        self.student2 = Student.objects.create(name='Jane Smith', school=self.school, date_of_birth="1990-01-01", gender='male', grade=self.grade12)

    def test_fee_creation(self):
        fee = Fee.objects.create(
            name='Grade 1 Fee',
            total_amount=Decimal('500.00'),
            total_paid=Decimal('100.00'),
            school=self.school
        )
        self.assertEqual(fee.name, 'Grade 1 Fee')
        self.assertEqual(fee.total_amount, Decimal('500.00'))
        self.assertEqual(fee.total_paid, Decimal('100.00'))
        self.assertEqual(fee.school, self.school)
        self.assertEqual(fee.students.count(), 0)

    def test_add_students_to_fee(self):
        fee = Fee.objects.create(
            name='Grade 2 Fee',
            total_amount=Decimal('600.00'),
            total_paid=Decimal('200.00'),
            school=self.school
        )
        fee.students.add(self.student1, self.student2)
        self.assertEqual(fee.students.count(), 2)

class PaymentModelTests(TestCase):

    def setUp(self):
        user = User.objects.create(email='bon@gmail', password=1234)
        self.school = School.objects.create(name='Test School', address="123 Main St", owner=user)
        self.grade12 = Grade.objects.create(name="Grade 12", description="Tenth grade", school=self.school)
        self.student = Student.objects.create(name='John Doe', school=self.school, date_of_birth="1990-01-01", gender='male', grade=self.grade12)
        self.fee = Fee.objects.create(
            name='Grade 1 Fee',
            total_amount=Decimal('500.00'),
            total_paid=Decimal('100.00'),
            school=self.school
        )

    def test_payment_creation(self):
        payment = Payment.objects.create(
            student=self.student,
            fee=self.fee,
            amount=Decimal('50.00'),
            payment_method='Credit Card',
            reference_number='PAY123456789'
        )
        self.assertEqual(payment.student, self.student)
        self.assertEqual(payment.fee, self.fee)
        self.assertEqual(payment.amount, Decimal('50.00'))
        self.assertEqual(payment.payment_method, 'Credit Card')
        self.assertEqual(payment.reference_number, 'PAY123456789')