import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { getErrorMessage } from "../api/errors";

export default function LessonList({ courseId }) {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/courses/${courseId}/lessons/`)
      .then((res) => setLessons(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, [courseId]);

  return (
    <div className="card">
      <h3>Lessons</h3>
      {error && <p className="error">{error}</p>}
      {!error && lessons.length === 0 && (
        <p className="muted">No lessons yet.</p>
      )}
      {lessons.map((lesson) => (
        <div key={lesson.id} className="lesson-row">
          <span>
            {lesson.order}. {lesson.title}
          </span>
          <Link className="btn btn-outline" to={`/lessons/${lesson.id}`}>
            Open
          </Link>
        </div>
      ))}
    </div>
  );
}