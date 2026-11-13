import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { getErrorMessage } from "../api/errors";
import CourseForm from "../components/CourseForm";

const EMPTY_FORM = { title: "", description: "", category: "", status: "draft" };

export default function CourseFormPage() {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [initial, setInitial] = useState(isEdit ? null : EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const cats = await api.get("/categories/");
        setCategories(cats.data);

        if (isEdit) {
          const { data } = await api.get(`/courses/${id}/`);
          setInitial({
            title: data.title,
            description: data.description,
            category: data.category,
            status: data.status,
          });
        }
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
    load();
  }, [id, isEdit]);

  const handleSubmit = async (form) => {
    setError("");
    try {
      if (isEdit) {
        await api.put(`/courses/${id}/`, form);
      } else {
        await api.post("/courses/", form);
      }
      navigate("/my-courses");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (!initial) return error ? <p className="error">{error}</p> : <p>Loading...</p>;

  return (
    <div>
      <h2>{isEdit ? "Edit Course" : "Create Course"}</h2>
      <CourseForm
        initial={initial}
        categories={categories}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Save Changes" : "Create Course"}
        error={error}
      />
    </div>
  );
}