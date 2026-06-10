import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"
import { setCategorias } from "../../features/categorias/categorias.slice.js"
import { mostrarDetalleCategoria } from "../../features/dashboard/dashboard.slice.js"

const CategoriasList = () => {
  const dispatch = useDispatch()
  const categorias = useSelector((state) => state.categorias.categorias)
  const [cargando, setCargando] = useState(false)
  const [paginacion, setPaginacion] = useState({
    page: 1,
    totalPages: 1,
    cantidadCategorias: 0,
  })

  const obtenerCategorias = async (pagina = 1) => {
    try {
      setCargando(true)
      const res = await api.get("/categorias", {
        params: {
          page: pagina,
          limit: 4,
        },
      })

      dispatch(setCategorias(res.data.resultado.categorias))
      setPaginacion({
        page: res.data.resultado.page,
        totalPages: res.data.resultado.totalPages,
        cantidadCategorias: res.data.resultado.cantidadCategorias,
      })
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudieron obtener las categorías."
        toast.error(mensaje)
      }
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    obtenerCategorias()
  }, [dispatch])

  const paginaAnterior = () => {
    if (paginacion.page > 1) {
      obtenerCategorias(paginacion.page - 1)
    }
  }

  const paginaSiguiente = () => {
    if (paginacion.page < paginacion.totalPages) {
      obtenerCategorias(paginacion.page + 1)
    }
  }

  if (cargando) {
    return <p className="text-secondary">Cargando categorías...</p>
  }

  if (categorias.length === 0) {
    return <p className="text-secondary">No hay categorías para mostrar.</p>
  }

  const verDetalle = async (id) => {
    try {
      const res = await api.get(`/categorias/${id}`)
      dispatch(mostrarDetalleCategoria(res.data.categoriaBuscada))
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo obtener la categoría."
        toast.error(mensaje)
      }
    }
  }

  return (
    <>
      <div className="category-grid">
        {categorias.map((categoria) => (
          <article className="category-pill" key={categoria._id}>
            {categoria.imagen && (
              <img className="category-image" src={categoria.imagen} alt={categoria.nombre} />
            )}
            <strong>{categoria.nombre}</strong>
            {categoria.descripcion && <small>{categoria.descripcion}</small>}
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => verDetalle(categoria._id)}>
              Ver detalle
            </button>
          </article>
        ))}
      </div>

      <div className="pagination-actions">
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={paginaAnterior} disabled={paginacion.page <= 1}>
          Anterior
        </button>
        <span className="text-secondary">
          Página {paginacion.page} de {paginacion.totalPages || 1} - {paginacion.cantidadCategorias} categorías
        </span>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={paginaSiguiente} disabled={paginacion.page >= paginacion.totalPages}>
          Siguiente
        </button>
      </div>
    </>
  )
}

export default CategoriasList
