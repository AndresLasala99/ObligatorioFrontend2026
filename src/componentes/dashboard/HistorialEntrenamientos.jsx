import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"
import { mostrarDetalleEntrenamiento } from "../../features/dashboard/dashboard.slice.js"
import { setEntrenamientos } from "../../features/entrenamientos/entrenamientos.slice.js"

const HistorialEntrenamientos = () => {
  const dispatch = useDispatch()
  const [historial, setHistorial] = useState([])
  const [cargando, setCargando] = useState(false)
  const [paginacion, setPaginacion] = useState({
    page: 1,
    totalPages: 1,
    cantidadEntrenamientos: 0,
  })

  const obtenerHistorial = async (página = 1) => {
    try {
      setCargando(true)
      const res = await api.get("/entrenamientos/mis-entrenamientos", {
        params: {
          page: página,
          limit: 5,
          tipo: "historial",
        },
      })

      dispatch(setEntrenamientos(res.data.entrenamientos))
      setHistorial(res.data.entrenamientos)
      setPaginacion({
        page: res.data.page,
        totalPages: res.data.totalPages,
        cantidadEntrenamientos: res.data.cantidadEntrenamientos,
      })
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo obtener el historial de entrenamientos."
        toast.error(mensaje)
      }
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    obtenerHistorial()
  }, [])

  const paginaAnterior = () => {
    if (paginacion.page > 1) {
      obtenerHistorial(paginacion.page - 1)
    }
  }

  const paginaSiguiente = () => {
    if (paginacion.page < paginacion.totalPages) {
      obtenerHistorial(paginacion.page + 1)
    }
  }

  const verDetalle = async (id) => {
    try {
      const res = await api.get(`/entrenamientos/${id}`)
      dispatch(mostrarDetalleEntrenamiento(res.data.entrenamientoBuscado))
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo obtener el entrenamiento."
        toast.error(mensaje)
      }
    }
  }

  return (
    <article className="panel main-panel">
      <div className="section-title">
        <div>
          <h2>Historial de entrenamientos</h2>
          <p className="text-secondary">Tus entrenamientos finalizados.</p>
        </div>
      </div>

      {cargando && <p className="text-secondary">Cargando historial...</p>}

      {!cargando && historial.length === 0 && (
        <p className="text-secondary">Todavía no hay entrenamientos finalizados.</p>
      )}

      <div className="training-list">
        {historial.map((entrenamiento) => (
          <article className="training-item" key={entrenamiento._id}>
            {entrenamiento.imagen && (
              <img className="training-image" src={entrenamiento.imagen} alt={entrenamiento.titulo} />
            )}
            <div>
              <h3>{entrenamiento.titulo}</h3>
              <p>{entrenamiento.descripcion}</p>
              <p>
                {entrenamiento.nivel} - {entrenamiento.duracionMinutos} minutos - {entrenamiento.categoria?.nombre || "Sin categoría"}
              </p>
              <p>{new Date(entrenamiento.fecha).toLocaleString("es-UY")}</p>
              <p>Alumnos inscriptos: {entrenamiento.inscriptos?.length || 0}</p>
            </div>
            <div className="item-actions">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => verDetalle(entrenamiento._id)}>
                Ver detalle
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="pagination-actions">
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={paginaAnterior} disabled={paginacion.page <= 1}>
          Anterior
        </button>
        <span className="text-secondary">
          Página {paginacion.page} de {paginacion.totalPages || 1} - {paginacion.cantidadEntrenamientos} entrenamientos
        </span>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={paginaSiguiente} disabled={paginacion.page >= paginacion.totalPages}>
          Siguiente
        </button>
      </div>
    </article>
  )
}

export default HistorialEntrenamientos

