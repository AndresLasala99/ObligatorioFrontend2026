import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import api from "../../api/api.js"
import { setCredenciales } from "../../features/auth/auth.slice.js"
import { mostrarPrincipal } from "../../features/dashboard/dashboard.slice.js"

const LoginForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  const procesarForm = async (data) => {
    try {
      const res = await api.post("/auth/login", data)

      dispatch(setCredenciales({
        usuario: res.data.usuario,
        token: res.data.token,
      }))
      dispatch(mostrarPrincipal())

      toast.success("Sesión iniciada correctamente.")
      navigate("/dashboard", { replace: true })
    } catch (error) {
      const mensaje = error.response?.data?.message || "No se pudo iniciar sesión."
      toast.error(mensaje)
    }
  }

  return (
    <>
      <h2>Iniciar sesión</h2>
      <p className="text-secondary">Ingresá con tu email y contraseña.</p>

      <form onSubmit={handleSubmit(procesarForm)}>
        <div className="mb-3">
          <label htmlFor="emailLogin" className="form-label">Email</label>
          <input id="emailLogin" type="text" className="form-control" placeholder="Ingrese su email" {...register("email")} />
        </div>

        <div className="mb-3">
          <label htmlFor="passwordLogin" className="form-label">Contraseña</label>
          <input id="passwordLogin" type="password" className="form-control" placeholder="Ingrese su contraseña" {...register("password")} />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="auth-link">
        ¿No tenés cuenta? <Link to="/registro">Crear cuenta</Link>
      </p>
    </>
  )
}

export default LoginForm


