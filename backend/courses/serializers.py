from rest_framework import serializers

from .models import Category, Course


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class CourseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    teacher_name = serializers.CharField(source="teacher.name", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "category",
            "category_name",
            "status",
            "teacher",
            "teacher_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["teacher", "created_at", "updated_at"]

    def validate_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError(
                "Title must be at least 3 characters long."
            )
        return value.strip()