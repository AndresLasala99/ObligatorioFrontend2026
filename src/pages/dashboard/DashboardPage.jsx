import { useSelector } from "react-redux"
import BarraLateral from "../../componentes/dashboard/BarraLateral.jsx"
import CuentaUsuario from "../../componentes/dashboard/CuentaUsuario.jsx"
import DashboardCliente from "../../componentes/dashboard/DashboardCliente.jsx"
import DashboardEntrenador from "../../componentes/dashboard/DashboardEntrenador.jsx"
import DetalleCategoria from "../../componentes/dashboard/DetalleCategoria.jsx"
import DetalleEntrenamiento from "../../componentes/dashboard/DetalleEntrenamiento.jsx"
import FormularioEditarCategoria from "../../componentes/dashboard/FormularioEditarCategoria.jsx"
import FormularioEditarEntrenamiento from "../../componentes/dashboard/FormularioEditarEntrenamiento.jsx"
import HistorialInscripciones from "../../componentes/dashboard/HistorialInscripciones.jsx"
import ListadoEntrenamientos from "../../componentes/dashboard/ListadoEntrenamientos.jsx"
import FormularioEntrenamiento from "../../componentes/dashboard/FormularioEntrenamiento.jsx"
import HistorialEntrenamientos from "../../componentes/dashboard/HistorialEntrenamientos.jsx"
import MisInscripciones from "../../componentes/dashboard/MisInscripciones.jsx"
import PanelCategorias from "../../componentes/dashboard/PanelCategorias.jsx"
import PerfilUsuario from "../../componentes/dashboard/PerfilUsuario.jsx"

const DashboardPage = () => {
  const vistaDashboard = useSelector((state) => state.dashboard.vistaDashboard)
  const usuario = useSelector((state) => state.auth.usuario)

  return (
    <section className="dashboard-page">
      <BarraLateral />

      <main className="dashboard-main">
        {vistaDashboard === "principal" && (
          usuario?.rol === "cliente" ? (
            <DashboardCliente />
          ) : (
            <DashboardEntrenador />
          )
        )}

        {vistaDashboard === "entrenamientos" && (
          usuario?.rol === "cliente" ? (
            <ListadoEntrenamientos />
          ) : (
            <section className="content-grid">
              <ListadoEntrenamientos />
              <FormularioEntrenamiento />
            </section>
          )
        )}

        {vistaDashboard === "categorias" && <PanelCategorias />}

        {vistaDashboard === "detalleCategoria" && <DetalleCategoria />}

        {vistaDashboard === "editarCategoria" && <FormularioEditarCategoria />}

        {vistaDashboard === "misInscripciones" && <MisInscripciones />}

        {vistaDashboard === "historial" && <HistorialInscripciones />}

        {vistaDashboard === "historialEntrenamientos" && <HistorialEntrenamientos />}

        {vistaDashboard === "perfil" && <PerfilUsuario />}

        {vistaDashboard === "cuenta" && <CuentaUsuario />}

        {vistaDashboard === "detalleEntrenamiento" && <DetalleEntrenamiento />}

        {vistaDashboard === "editarEntrenamiento" && <FormularioEditarEntrenamiento />}
      </main>
    </section>
  )
}

export default DashboardPage
