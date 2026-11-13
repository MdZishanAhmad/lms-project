import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { getErrorMessage } from "../api/errors";

export default function StudentCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/enrollments/my-courses/")
      .then((res) => setEnrollments(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {!error && enrollments.length === 0 && (
        <p>You have not enrolled in any course yet.</p>
      )}
      {enrollments.map((e) => (
        <div key={e.id} className="card row">
          <div>
            <h3>{e.course.title}</h3>
            <p className="muted">
              {e.course.category_name} &middot; Enrolled on{" "}
              {new Date(e.enrolled_at).toLocaleDateString()}
            </p>
            <span className="badge">{e.status}</span>
          </div>
          <Link className="btn" to={`/courses/${e.course.id}`}>
            View Course
          </Link>
        </div>
      ))}
    </div>
  );
}