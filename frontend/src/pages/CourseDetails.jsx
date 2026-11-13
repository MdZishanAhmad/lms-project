import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { getErrorMessage } from "../api/errors";
import Comments from "../components/Comments";
import LessonList from "../components/LessonList";
import { useAuth } from "../context/AuthContext";

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get(`/courses/${id}/`);
        setCourse(data);

        if (user.role === "student") {
          const res = await api.get("/enrollments/my-courses/");
          setEnrolled(
            res.data.some(
              (e) => e.course.id === data.id && e.status !== "cancelled"
            )
          );
        }
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
    load();
  }, [id, user.role]);

  const handleEnroll = async () => {
    setError("");
    setMessage("");
    try {
      await api.post("/enrollments/", { course: Number(id) });
      setEnrolled(true);
      setMessage("You are now enrolled in this course.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (error && !course) return <p className="error">{error}</p>;
  if (!course) return <p>Loading course...</p>;

  const isOwner = user.role === "teacher" && course.teacher === user.id;
  const canSeeLessons = isOwner || enrolled;

  return (
    <div>
      <div className="card">
        <span className="badge">{course.category_name}</span>{" "}
        <span className="badge">{course.status}</span>
        <h2>{course.title}</h2>
        <p className="muted">Instructor: {course.teacher_name}</p>
        <p>{course.description}</p>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        {user.role === "student" &&
          (enrolled ? (
            <span className="badge">Enrolled</span>
          ) : (
            <button className="btn" onClick={handleEnroll}>
              Enroll Now
            </button>
          ))}

        {isOwner && (
          <Link className="btn" to={`/courses/${course.id}/edit`}>
            Edit Course
          </Link>
        )}
      </div>

      {canSeeLessons ? (
        <LessonList courseId={course.id} />
      ) : (
        <div className="card">
          <p className="muted">
            {user.role === "student"
              ? "Enroll in this course to view its lessons."
              : "Lessons are visible to the course owner and enrolled students."}
          </p>
        </div>
      )}

      <Comments type="course" id={course.id} />
    </div>
  );
}