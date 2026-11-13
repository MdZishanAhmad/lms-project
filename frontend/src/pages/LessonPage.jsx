import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { getErrorMessage } from "../api/errors";
import Comments from "../components/Comments";

export default function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/lessons/${id}/`)
      .then((res) => setLesson(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!lesson) return <p>Loading lesson...</p>;

  return (
    <div>
      <Link to={`/courses/${lesson.course}`}>&larr; Back to course</Link>

      <div className="card">
        <h2>
          {lesson.order}. {lesson.title}
        </h2>
        <p>{lesson.description}</p>
        <a
          className="btn"
          href={lesson.video_url}
          target="_blank"
          rel="noreferrer"
        >
          Watch Video
        </a>
      </div>

      <Comments type="lesson" id={lesson.id} />
    </div>
  );
}