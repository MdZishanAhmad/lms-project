import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <div className="card">
      <span className="badge">{course.category_name}</span>
      <h3>{course.title}</h3>
      <p className="muted">By {course.teacher_name}</p>
      <p>
        {course.description.length > 100
          ? `${course.description.slice(0, 100)}...`
          : course.description}
      </p>
      <Link className="btn" to={`/courses/${course.id}`}>
        View Details
      </Link>
    </div>
  );
}