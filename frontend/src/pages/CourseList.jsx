import { useEffect, useState } from "react";
import api from "../api/axios";
import { getErrorMessage } from "../api/errors";
import CourseCard from "../components/CourseCard";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/courses/")
      .then((res) => setCourses(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div>
      <h2>Available Courses</h2>
      {error && <p className="error">{error}</p>}
      {!error && courses.length === 0 && <p>No published courses yet.</p>}
      <div className="grid">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}