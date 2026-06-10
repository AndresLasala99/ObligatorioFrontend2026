import { Link } from "react-router"

const NotFoundPage = () => {
  return (
    <section className="not-found-page">
      <div className="not-found-card">
        <p className="eyebrow">Error 404</p>
        <h1>Página no encontrada</h1>
        <p className="text-secondary">La ruta que intentaste abrir no existe.</p>
        <Link className="btn btn-primary" to="/">
          Volver al login
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
