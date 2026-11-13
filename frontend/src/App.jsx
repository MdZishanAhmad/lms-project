import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import CourseDetails from "./pages/CourseDetails";
import CourseFormPage from "./pages/CourseFormPage";
import CourseList from "./pages/CourseList";
import LessonPage from "./pages/LessonPage";
import Login from "./pages/Login";
import MyCourses from "./pages/MyCourses";

export default function App() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CourseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/new"
            element={
              <ProtectedRoute role="teacher">
                <CourseFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id/edit"
            element={
              <ProtectedRoute role="teacher">
                <CourseFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessons/:id"
            element={
              <ProtectedRoute>
                <LessonPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}