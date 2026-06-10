import RegisterForm from "../../componentes/register/RegisterForm.jsx"
import LayoutAutenticacion from "../../componentes/layout/LayoutAutenticacion.jsx"

const RegisterPage = () => {
  return (
    <LayoutAutenticacion
      etiqueta="Registro"
      titulo="Crea tu cuenta y empieza a entrenar mejor."
      descripcion="Los clientes pueden inscribirse a entrenamientos. Los entrenadores pueden crear categorías y rutinas."
    >
      <RegisterForm />
    </LayoutAutenticacion>
  )
}

export default RegisterPage
