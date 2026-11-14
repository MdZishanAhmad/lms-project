import { useState } from "react";

export default function LessonForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
  error,
}) {
  const [form, setForm] = useState(initial);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, order: Number(form.order) });
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}

      <label>Title *</label>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Enter lesson title"
        required
      />

      <label>Description</label>
      <textarea
        name="description"
        rows="3"
        value={form.description}
        onChange={handleChange}
        placeholder="Enter lesson description"
      />

      <label>Video URL *</label>
      <input
        type="url"
        name="video_url"
        value={form.video_url}
        onChange={handleChange}
        placeholder="https://youtu.be/..."
        required
      />

      <label>Order *</label>
      <input
        type="number"
        min="1"
        name="order"
        value={form.order}
        onChange={handleChange}
        required
      />

      <div className="actions">
        <button className="btn" type="submit">
          {submitLabel}
        </button>
        <button className="btn btn-outline" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}