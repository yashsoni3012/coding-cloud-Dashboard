import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Course from './pages/Course'
import Modules from './pages/Modules'
import Topics from './pages/Topics'
import AddCourse from './pages/AddCourse'
import EditCourse from './pages/EditCourse'
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

          <Route path="/modules" element={<Modules />} />
          <Route path="/topics" element={<Topics />} />
          {/* <Route path="users" element={<Users />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} /> */}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}