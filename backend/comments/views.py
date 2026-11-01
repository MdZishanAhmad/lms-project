from django.contrib.contenttypes.models import ContentType
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Comment
from .serializers import (
    CommentCreateSerializer,
    CommentSerializer,
    CommentTargetSerializer,
)
from .utils import check_can_access, get_target


class CommentListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/comments/?commentable_type=course&commentable_id=1  - list comments
    POST /api/comments/                                           - add a comment
    """

    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def resolve_target(self, type_name, object_id):
        target = get_target(type_name, object_id)
        check_can_access(self.request.user, target)
        return target

    def get_queryset(self):
        params = CommentTargetSerializer(data=self.request.query_params)
        params.is_valid(raise_exception=True)
        target = self.resolve_target(
            params.validated_data["commentable_type"],
            params.validated_data["commentable_id"],
        )
        return Comment.objects.filter(
            commentable_type=ContentType.objects.get_for_model(target),
            commentable_id=target.pk,
        ).select_related("user", "commentable_type")

    def create(self, request, *args, **kwargs):
        serializer = CommentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        target = self.resolve_target(data["commentable_type"], data["commentable_id"])
        comment = Comment.objects.create(
            user=request.user, commentable=target, body=data["body"]
        )
        return Response(
            CommentSerializer(comment).data, status=status.HTTP_201_CREATED
        )