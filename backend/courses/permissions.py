from rest_framework.permissions import BasePermission


class IsCourseOwner(BasePermission):
    """Object-level: only the teacher who owns the course."""

    message = "You can only modify your own courses."

    def has_object_permission(self, request, view, obj):
        return obj.teacher_id == request.user.id