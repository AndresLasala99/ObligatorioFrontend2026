import { Link, Outlet, useLocation } from "react-router"
import logo from "../assets/logo.png"

const ContainerPage = () => {
  const location = useLocation()
  const estaEnDashboard = location.pathname.startsWith("/dashboard")

  return (
    <>
      <header className={`main-header ${estaEnDashboard ? "dashboard-main-header" : ""}`}>
        <div className="header-content">
          <Link to="/" className="app-logo">
            <img src={logo} alt="Leg Day Never" />
            <span>Leg Day Never</span>
          </Link>
        </div>
      </header>

      <Outlet />
    </>
  )
}

export default ContainerPage
