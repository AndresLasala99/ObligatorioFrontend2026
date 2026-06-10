import { BrowserRouter, Route, Routes } from "react-router"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ContainerPage from "./pages/ContainerPage.jsx"
import DashboardPage from "./pages/dashboard/DashboardPage.jsx"
import LoginPage from "./pages/login/LoginPage.jsx"
import RegisterPage from "./pages/register/RegisterPage.jsx"
import NotFoundPage from "./pages/notFound/NotFoundPage.jsx"
import ProtectedRoute from "./app/guards/ProtectedRoute.jsx"
import { store } from "./store/store.js"

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ContainerPage />}>
            <Route index element={<LoginPage />} />
            <Route path="registro" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        theme="colored"
      />
    </Provider>
  )
}

export default App
