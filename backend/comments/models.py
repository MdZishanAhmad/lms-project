from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models


class Comment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments"
    )

    # Polymorphic target: one table for comments on both courses and lessons
    commentable_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    commentable_id = models.PositiveIntegerField()
    commentable = GenericForeignKey("commentable_type", "commentable_id")

    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        indexes = [
            models.Index(fields=["commentable_type", "commentable_id"]),
        ]

    def __str__(self):
        return f"{self.user.email} on {self.commentable_type.model} #{self.commentable_id}"