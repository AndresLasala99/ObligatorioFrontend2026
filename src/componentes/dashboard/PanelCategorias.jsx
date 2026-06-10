import CategoriaForm from "./CategoriaForm.jsx"
import CategoriasList from "./CategoriasList.jsx"

const PanelCategorias = () => {
  return (
    <article id="categorias" className="panel">
      <div className="section-title">
        <div>
          <h2>Categorías</h2>
          <p className="text-secondary">Organiza las categorías disponibles para tus entrenamientos.</p>
        </div>
      </div>

      <CategoriaForm />
      <CategoriasList />
    </article>
  )
}

export default PanelCategorias
