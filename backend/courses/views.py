from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.permissions import IsTeacher

from .models import Category, Course
from .permissions import IsCourseOwner
from .serializers import CategorySerializer, CourseSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Course.objects.select_related("category", "teacher")

        if self.action == "list":
            # 3.4 published courses for all users
            return queryset.filter(status=Course.Status.PUBLISHED)
        if self.action == "my":
            # 3.1 a teacher's own courses (draft + published)
            return queryset.filter(teacher=user)
        # retrieve / update / delete: published courses, or the user's own drafts
        return queryset.filter(Q(status=Course.Status.PUBLISHED) | Q(teacher=user))

    def get_permissions(self):
        if self.action in ("create", "my"):
            return [IsTeacher()]
        if self.action in ("update", "partial_update", "destroy"):
            return [IsTeacher(), IsCourseOwner()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    @action(detail=False, methods=["get"])
    def my(self, request):
        """GET /api/courses/my/ - the logged-in teacher's courses."""
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)