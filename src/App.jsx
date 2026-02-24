import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Modules from "./pages/Modules";
import Topics from "./pages/Topics";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";
import AddModule from "./pages/AddModule";
import EditModule from "./pages/EditModule";
import AddTopic from "./pages/AddTopic";
import EditTopic from "./pages/EditTopic";
import ContactUs from "./pages/ContactUs";
import Enroll from "./pages/Enroll";
import Faq from "./pages/Faq";
import EditFAQ from "./pages/EditFAQ";
import AddFAQ from "./pages/AddFAQ";
import Blogs from "./pages/Blogs";
import AddBlog from "./pages/AddBlog";
import EditBlog from "./pages/EditBlog";
import Testimonials from "./pages/Testimonials";
import AddTestimonial from "./pages/AddTestimonial";
import EditTestimonial from "./pages/EditTestimonial";

// import Users from './pages/Users'
// import Analytics from './pages/Analytics'
// import Orders from './pages/Orders'
// import Settings from './pages/Settings'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          {/* courses */}
          <Route path="/course" element={<Course />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/edit-course/:id" element={<EditCourse />} />

          {/* modules */}
          <Route path="/modules" element={<Modules />} />
          <Route path="/add-module" element={<AddModule />} />
          <Route path="/edit-module/:id" element={<EditModule />} />

          {/* Topics */}
          <Route path="/topics" element={<Topics />} />
          <Route path="/add-topic" element={<AddTopic />} />
          <Route path="/edit-topic/:id" element={<EditTopic />} />

          <Route path="/contact" element={<ContactUs />} />
          <Route path="/enroll" element={<Enroll />} />

          {/* FAQs */}
          <Route path="/faq" element={<Faq />} />
          <Route path="/add-faq" element={<AddFAQ />} />
          <Route path="/edit-faq/:id" element={<EditFAQ />} />

          {/* Blogs */}
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/add-blog" element={<AddBlog />} />
          <Route path="/edit-blog/:id" element={<EditBlog />} />

          {/* Testimonials */}
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/add-testimonial" element={<AddTestimonial />} />
          <Route path="/edit-testimonial/:id" element={<EditTestimonial />} />
          {/* <Route path="users" element={<Users />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} /> */}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
