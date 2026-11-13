import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { getErrorMessage } from "../api/errors";

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/courses/my/")
      .then((res) => setCourses(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await api.delete(`/courses/${id}/`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <Link className="btn" to="/courses/new">
        + Create Course
      </Link>

      {error && <p className="error">{error}</p>}
      {!error && courses.length === 0 && <p>You have no courses yet.</p>}

      {courses.map((course) => (
        <div key={course.id} className="card row">
          <div>
            <h3>{course.title}</h3>
            <p className="muted">{course.category_name}</p>
            <span className="badge">{course.status}</span>
          </div>
          <div className="actions">
            <Link className="btn btn-outline" to={`/courses/${course.id}`}>
              View
            </Link>
            <Link className="btn btn-outline" to={`/courses/${course.id}/edit`}>
              Edit
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(course.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}