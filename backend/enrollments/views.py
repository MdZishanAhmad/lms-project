from rest_framework import generics, status
from rest_framework.response import Response

from users.permissions import IsStudent

from .models import Enrollment
from .serializers import EnrollmentCreateSerializer, EnrollmentSerializer


class EnrollView(generics.CreateAPIView):
    """POST /api/enrollments/ - a student enrolls in a course (4.1)."""

    permission_classes = [IsStudent]
    serializer_class = EnrollmentCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        enrollment = Enrollment.objects.create(
            student=request.user, course=serializer.validated_data["course"]
        )
        return Response(
            EnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED
        )


class MyCoursesView(generics.ListAPIView):
    """GET /api/enrollments/my-courses/ - the logged-in student's courses (4.5)."""

    permission_classes = [IsStudent]
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        return Enrollment.objects.filter(
            student=self.request.user
        ).select_related("course", "course__category", "course__teacher")