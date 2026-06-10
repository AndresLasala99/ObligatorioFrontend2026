import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/v1"

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const debeMostrarError = (error) => {
  const cerrandoSesion = localStorage.getItem("cerrandoSesion") === "true"
  const status = error.response?.status

  return !(cerrandoSesion && (status === 401 || status === 403))
}

export default api
