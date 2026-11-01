from rest_framework import serializers

from .models import Comment


class CommentTargetSerializer(serializers.Serializer):
    """Validates which course or lesson a comment belongs to."""

    commentable_type = serializers.ChoiceField(
        choices=["course", "lesson"],
        error_messages={
            "invalid_choice": "Comments are only allowed on 'course' or 'lesson'."
        },
    )
    commentable_id = serializers.IntegerField(min_value=1)


class CommentCreateSerializer(CommentTargetSerializer):
    """Input for adding a comment."""

    body = serializers.CharField(max_length=1000)


class CommentSerializer(serializers.ModelSerializer):
    """Output for a comment."""

    user_name = serializers.CharField(source="user.name", read_only=True)
    user_role = serializers.CharField(source="user.role", read_only=True)
    commentable_type = serializers.CharField(
        source="commentable_type.model", read_only=True
    )

    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "user_name",
            "user_role",
            "commentable_type",
            "commentable_id",
            "body",
            "created_at",
        ]