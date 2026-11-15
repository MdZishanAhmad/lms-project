from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "LMS Administration"
admin.site.site_title = "LMS Admin"
admin.site.index_title = "Learning Management System Dashboard"

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/auth/", include("users.urls")),
    path("api/", include("courses.urls")),
    path("api/", include("enrollments.urls")),
    path("api/", include("lessons.urls")),
    path("api/", include("comments.urls")),
]
