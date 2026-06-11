import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"
import { mostrarCrearEntrenamiento, mostrarDetalleEntrenamiento } from "../../features/dashboard/dashboard.slice.js"
import { setEntrenamientos } from "../../features/entrenamientos/entrenamientos.slice.js"
import { setCategorias } from "../../features/categorias/categorias.slice.js"

const ListadoEntrenamientos = () => {
  const dispatch = useDispatch()
  const usuario = useSelector((state) => state.auth.usuario)
  const entrenamientos = useSelector((state) => state.entrenamientos.entrenamientos)
  const categorias = useSelector((state) => state.categorias.categorias)
  const [cargando, setCargando] = useState(false)
  const [entrenadores, setEntrenadores] = useState([])
  const [filtros, setFiltros] = useState({
    titulo: "",
    nivel: "",
    categoria: "",
    entrenador: "",
  })
  const [paginacion, setPaginacion] = useState({
    page: 1,
    totalPages: 1,
    cantidadEntrenamientos: 0,
  })

  const obtenerEntrenamientos = async (filtrosActuales = filtros, página = 1) => {
    try {
      setCargando(true)

      if (usuario?.rol === "entrenador") {
        const params = {
          page: página,
          limit: 5,
          tipo: "proximos",
        }

        if (filtrosActuales.titulo) params.titulo = filtrosActuales.titulo
        if (filtrosActuales.nivel) params.nivel = filtrosActuales.nivel
        if (filtrosActuales.categoria) params.categoria = filtrosActuales.categoria

        const res = await api.get("/entrenamientos/mis-entrenamientos", { params })
        dispatch(setEntrenamientos(res.data.entrenamientos))
        setPaginacion({
          page: res.data.page,
          totalPages: res.data.totalPages,
          cantidadEntrenamientos: res.data.cantidadEntrenamientos,
        })
        return
      }

      const params = {
        page: página,
        limit: 3,
        disponibles: "true",
      }

      if (filtrosActuales.titulo) params.titulo = filtrosActuales.titulo
      if (filtrosActuales.nivel) params.nivel = filtrosActuales.nivel
      if (filtrosActuales.categoria) params.categoria = filtrosActuales.categoria
      if (filtrosActuales.entrenador) params.entrenador = filtrosActuales.entrenador

      const res = await api.get("/entrenamientos", { params })
      dispatch(setEntrenamientos(res.data.entrenamientos))
      setPaginacion({
        page: res.data.page,
        totalPages: res.data.totalPages,
        cantidadEntrenamientos: res.data.cantidadEntrenamientos,
      })
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudieron obtener los entrenamientos."
        toast.error(mensaje)
      }
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    obtenerEntrenamientos()
  }, [usuario?.rol])

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const res = await api.get("/categorias", {
          params: {
            limit: 100,
          },
        })
        dispatch(setCategorias(res.data.resultado.categorias))
      } catch (error) {
        if (debeMostrarError(error)) {
          const mensaje = error.response?.data?.message || "No se pudieron obtener las categorías."
          toast.error(mensaje)
        }
      }
    }

    obtenerCategorias()
  }, [dispatch])

  useEffect(() => {
    const obtenerEntrenadores = async () => {
      if (usuario?.rol !== "cliente") return

      try {
        const res = await api.get("/usuarios/entrenadores")
        setEntrenadores(res.data.entrenadores)
      } catch (error) {
        if (debeMostrarError(error)) {
          const mensaje = error.response?.data?.message || "No se pudieron obtener los entrenadores."
          toast.error(mensaje)
        }
      }
    }

    obtenerEntrenadores()
  }, [usuario?.rol])

  const cambiarFiltro = (event) => {
    setFiltros({
      ...filtros,
      [event.target.name]: event.target.value,
    })
  }

  const filtrarEntrenamientos = (event) => {
    event.preventDefault()
    obtenerEntrenamientos(filtros, 1)
  }

  const limpiarFiltros = () => {
    const filtrosLimpios = { titulo: "", nivel: "", categoria: "", entrenador: "" }
    setFiltros(filtrosLimpios)
    obtenerEntrenamientos(filtrosLimpios, 1)
  }

  const paginaAnterior = () => {
    if (paginacion.page > 1) {
      obtenerEntrenamientos(filtros, paginacion.page - 1)
    }
  }

  const paginaSiguiente = () => {
    if (paginacion.page < paginacion.totalPages) {
      obtenerEntrenamientos(filtros, paginacion.page + 1)
    }
  }

  const verDetalle = async (id) => {
    try {
      const res = await api.get(`/entrenamientos/${id}`)
      dispatch(mostrarDetalleEntrenamiento(res.data.entrenamientoBuscado))
    } catch (error) {
      const mensaje = error.response?.data?.message || "No se pudo obtener el entrenamiento."
      toast.error(mensaje)
    }
  }

  return (
    <article id="entrenamientos" className="panel main-panel">
      <div className="section-title">
        <div>
          <h2>{usuario?.rol === "entrenador" ? "Próximos entrenamientos" : "Entrenamientos"}</h2>
          <p className="text-secondary">
            {usuario?.rol === "entrenador" ? "Gestiona tus entrenamientos publicados y crea nuevas propuestas para tus alumnos." : "Explora los entrenamientos disponibles y encontra el que mejor se adapte a vos."}
          </p>
        </div>
        {usuario?.rol === "entrenador" && (
          <button type="button" className="btn btn-primary" onClick={() => dispatch(mostrarCrearEntrenamiento())}>
            Nuevo entrenamiento
          </button>
        )}
      </div>

      <form className="filters-form" onSubmit={filtrarEntrenamientos}>
        <input className="form-control" type="text" name="titulo" placeholder="Buscar por título" value={filtros.titulo} onChange={cambiarFiltro} />
        {usuario?.rol === "cliente" && (
          <select className="form-select" name="entrenador" value={filtros.entrenador} onChange={cambiarFiltro}>
            <option value="">Todos los entrenadores</option>
            {entrenadores.map((entrenador) => (
              <option value={entrenador._id} key={entrenador._id}>{entrenador.nombre}</option>
            ))}
          </select>
        )}
        <select className="form-select" name="nivel" value={filtros.nivel} onChange={cambiarFiltro}>
          <option value="">Todos los niveles</option>
          <option value="principiante">principiante</option>
          <option value="intermedio">intermedio</option>
          <option value="avanzado">avanzado</option>
        </select>
        <select className="form-select" name="categoria" value={filtros.categoria} onChange={cambiarFiltro}>
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option value={categoria._id} key={categoria._id}>{categoria.nombre}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Filtrar</button>
        <button type="button" className="btn btn-outline-secondary" onClick={limpiarFiltros}>Limpiar</button>
      </form>

      {cargando && <p className="text-secondary">Cargando entrenamientos...</p>}

      {!cargando && entrenamientos.length === 0 && (
        <p className="text-secondary">No hay entrenamientos para mostrar.</p>
      )}

      <div className="training-list">
        {entrenamientos.map((entrenamiento) => (
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
              <p>Quedan {entrenamiento.cuposDisponibles ?? 0} cupos</p>
              <p>Creado por: {entrenamiento.creadoPor?.nombre || "Sin entrenador"}</p>
              <p>{new Date(entrenamiento.fecha).toLocaleString("es-UY")}</p>
            </div>
            <div className="item-actions">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => verDetalle(entrenamiento._id)}>Ver detalle</button>
            </div>
          </article>
        ))}
      </div>

      {usuario?.rol === "cliente" ? (
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
      ) : (
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
      )}
    </article>
  )
}

export default ListadoEntrenamientos


