from rest_framework import serializers

from courses.models import Course
from courses.serializers import CourseSerializer

from .models import Enrollment


class EnrollmentCreateSerializer(serializers.Serializer):
    """Input for POST /api/enrollments/ - only the course id is needed."""

    course = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.filter(status=Course.Status.PUBLISHED),
        error_messages={
            "does_not_exist": "Course not found or not published.",
        },
    )

    def validate_course(self, course):
        student = self.context["request"].user
        if Enrollment.objects.filter(student=student, course=course).exists():
            raise serializers.ValidationError(
                "You are already enrolled in this course."
            )
        return course


class EnrollmentSerializer(serializers.ModelSerializer):
    """Output: the enrollment together with its course details."""

    course = CourseSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ["id", "course", "enrolled_at", "status"]