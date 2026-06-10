import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"

const DashboardEntrenador = () => {
  const usuario = useSelector((state) => state.auth.usuario)
  const [estadisticas, setEstadisticas] = useState({
    cantidadEntrenamientos: 0,
    entrenamientoMasInscriptos: null,
    promedioAlumnos: 0,
    alumnoMasConstante: null,
    alumnoMasInactivo: null,
    entrenamientosPorNivel: [],
    inscriptosPorEntrenamiento: [],
  })
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const obtenerEstadisticas = async () => {
      try {
        setCargando(true)
        const res = await api.get("/entrenamientos/mis-estadisticas")
        setEstadisticas(res.data)
      } catch (error) {
        if (debeMostrarError(error)) {
          const mensaje = error.response?.data?.message || "No se pudieron obtener tus estadísticas."
          toast.error(mensaje)
        }
      } finally {
        setCargando(false)
      }
    }

    obtenerEstadisticas()
  }, [])

  const entrenamientoMasInscriptos = estadisticas.entrenamientoMasInscriptos
  const alumnoMasConstante = estadisticas.alumnoMasConstante
  const alumnoMasInactivo = estadisticas.alumnoMasInactivo
  const mayorInscriptos = Math.max(...estadisticas.inscriptosPorEntrenamiento.map((entrenamiento) => entrenamiento.cantidad), 0)
  const totalNiveles = estadisticas.entrenamientosPorNivel.reduce((total, nivel) => total + nivel.cantidad, 0)
  const coloresNivel = ["#ff2323", "#f7b731", "#5d8cff"]

  const obtenerFondoNiveles = () => {
    if (totalNiveles === 0) return "rgba(255, 255, 255, 0.08)"

    let inicio = 0
    const partes = estadisticas.entrenamientosPorNivel.map((nivel, index) => {
      const porcentaje = (nivel.cantidad * 100) / totalNiveles
      const fin = inicio + porcentaje
      const parte = `${coloresNivel[index]} ${inicio}% ${fin}%`
      inicio = fin
      return parte
    })

    return `conic-gradient(${partes.join(", ")})`
  }

  const renderAlumnoAvatar = (alumno) => {
    if (alumno.fotoPerfil) {
      return <img className="dashboard-student-avatar" src={alumno.fotoPerfil} alt={alumno.nombre} />
    }

    return (
      <div className="dashboard-student-avatar dashboard-student-avatar-default">
        <span>{alumno.nombre?.charAt(0)?.toUpperCase() || "A"}</span>
      </div>
    )
  }

  return (
    <>
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Hola, {usuario?.nombre}</h1>
          <p className="text-secondary">Seguimiento de tus entrenamientos, alumnos y estadísticas.</p>
        </div>
      </header>

      {cargando && <p className="text-secondary">Cargando estadísticas...</p>}

      <section className="stats-grid">
        <article className="stat-card">
          <span>Mis entrenamientos</span>
          <strong>{estadisticas.cantidadEntrenamientos}</strong>
          <p>Entrenamientos creados</p>
        </article>
        <article className="stat-card">
          <span>Más inscriptos</span>
          <strong>{entrenamientoMasInscriptos?.inscriptos?.length || 0}</strong>
          <p>{entrenamientoMasInscriptos?.titulo || "Sin datos"}</p>
        </article>
        <article className="stat-card">
          <span>Promedio alumnos</span>
          <strong>{estadisticas.promedioAlumnos}</strong>
          <p>Por entrenamiento</p>
        </article>
      </section>

      <section className="trainer-stats-grid">
        <article className="panel">
          <h2>Entrenamientos por nivel</h2>
          {estadisticas.entrenamientosPorNivel.length === 0 || totalNiveles === 0 ? (
            <p className="text-secondary mb-0">Todavía no hay niveles para mostrar.</p>
          ) : (
            <div className="donut-chart-box">
              <div className="donut-chart" style={{ background: obtenerFondoNiveles() }}>
                <div>
                  <strong>{totalNiveles}</strong>
                  <span>Total</span>
                </div>
              </div>

              <div className="donut-legend">
                {estadisticas.entrenamientosPorNivel.map((nivel, index) => (
                  <div className="donut-legend-item" key={nivel.nivel}>
                    <span style={{ backgroundColor: coloresNivel[index] }} />
                    <p>{nivel.nivel}</p>
                    <strong>{nivel.cantidad}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <article className="panel">
          <h2>Top 5 más inscriptos</h2>
          {estadisticas.inscriptosPorEntrenamiento.length === 0 ? (
            <p className="text-secondary mb-0">Todavía no hay entrenamientos para mostrar.</p>
          ) : (
            <div className="column-chart">
              {estadisticas.inscriptosPorEntrenamiento.map((entrenamiento) => (
                <div className="column-chart-item" key={entrenamiento.titulo}>
                  <strong>{entrenamiento.cantidad}</strong>
                  <div className="column-chart-track">
                    <div className="column-chart-bar" style={{ height: `${mayorInscriptos > 0 ? (entrenamiento.cantidad * 100) / mayorInscriptos : 0}%` }} />
                  </div>
                  <span>{entrenamiento.titulo}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="trainer-stats-grid">
        <article className="panel">
          <h2>Alumno más constante</h2>
          {alumnoMasConstante ? (
            <>
              <div className="dashboard-student">
                {renderAlumnoAvatar(alumnoMasConstante)}
                <div>
                  <h3>{alumnoMasConstante.nombre}</h3>
                  <p className="text-secondary">{alumnoMasConstante.email}</p>
                </div>
              </div>
              <p><strong>Inscripciones:</strong> {alumnoMasConstante.cantidad}</p>
            </>
          ) : (
            <p className="text-secondary mb-0">Todavía no hay alumnos inscriptos.</p>
          )}
        </article>

        <article className="panel">
          <h2>Alumno más inactivo</h2>
          {alumnoMasInactivo ? (
            <>
              <div className="dashboard-student">
                {renderAlumnoAvatar(alumnoMasInactivo)}
                <div>
                  <h3>{alumnoMasInactivo.nombre}</h3>
                  <p className="text-secondary">{alumnoMasInactivo.email}</p>
                </div>
              </div>
              <p><strong>Último entrenamiento:</strong> {new Date(alumnoMasInactivo.ultimaFecha).toLocaleString("es-UY")}</p>
            </>
          ) : (
            <p className="text-secondary mb-0">Todavía no hay datos suficientes.</p>
          )}
        </article>
      </section>
    </>
  )
}

export default DashboardEntrenador


