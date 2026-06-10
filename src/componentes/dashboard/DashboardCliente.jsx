import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"

const DashboardCliente = () => {
  const usuario = useSelector((state) => state.auth.usuario)
  const [estadisticas, setEstadisticas] = useState({
    cantidadEntrenamientosDisponibles: 0,
    cantidadInscripcionesActivas: 0,
    cantidadEntrenamientosRealizados: 0,
    proximoEntrenamiento: null,
    categoriasGrafica: [],
  })

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await api.get("/inscripciones/mis-estadisticas")
        setEstadisticas(res.data)
      } catch (error) {
        if (debeMostrarError(error)) {
          const mensaje = error.response?.data?.message || "No se pudieron obtener los datos del dashboard."
          toast.error(mensaje)
        }
      }
    }

    obtenerDatos()
  }, [])

  const proximoEntrenamiento = estadisticas.proximoEntrenamiento
  const categoriasGrafica = estadisticas.categoriasGrafica
  const mayorCantidadCategoria = categoriasGrafica[0]?.cantidad || 0

  return (
    <>
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Hola, {usuario?.nombre}</h1>
          <p className="text-secondary">Seguimiento de tus inscripciones y entrenamientos.</p>
        </div>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Inscripciones activas</span>
          <strong>{estadisticas.cantidadInscripcionesActivas}</strong>
          <p>Entrenamientos próximos</p>
        </article>
        <article className="stat-card">
          <span>Disponibles</span>
          <strong>{estadisticas.cantidadEntrenamientosDisponibles}</strong>
          <p>Entrenamientos publicados</p>
        </article>
        <article className="stat-card">
          <span>Realizados</span>
          <strong>{estadisticas.cantidadEntrenamientosRealizados}</strong>
          <p>Entrenamientos finalizados</p>
        </article>
      </section>

      <section className="cliente-dashboard-grid">
        <article className="panel">
          <h2>Próximo entrenamiento</h2>
          {proximoEntrenamiento ? (
            <>
              <h3>{proximoEntrenamiento.entrenamiento?.titulo}</h3>
              <p className="text-secondary">{proximoEntrenamiento.entrenamiento?.descripcion}</p>
              <p><strong>Fecha:</strong> {new Date(proximoEntrenamiento.entrenamiento?.fecha).toLocaleString("es-UY")}</p>
            </>
          ) : (
            <p className="text-secondary mb-0">Todavía no tenés entrenamientos próximos.</p>
          )}
        </article>

        <article className="panel">
          <div className="section-title">
            <div>
              <h2>Top 3 categorías elegidas</h2>
              <p className="text-secondary mb-0">Basado en tus inscripciones activas y entrenamientos realizados.</p>
            </div>
          </div>

          {categoriasGrafica.length === 0 ? (
            <p className="text-secondary mb-0">Todavía no hay datos para mostrar.</p>
          ) : (
            <div className="category-chart">
              {categoriasGrafica.map((categoria) => (
                <div className="category-chart-row" key={categoria.nombre}>
                  <div className="category-chart-info">
                    <span>{categoria.nombre}</span>
                    <strong>{categoria.cantidad}</strong>
                  </div>
                  <div className="category-chart-track">
                    <div className="category-chart-bar" style={{ width: `${(categoria.cantidad * 100) / mayorCantidadCategoria}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </>
  )
}

export default DashboardCliente
