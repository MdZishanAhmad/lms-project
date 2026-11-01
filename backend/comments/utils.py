from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError

from courses.models import Course
from lessons.models import Lesson
from lessons.permissions import can_view_lessons

# 6.3 The only types a comment can be attached to
ALLOWED_TARGETS = {
    "course": Course,
    "lesson": Lesson,
}


def get_target(type_name, object_id):
    """Return the Course or Lesson, or raise a clear error."""
    model = ALLOWED_TARGETS.get(type_name)
    if model is None:
        raise ValidationError(
            {"commentable_type": "Comments are only allowed on 'course' or 'lesson'."}
        )
    try:
        return model.objects.select_related().get(pk=object_id)
    except model.DoesNotExist:
        raise NotFound(f"{type_name.capitalize()} with id {object_id} not found.")


def check_can_access(user, target):
    """Users can only see or comment where they can already see the content."""
    if isinstance(target, Course):
        allowed = (
            target.status == Course.Status.PUBLISHED or target.teacher_id == user.id
        )
    else:
        allowed = can_view_lessons(user, target.course)

    if not allowed:
        raise PermissionDenied("You do not have access to this content.")