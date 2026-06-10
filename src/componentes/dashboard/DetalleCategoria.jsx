import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"
import { eliminarCategoria } from "../../features/categorias/categorias.slice.js"
import { mostrarCategorias, mostrarEditarCategoria } from "../../features/dashboard/dashboard.slice.js"

const DetalleCategoria = () => {
  const dispatch = useDispatch()
  const categoria = useSelector((state) => state.dashboard.categoriaSeleccionada)

  if (!categoria) {
    return null
  }

  const eliminar = async () => {
    const confirmar = window.confirm("¿Seguro que querés eliminar esta categoría?")

    if (!confirmar) return

    try {
      await api.delete(`/categorias/${categoria._id}`)
      dispatch(eliminarCategoria(categoria._id))
      dispatch(mostrarCategorias())
      toast.success("Categoría eliminada correctamente.")
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo eliminar la categoría."
        toast.error(mensaje)
      }
    }
  }

  return (
    <article className="panel">
      <div className="section-title">
        <div>
          <h2>Detalle de categoría</h2>
          <p className="text-secondary">Información completa de la categoría seleccionada.</p>
        </div>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => dispatch(mostrarCategorias())}>
          Volver
        </button>
      </div>

      {categoria.imagen && (
        <img className="detalle-entrenamiento-img" src={categoria.imagen} alt={categoria.nombre} />
      )}

      <h3>{categoria.nombre}</h3>
      {categoria.descripcion && <p>{categoria.descripcion}</p>}

      <div className="item-actions">
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => dispatch(mostrarEditarCategoria(categoria))}>
          Editar
        </button>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={eliminar}>
          Eliminar
        </button>
      </div>
    </article>
  )
}

export default DetalleCategoria


