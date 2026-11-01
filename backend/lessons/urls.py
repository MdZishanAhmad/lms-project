from django.urls import path

from .views import LessonDetailView, LessonListCreateView

urlpatterns = [
    path(
        "courses/<int:course_id>/lessons/",
        LessonListCreateView.as_view(),
        name="course-lessons",
    ),
    path("lessons/<int:pk>/", LessonDetailView.as_view(), name="lesson-detail"),
]