import { useState } from "react";

export default function CourseForm({
  initial,
  categories,
  onSubmit,
  submitLabel,
  error,
}) {
  const [form, setForm] = useState(initial);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}

      <label>Title *</label>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Enter course title"
        required
      />

      <label>Description *</label>
      <textarea
        name="description"
        rows="5"
        value={form.description}
        onChange={handleChange}
        placeholder="Enter course description"
        required
      />

      <label>Category *</label>
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <label>Status *</label>
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      <button className="btn" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}