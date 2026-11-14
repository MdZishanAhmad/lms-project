import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { getErrorMessage } from "../api/errors";
import LessonForm from "./LessonForm";

export default function LessonList({ courseId, isOwner }) {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  // null = form hidden, "new" = adding, lesson object = editing
  const [editing, setEditing] = useState(null);

  const loadLessons = useCallback(() => {
    api
      .get(`/courses/${courseId}/lessons/`)
      .then((res) => setLessons(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, [courseId]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const openForm = (value) => {
    setFormError("");
    setEditing(value);
  };

  const handleSave = async (form) => {
    setFormError("");
    try {
      if (editing === "new") {
        await api.post(`/courses/${courseId}/lessons/`, form);
      } else {
        await api.put(`/lessons/${editing.id}/`, form);
      }
      setEditing(null);
      loadLessons();
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      await api.delete(`/lessons/${id}/`);
      setLessons((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const nextOrder = lessons.length
    ? Math.max(...lessons.map((l) => l.order)) + 1
    : 1;

  const initialForm =
    editing === "new"
      ? { title: "", description: "", video_url: "", order: nextOrder }
      : editing && {
          title: editing.title,
          description: editing.description,
          video_url: editing.video_url,
          order: editing.order,
        };

  return (
    <div className="card">
      <div className="row">
        <h3>Lessons</h3>
        {isOwner && !editing && (
          <button className="btn" onClick={() => openForm("new")}>
            + Add Lesson
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {editing && (
        <LessonForm
          key={editing === "new" ? "new" : editing.id}
          initial={initialForm}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
          submitLabel={editing === "new" ? "Add Lesson" : "Save Changes"}
          error={formError}
        />
      )}

      {!error && lessons.length === 0 && (
        <p className="muted">No lessons yet.</p>
      )}

      {lessons.map((lesson) => (
        <div key={lesson.id} className="lesson-row">
          <span>
            {lesson.order}. {lesson.title}
          </span>
          <div className="actions">
            <Link className="btn btn-outline" to={`/lessons/${lesson.id}`}>
              Open
            </Link>
            {isOwner && (
              <>
                <button
                  className="btn btn-outline"
                  onClick={() => openForm(lesson)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(lesson.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}