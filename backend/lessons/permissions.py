from rest_framework.permissions import SAFE_METHODS, BasePermission

from courses.models import Course
from enrollments.models import Enrollment
from users.models import User


def is_course_owner(user, course):
    return user.role == User.Role.TEACHER and course.teacher_id == user.id


def is_enrolled(user, course):
    """A student with a non-cancelled enrollment in a published course."""
    return (
        user.role == User.Role.STUDENT
        and course.status == Course.Status.PUBLISHED
        and Enrollment.objects.filter(student=user, course=course)
        .exclude(status=Enrollment.Status.CANCELLED)
        .exists()
    )


def can_view_lessons(user, course):
    """5.4 Owner teacher, or an enrolled student."""
    return is_course_owner(user, course) or is_enrolled(user, course)


class LessonAccess(BasePermission):
    """Object-level rules for a single lesson."""

    message = "You do not have access to this lesson."

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return can_view_lessons(request.user, obj.course)
        return is_course_owner(request.user, obj.course)