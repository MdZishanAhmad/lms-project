import { useEffect, useState } from "react";
import api from "../api/axios";
import { getErrorMessage } from "../api/errors";

// type is "course" or "lesson"
export default function Comments({ type, id }) {
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/comments/", {
        params: { commentable_type: type, commentable_id: id },
      })
      .then((res) => setComments(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, [type, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/comments/", {
        commentable_type: type,
        commentable_id: Number(id),
        body,
      });
      setComments((prev) => [...prev, data]);
      setBody("");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="card">
      <h3>Comments ({comments.length})</h3>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          rows="2"
          placeholder="Add a comment..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <button className="btn" type="submit">
          Post
        </button>
      </form>

      {comments.length === 0 && <p className="muted">No comments yet.</p>}
      {comments.map((c) => (
        <div key={c.id} className="comment">
          <strong>{c.user_name}</strong>{" "}
          <span className="badge">{c.user_role}</span>{" "}
          <span className="muted">
            {new Date(c.created_at).toLocaleString()}
          </span>
          <p>{c.body}</p>
        </div>
      ))}
    </div>
  );
}