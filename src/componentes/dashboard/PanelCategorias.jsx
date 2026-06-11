import { useDispatch } from "react-redux"
import { mostrarCrearCategoria } from "../../features/dashboard/dashboard.slice.js"
import CategoriasList from "./CategoriasList.jsx"

const PanelCategorias = () => {
  const dispatch = useDispatch()

  return (
    <article id="categorias" className="panel">
      <div className="section-title">
        <div>
          <h2>Categorías</h2>
          <p className="text-secondary">Organiza las categorías disponibles para tus entrenamientos.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => dispatch(mostrarCrearCategoria())}>
          Nueva categoría
        </button>
      </div>

      <CategoriasList />
    </article>
  )
}

export default PanelCategorias
