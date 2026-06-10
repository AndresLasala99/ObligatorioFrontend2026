import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"
import { setInscripciones as setInscripcionesStore } from "../../features/inscripciones/inscripciones.slice.js"

const MisInscripciones = () => {
  const dispatch = useDispatch()
  const [inscripciones, setInscripciones] = useState([])
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
          tipo: "activas",
        },
      })

      dispatch(setInscripcionesStore(res.data.resultado.inscripciones))
      setInscripciones(res.data.resultado.inscripciones)
      setPaginacion({
        page: res.data.resultado.page,
        totalPages: res.data.resultado.totalPages,
        cantidadInscripciones: res.data.resultado.cantidadInscripciones,
      })
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudieron obtener las inscripciones."
        toast.error(mensaje)
      }
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    obtenerInscripciones()
  }, [])

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

  const cancelarInscripcion = async (idEntrenamiento) => {
    const confirmar = window.confirm("¿Seguro que querés cancelar esta inscripción?")

    if (!confirmar) return

    try {
      await api.delete(`/inscripciones/entrenamiento/${idEntrenamiento}`)
      toast.success("Inscripcion cancelada correctamente.")
      obtenerInscripciones(paginacion.page)
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo cancelar la inscripcion."
        toast.error(mensaje)
      }
    }
  }

  return (
    <article className="panel">
      <div className="section-title">
        <div>
          <h2>Mis inscripciones</h2>
          <p className="text-secondary">Entrenamientos próximos en los que estás inscripto.</p>
        </div>
      </div>

      {cargando && <p className="text-secondary">Cargando inscripciones...</p>}

      {!cargando && inscripciones.length === 0 && (
        <p className="text-secondary">No tenés inscripciones activas.</p>
      )}

      <div className="training-list">
        {inscripciones.map((inscripcion) => (
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
            <div className="item-actions">
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => cancelarInscripcion(inscripcion.entrenamiento?._id)}>
                Cancelar
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
          Página {paginacion.page} de {paginacion.totalPages || 1} - {paginacion.cantidadInscripciones} inscripciones
        </span>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={paginaSiguiente} disabled={paginacion.page >= paginacion.totalPages}>
          Siguiente
        </button>
      </div>
    </article>
  )
}

export default MisInscripciones



