import { Navigate, Outlet } from "react-router"

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("usuario") !== null

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
