import StudentCourses from "../components/StudentCourses";
import TeacherCourses from "../components/TeacherCourses";
import { useAuth } from "../context/AuthContext";

export default function MyCourses() {
  const { user } = useAuth();

  return (
    <div>
      <h2>My Courses</h2>
      {user.role === "teacher" ? <TeacherCourses /> : <StudentCourses />}
    </div>
  );
}