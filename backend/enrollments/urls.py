from django.urls import path

from .views import EnrollView, MyCoursesView

urlpatterns = [
    path("enrollments/", EnrollView.as_view(), name="enroll"),
    path("enrollments/my-courses/", MyCoursesView.as_view(), name="my-courses"),
]