from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from courses.models import Course
from users.permissions import IsTeacher

from .models import Lesson
from .permissions import (
    LessonAccess,
    can_view_lessons,
    is_course_owner,
)
from .serializers import LessonSerializer


class LessonListCreateView(generics.ListCreateAPIView):
  

    serializer_class = LessonSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsTeacher()]
        return [IsAuthenticated()]

    def get_course(self):
        return get_object_or_404(Course, pk=self.kwargs["course_id"])

    def get_queryset(self):
        course = self.get_course()
        if not can_view_lessons(self.request.user, course):
            raise PermissionDenied(
                "You must be enrolled in this course to view its lessons."
            )
        return Lesson.objects.filter(course=course)

    def perform_create(self, serializer):
        course = self.get_course()
        if not is_course_owner(self.request.user, course):
            raise PermissionDenied(
                "You can only add lessons to your own courses."
            )
        serializer.save(course=course)


class LessonDetailView(generics.RetrieveUpdateDestroyAPIView):
   

    queryset = Lesson.objects.select_related("course")
    serializer_class = LessonSerializer

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [IsAuthenticated(), LessonAccess()]
        return [IsTeacher(), LessonAccess()]