import { Navigate } from "react-router"
import { useSelector } from "react-redux"
import LoginForm from "../../componentes/login/LoginForm.jsx"
import LayoutAutenticacion from "../../componentes/layout/LayoutAutenticacion.jsx"

const LoginPage = () => {
  const token = useSelector((state) => state.auth.token)

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <LayoutAutenticacion
      etiqueta="Leg Day Never"
      titulo="Gestiona tus entrenamientos desde un solo lugar."
      descripcion="Accede al dashboard para crear rutinas, administrar categorías y revisar el uso de la aplicación."
    >
      <LoginForm />
    </LayoutAutenticacion>
  )
}

export default LoginPage
