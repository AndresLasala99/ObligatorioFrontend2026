import { joiResolver } from "@hookform/resolvers/joi"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import api from "../../api/api.js"
import { setCredenciales } from "../../features/auth/auth.slice.js"
import { registerSchema } from "../../validators/auth.validators.js"

const RegisterForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm({
    resolver: joiResolver(registerSchema),
    mode: "onChange",
  })

  const procesarForm = async (data) => {
    try {
      const res = await api.post("/auth/registro", data)

      dispatch(setCredenciales({
        usuario: res.data.usuario,
        token: res.data.token,
      }))

      toast.success("Usuario registrado correctamente.")
      navigate("/dashboard")
    } catch (error) {
      const mensaje = error.response?.data?.message || "No se pudo registrar el usuario."
      toast.error(mensaje)
    }
  }

  return (
    <>
      <h2>Crear cuenta</h2>

      <form onSubmit={handleSubmit(procesarForm)}>
        <div className="mb-3">
          <label htmlFor="nombreRegistro" className="form-label">Nombre</label>
          <input id="nombreRegistro" type="text" className="form-control" placeholder="Ingrese su nombre" {...register("nombre")} />
          {errors.nombre && <span className="error">{errors.nombre.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="emailRegistro" className="form-label">Email</label>
          <input id="emailRegistro" type="email" className="form-control" placeholder="Ingrese su email" {...register("email")} />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="passwordRegistro" className="form-label">Contraseña</label>
            <input id="passwordRegistro" type="password" className="form-control" placeholder="Ingrese su contraseña" {...register("password")} />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="confirmPasswordRegistro" className="form-label">Repetir contraseña</label>
            <input id="confirmPasswordRegistro" type="password" className="form-control" placeholder="Repita su contraseña" {...register("confirmPassword")} />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="rolRegistro" className="form-label">Rol</label>
          <select id="rolRegistro" className="form-select" defaultValue="cliente" {...register("rol")}>
            <option value="cliente">Cliente</option>
            <option value="entrenador">Entrenador</option>
          </select>
          {errors.rol && <span className="error">{errors.rol.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting || !isValid}>
          {isSubmitting ? "Registrando..." : "Registrarme"}
        </button>
      </form>

      <p className="auth-link">
        ¿Ya tenés cuenta? <Link to="/">Iniciar sesión</Link>
      </p>
    </>
  )
}

export default RegisterForm

