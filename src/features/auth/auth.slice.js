import { createSlice } from "@reduxjs/toolkit"

const usuarioGuardado = localStorage.getItem("usuario")
const tokenGuardado = localStorage.getItem("token")

const initialState = {
  usuario: usuarioGuardado ? JSON.parse(usuarioGuardado) : null,
  token: tokenGuardado || null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredenciales: (state, action) => {
      state.usuario = action.payload.usuario
      state.token = action.payload.token

      localStorage.setItem("usuario", JSON.stringify(action.payload.usuario))
      localStorage.setItem("token", action.payload.token)
      localStorage.removeItem("cerrandoSesion")
    },
    actualizarUsuario: (state, action) => {
      state.usuario = action.payload

      localStorage.setItem("usuario", JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.usuario = null
      state.token = null

      localStorage.setItem("cerrandoSesion", "true")
      localStorage.removeItem("usuario")
      localStorage.removeItem("token")
    },
  },
})

export const { setCredenciales, actualizarUsuario, logout } = authSlice.actions
export default authSlice.reducer
