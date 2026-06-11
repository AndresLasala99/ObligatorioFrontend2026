import { joiResolver } from "@hookform/resolvers/joi"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"
import { actualizarUsuario } from "../../features/auth/auth.slice.js"
import { fotoPerfilSchema } from "../../validators/perfil.validators.js"

const PerfilUsuario = () => {
  const dispatch = useDispatch()
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: joiResolver(fotoPerfilSchema),
  })

  const imagenSeleccionada = watch("imagen")

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const res = await api.get("/usuarios/perfil")
        setPerfil(res.data.usuarioBuscado)
      } catch (error) {
        if (debeMostrarError(error)) {
          const mensaje = error.response?.data?.message || "No se pudo obtener el perfil."
          toast.error(mensaje)
        }
      } finally {
        setCargando(false)
      }
    }

    obtenerPerfil()
  }, [])

  const procesarForm = async (data) => {
    try {
      const archivoImagen = data.imagen?.[0]

      if (!archivoImagen) {
        toast.error("Debe seleccionar una imagen.")
        return
      }

      const formData = new FormData()
      formData.append("imagen", archivoImagen)
      formData.append("folder", "perfiles")

      const resUpload = await api.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const res = await api.patch("/usuarios/perfil/foto", {
        fotoPerfil: resUpload.data.url,
      })

      setPerfil(res.data.usuarioActualizado)
      dispatch(actualizarUsuario({
        id: res.data.usuarioActualizado._id,
        nombre: res.data.usuarioActualizado.nombre,
        email: res.data.usuarioActualizado.email,
        rol: res.data.usuarioActualizado.rol,
        plan: res.data.usuarioActualizado.plan,
        fotoPerfil: res.data.usuarioActualizado.fotoPerfil,
      }))
      toast.success("Foto de perfil actualizada correctamente.")
      reset()
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo actualizar la foto."
        toast.error(mensaje)
      }
    }
  }

  const quitarFoto = async () => {
    try {
      const res = await api.patch("/usuarios/perfil/foto", {
        fotoPerfil: "",
      })

      setPerfil(res.data.usuarioActualizado)
      dispatch(actualizarUsuario({
        id: res.data.usuarioActualizado._id,
        nombre: res.data.usuarioActualizado.nombre,
        email: res.data.usuarioActualizado.email,
        rol: res.data.usuarioActualizado.rol,
        plan: res.data.usuarioActualizado.plan,
        fotoPerfil: res.data.usuarioActualizado.fotoPerfil,
      }))
      toast.success("Foto de perfil quitada correctamente.")
      reset()
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo quitar la foto."
        toast.error(mensaje)
      }
    }
  }

  const cambiarPlan = async () => {
    try {
      const res = await api.patch(`/usuarios/${perfil._id}/plan`, {
        plan: "premium",
      })

      setPerfil(res.data.usuarioActualizado)
      dispatch(actualizarUsuario({
        id: res.data.usuarioActualizado._id,
        nombre: res.data.usuarioActualizado.nombre,
        email: res.data.usuarioActualizado.email,
        rol: res.data.usuarioActualizado.rol,
        plan: res.data.usuarioActualizado.plan,
        fotoPerfil: res.data.usuarioActualizado.fotoPerfil,
      }))
      toast.success("Plan actualizado correctamente.")
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo actualizar el plan."
        toast.error(mensaje)
      }
    }
  }

  if (cargando) {
    return (
      <article className="panel">
        <p className="text-secondary mb-0">Cargando perfil...</p>
      </article>
    )
  }

  if (!perfil) {
    return (
      <article className="panel">
        <p className="text-secondary mb-0">No se encontró información del perfil.</p>
      </article>
    )
  }

  const usoPlan = perfil.usoPlan || {}
  const actividadCliente = perfil.actividadCliente || {}
  const proximoEntrenamiento = actividadCliente.proximoEntrenamiento
  const ultimoEntrenamiento = actividadCliente.ultimoEntrenamiento

  return (
    <section className="dashboard-stack">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Perfil</p>
          <h1>Mi perfil</h1>
          <p className="text-secondary">
            {perfil.rol === "entrenador" ? "Datos de cuenta, foto y plan actual." : "Datos de cuenta, foto y actividad reciente."}
          </p>
        </div>
      </header>

      <article className="panel perfil-panel">
        <div className="perfil-header">
          {perfil.fotoPerfil ? (
            <img className="perfil-avatar" src={perfil.fotoPerfil} alt="Foto de perfil" />
          ) : (
            <div className="perfil-avatar perfil-avatar-default">
              <span>{perfil.nombre?.charAt(0)?.toUpperCase() || "U"}</span>
            </div>
          )}

          <div>
            <h2>{perfil.nombre}</h2>
            <p className="text-secondary mb-1">{perfil.email}</p>
            <span className="badge text-bg-light">{perfil.rol}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(procesarForm)}>
          <div className="mb-3">
            <label htmlFor="imagenPerfil" className="form-label">Foto de perfil</label>
            <input id="imagenPerfil" type="file" className="form-control" accept="image/*" {...register("imagen")} />
            {errors.imagen && <span className="error">{errors.imagen.message}</span>}
          </div>

          <div className="item-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || !imagenSeleccionada?.length}>
              {isSubmitting ? "Guardando..." : "Cambiar foto"}
            </button>

            {perfil.fotoPerfil && (
              <button type="button" className="btn btn-outline-secondary" onClick={quitarFoto}>
                Quitar foto
              </button>
            )}
          </div>
        </form>
      </article>

      {perfil.rol === "cliente" && (
        <section className="perfil-entrenamientos-grid">
          <article className="panel perfil-entrenamiento-card">
            <span className="text-secondary">Próximo entrenamiento</span>
            {proximoEntrenamiento ? (
              <>
                <h2>{proximoEntrenamiento.entrenamiento?.titulo}</h2>
                <p>{new Date(proximoEntrenamiento.entrenamiento?.fecha).toLocaleString("es-UY")}</p>
                <p className="text-secondary mb-0">Entrenador: {proximoEntrenamiento.entrenamiento?.creadoPor?.nombre || "Sin entrenador"}</p>
              </>
            ) : (
              <p className="text-secondary mb-0">No tenés entrenamientos próximos.</p>
            )}
          </article>

          <article className="panel perfil-entrenamiento-card">
            <span className="text-secondary">Último entrenamiento realizado</span>
            {ultimoEntrenamiento ? (
              <>
                <h2>{ultimoEntrenamiento.entrenamiento?.titulo}</h2>
                <p>{new Date(ultimoEntrenamiento.entrenamiento?.fecha).toLocaleString("es-UY")}</p>
                <p className="text-secondary mb-0">Entrenador: {ultimoEntrenamiento.entrenamiento?.creadoPor?.nombre || "Sin entrenador"}</p>
              </>
            ) : (
              <p className="text-secondary mb-0">Todavía no tenes entrenamientos realizados.</p>
            )}
          </article>
        </section>
      )}

      {perfil.rol === "entrenador" && (
        <article className="panel">
          <div className="section-title">
            <div>
              <h2>Plan actual</h2>
              <p className="text-secondary mb-0">Uso del límite de entrenamientos creados.</p>
            </div>
            <span className="badge text-bg-success">{perfil.plan}</span>
          </div>

          <p><strong>Entrenamientos creados:</strong> {usoPlan.entrenamientosCreados}</p>
          <p><strong>Entrenamientos restantes:</strong> {usoPlan.limitePlan ? usoPlan.entrenamientosRestantes : "Sin límite"}</p>

          <div className="progress mb-3" role="progressbar" aria-label="Uso del plan" aria-valuenow={usoPlan.porcentajeUso} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-bar" style={{ width: `${usoPlan.porcentajeUso}%` }}>
              {usoPlan.limitePlan ? `${Math.round(usoPlan.porcentajeUso)}%` : "Premium"}
            </div>
          </div>

          {perfil.plan === "plus" && (
            <button type="button" className="btn btn-outline-primary" onClick={cambiarPlan}>
              Cambiar a premium
            </button>
          )}
        </article>
      )}
    </section>
  )
}

export default PerfilUsuario


