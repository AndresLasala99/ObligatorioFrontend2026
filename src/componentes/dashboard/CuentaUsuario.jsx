import { joiResolver } from "@hookform/resolvers/joi"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"
import { cambiarPasswordSchema } from "../../validators/perfil.validators.js"

const CuentaUsuario = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isValid } } = useForm({
    resolver: joiResolver(cambiarPasswordSchema),
    mode: "onChange",
  })

  const procesarForm = async (data) => {
    try {
      await api.patch("/usuarios/perfil/password", data)
      toast.success("Contraseña actualizada correctamente.")
      reset()
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo cambiar la contraseña."
        toast.error(mensaje)
      }
    }
  }

  return (
    <section className="dashboard-stack">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Cuenta</p>
          <h1>Mi cuenta</h1>
          <p className="text-secondary">Gestiona la seguridad de acceso a tu cuenta.</p>
        </div>
      </header>

      <article className="panel">
        <div className="section-title">
          <div>
            <h2>Cambiar contraseña</h2>
            <p className="text-secondary mb-0">Actualiza tu contraseña usando tu clave actual.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(procesarForm)}>
          <div className="mb-3">
            <label htmlFor="passwordActual" className="form-label">Contraseña actual</label>
            <input id="passwordActual" type="password" className="form-control" placeholder="Ingrese su contraseña actual" {...register("passwordActual")} />
            {errors.passwordActual && <span className="error">{errors.passwordActual.message}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="passwordNueva" className="form-label">Nueva contraseña</label>
            <input id="passwordNueva" type="password" className="form-control" placeholder="Ingrese su nueva contraseña" {...register("passwordNueva")} />
            {errors.passwordNueva && <span className="error">{errors.passwordNueva.message}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="confirmarPasswordNueva" className="form-label">Repetir nueva contraseña</label>
            <input id="confirmarPasswordNueva" type="password" className="form-control" placeholder="Repita su nueva contraseña" {...register("confirmarPasswordNueva")} />
            {errors.confirmarPasswordNueva && <span className="error">{errors.confirmarPasswordNueva.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting || !isValid}>
            {isSubmitting ? "Actualizando..." : "Cambiar contraseña"}
          </button>
        </form>
      </article>
    </section>
  )
}

export default CuentaUsuario
