from django.db import models

from courses.models import Course
from django.contrib.contenttypes.fields import GenericRelation


class Lesson(models.Model):
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="lessons"
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video_url = models.URLField(max_length=500)
    order = models.PositiveIntegerField()
    comments = GenericRelation(
        "comments.Comment",
        content_type_field="commentable_type",
        object_id_field="commentable_id",
    )

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.course.title} - {self.order}. {self.title}"