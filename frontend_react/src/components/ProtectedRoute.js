import { Navigate, Outlet } from '../vendor/react-router-dom';

// PUBLIC_INTERFACE
export default function ProtectedRoute({ isAuthed, redirectTo = "/login" }) {
  /** A thin wrapper around Outlet to protect routes */
  return isAuthed ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
