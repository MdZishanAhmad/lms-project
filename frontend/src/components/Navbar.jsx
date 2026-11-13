import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <strong>LMS</strong>
        <Link to="/">Courses</Link>
        <Link to="/my-courses">My Courses</Link>
        {user.role === "teacher" && <Link to="/courses/new">Create Course</Link>}
      </div>
      <div className="navbar-user">
        <span>
          {user.name} ({user.role})
        </span>
        <button className="btn btn-outline" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}