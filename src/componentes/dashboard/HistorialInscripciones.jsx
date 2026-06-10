import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"
import { setInscripciones } from "../../features/inscripciones/inscripciones.slice.js"

const HistorialInscripciones = () => {
  const dispatch = useDispatch()
  const [historial, setHistorial] = useState([])
  const [cargando, setCargando] = useState(false)
  const [paginacion, setPaginacion] = useState({
    page: 1,
    totalPages: 1,
    cantidadInscripciones: 0,
  })

  const obtenerInscripciones = async (página = 1) => {
    try {
      setCargando(true)
      const res = await api.get("/inscripciones/misinscripciones", {
        params: {
          page: página,
          limit: 3,
          tipo: "historial",
        },
      })

      dispatch(setInscripciones(res.data.resultado.inscripciones))
      setHistorial(res.data.resultado.inscripciones)
      setPaginacion({
        page: res.data.resultado.page,
        totalPages: res.data.resultado.totalPages,
        cantidadInscripciones: res.data.resultado.cantidadInscripciones,
      })
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo obtener el historial."
        toast.error(mensaje)
      }
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    obtenerInscripciones()
  }, [dispatch])

  const paginaAnterior = () => {
    if (paginacion.page > 1) {
      obtenerInscripciones(paginacion.page - 1)
    }
  }

  const paginaSiguiente = () => {
    if (paginacion.page < paginacion.totalPages) {
      obtenerInscripciones(paginacion.page + 1)
    }
  }

  return (
    <article className="panel">
      <div className="section-title">
        <div>
          <h2>Historial</h2>
          <p className="text-secondary">Entrenamientos finalizados o inscripciones canceladas.</p>
        </div>
      </div>

      {cargando && <p className="text-secondary">Cargando historial...</p>}

      {!cargando && historial.length === 0 && (
        <p className="text-secondary">Todavía no hay historial para mostrar.</p>
      )}

      <div className="training-list">
        {historial.map((inscripcion) => (
          <article className="training-item" key={inscripcion._id}>
            {inscripcion.entrenamiento?.imagen && (
              <img className="training-image" src={inscripcion.entrenamiento.imagen} alt={inscripcion.entrenamiento.titulo} />
            )}
            <div>
              <h3>{inscripcion.entrenamiento?.titulo}</h3>
              <p>{inscripcion.entrenamiento?.descripcion}</p>
              <p>
                {inscripcion.entrenamiento?.nivel} - {inscripcion.entrenamiento?.duracionMinutos} minutos - {inscripcion.entrenamiento?.categoria?.nombre || "Sin categoría"}
              </p>
              <p>Creado por: {inscripcion.entrenamiento?.creadoPor?.nombre || "Sin entrenador"}</p>
              <p>{new Date(inscripcion.entrenamiento?.fecha).toLocaleString("es-UY")}</p>
            </div>
            <span className="badge text-bg-light">
              {inscripcion.estadoVisual}
            </span>
          </article>
        ))}
      </div>

      <div className="pagination-actions">
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={paginaAnterior} disabled={paginacion.page <= 1}>
          Anterior
        </button>
        <span className="text-secondary">
          Página {paginacion.page} de {paginacion.totalPages || 1} - {paginacion.cantidadInscripciones} inscripciones
        </span>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={paginaSiguiente} disabled={paginacion.page >= paginacion.totalPages}>
          Siguiente
        </button>
      </div>
    </article>
  )
}

export default HistorialInscripciones

