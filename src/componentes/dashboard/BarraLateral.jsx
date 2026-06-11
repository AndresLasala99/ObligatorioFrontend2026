import { Link, useNavigate } from "react-router"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../features/auth/auth.slice.js"
import { mostrarCategorias, mostrarCuenta, mostrarEntrenamientos, mostrarHistorial, mostrarHistorialEntrenamientos, mostrarMisInscripciones, mostrarMotivacion, mostrarPerfil, mostrarPrincipal } from "../../features/dashboard/dashboard.slice.js"

const BarraLateral = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const vistaDashboard = useSelector((state) => state.dashboard.vistaDashboard)
  const usuario = useSelector((state) => state.auth.usuario)

  const cambiarVista = (accion) => {
    dispatch(accion())
    setMenuAbierto(false)
  }

  const cerrarSesion = () => {
    dispatch(logout())
    navigate("/")
    setTimeout(() => {
      localStorage.removeItem("cerrandoSesion")
    }, 800)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button type="button" className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
          Menú
        </button>
      </div>

      <div className={`sidebar-menu ${menuAbierto ? "open" : ""}`}>
        <nav className="nav flex-column">
          <button type="button" className={`nav-link ${vistaDashboard === "principal" ? "active" : ""}`} onClick={() => cambiarVista(mostrarPrincipal)}>Dashboard</button>
          <button type="button" className={`nav-link ${vistaDashboard === "entrenamientos" || vistaDashboard === "crearEntrenamiento" || vistaDashboard === "detalleEntrenamiento" || vistaDashboard === "editarEntrenamiento" ? "active" : ""}`} onClick={() => cambiarVista(mostrarEntrenamientos)}>
            {usuario?.rol === "entrenador" ? "Próximos entrenamientos" : "Entrenamientos"}
          </button>
          {usuario?.rol === "entrenador" && (
            <>
              <button type="button" className={`nav-link ${vistaDashboard === "historialEntrenamientos" ? "active" : ""}`} onClick={() => cambiarVista(mostrarHistorialEntrenamientos)}>Historial</button>
              <button type="button" className={`nav-link ${vistaDashboard === "categorias" || vistaDashboard === "crearCategoria" || vistaDashboard === "detalleCategoria" || vistaDashboard === "editarCategoria" ? "active" : ""}`} onClick={() => cambiarVista(mostrarCategorias)}>Categorías</button>
            </>
          )}
          {usuario?.rol === "cliente" && (
            <>
              <button type="button" className={`nav-link ${vistaDashboard === "misInscripciones" ? "active" : ""}`} onClick={() => cambiarVista(mostrarMisInscripciones)}>Mis inscripciones</button>
              <button type="button" className={`nav-link ${vistaDashboard === "historial" ? "active" : ""}`} onClick={() => cambiarVista(mostrarHistorial)}>Historial</button>
            </>
          )}
          <button type="button" className={`nav-link ${vistaDashboard === "motivacion" ? "active" : ""}`} onClick={() => cambiarVista(mostrarMotivacion)}>Motivacion</button>
          <button type="button" className={`nav-link ${vistaDashboard === "perfil" ? "active" : ""}`} onClick={() => cambiarVista(mostrarPerfil)}>Perfil</button>
          <button type="button" className={`nav-link ${vistaDashboard === "cuenta" ? "active" : ""}`} onClick={() => cambiarVista(mostrarCuenta)}>Cuenta</button>
        </nav>
        <button type="button" className="logout" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
      <Link className="visually-hidden" to="/">Login</Link>
    </aside>
  )
}

export default BarraLateral
