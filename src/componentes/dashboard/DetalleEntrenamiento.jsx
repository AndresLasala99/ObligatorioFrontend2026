import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"
import { mostrarEditarEntrenamiento, mostrarEntrenamientos, mostrarHistorialEntrenamientos, mostrarPrincipal } from "../../features/dashboard/dashboard.slice.js"
import { eliminarEntrenamiento } from "../../features/entrenamientos/entrenamientos.slice.js"
import { agregarInscripcion } from "../../features/inscripciones/inscripciones.slice.js"

const DetalleEntrenamiento = () => {
  const dispatch = useDispatch()
  const entrenamiento = useSelector((state) => state.dashboard.entrenamientoSeleccionado)
  const usuario = useSelector((state) => state.auth.usuario)
  const detalleRef = useRef(null)

  useEffect(() => {
    if (entrenamiento && detalleRef.current) {
      detalleRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [entrenamiento])

  if (!entrenamiento) {
    return null
  }

  const cuposDisponibles = entrenamiento.cuposDisponibles ?? 0
  const sinCupos = entrenamiento.sinCupos

  const volver = () => {
    if (usuario?.rol === "entrenador" && entrenamiento.finalizado) {
      dispatch(mostrarHistorialEntrenamientos())
      return
    }

    dispatch(mostrarEntrenamientos())
  }

  const eliminar = async () => {
    const confirmar = window.confirm("¿Seguro que querés eliminar este entrenamiento?")

    if (!confirmar) return

    try {
      await api.delete(`/entrenamientos/${entrenamiento._id}`)
      dispatch(eliminarEntrenamiento(entrenamiento._id))
      dispatch(mostrarPrincipal())
      toast.success("Entrenamiento eliminado correctamente.")
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo eliminar el entrenamiento."
        toast.error(mensaje)
      }
    }
  }

  const inscribirse = async () => {
    try {
      const res = await api.post("/inscripciones", {
        idEntrenamiento: entrenamiento._id,
      })

      dispatch(agregarInscripcion(res.data.inscripcion))
      toast.success("Inscripción realizada correctamente.")
      dispatch(mostrarEntrenamientos())
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo realizar la inscripción."
        toast.error(mensaje)
      }
    }
  }

  return (
    <article className="panel detalle-entrenamiento" ref={detalleRef}>
      <div className="section-title">
        <div>
          <h2>Detalle del entrenamiento</h2>
          <p className="text-secondary">Información completa del entrenamiento seleccionado.</p>
        </div>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={volver}>
          Volver
        </button>
      </div>

      {entrenamiento.imagen && (
        <img className="detalle-entrenamiento-img" src={entrenamiento.imagen} alt={entrenamiento.titulo} />
      )}

      <h3>{entrenamiento.titulo}</h3>
      <p>{entrenamiento.descripcion}</p>
      <p><strong>Nivel:</strong> {entrenamiento.nivel}</p>
      <p><strong>Duración:</strong> {entrenamiento.duracionMinutos} minutos</p>
      <p><strong>Fecha:</strong> {new Date(entrenamiento.fecha).toLocaleString("es-UY")}</p>
      <p><strong>Categoría:</strong> {entrenamiento.categoria?.nombre || "Sin categoría"}</p>
      <p><strong>Creado por:</strong> {entrenamiento.creadoPor?.nombre || "Sin entrenador"}</p>
      <p><strong>Cupos:</strong> {sinCupos ? "Sin cupos disponibles" : `Quedan ${cuposDisponibles} cupos`}</p>

      {usuario?.rol === "entrenador" && (
        <div className="inscriptos-box">
          <h4>Alumnos inscriptos ({entrenamiento.inscriptos?.length || 0})</h4>

          {entrenamiento.inscriptos?.length > 0 ? (
            <div className="training-list">
              {entrenamiento.inscriptos.map((alumno) => (
                <article className="inscripto-item" key={alumno._id}>
                  <strong>{alumno.nombre}</strong>
                  <span className="text-secondary">{alumno.email}</span>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-secondary">Todavía no hay alumnos inscriptos.</p>
          )}
        </div>
      )}

      {usuario?.rol === "cliente" && (
        <div className="item-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={inscribirse} disabled={sinCupos}>
            Inscribirse
          </button>
        </div>
      )}

      {usuario?.rol === "entrenador" && !entrenamiento.finalizado && (
        <div className="item-actions">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => dispatch(mostrarEditarEntrenamiento(entrenamiento))}>Editar</button>
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={eliminar}>Eliminar</button>
        </div>
      )}
    </article>
  )
}

export default DetalleEntrenamiento


