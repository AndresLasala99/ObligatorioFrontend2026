import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  vistaDashboard: "principal",
  entrenamientoSeleccionado: null,
  categoriaSeleccionada: null,
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    mostrarPrincipal: (state) => {
      state.vistaDashboard = "principal"
      state.entrenamientoSeleccionado = null
      state.categoriaSeleccionada = null
    },
    mostrarEntrenamientos: (state) => {
      state.vistaDashboard = "entrenamientos"
      state.entrenamientoSeleccionado = null
      state.categoriaSeleccionada = null
    },
    mostrarCategorias: (state) => {
      state.vistaDashboard = "categorias"
      state.entrenamientoSeleccionado = null
      state.categoriaSeleccionada = null
    },
    mostrarPerfil: (state) => {
      state.vistaDashboard = "perfil"
      state.entrenamientoSeleccionado = null
      state.categoriaSeleccionada = null
    },
    mostrarCuenta: (state) => {
      state.vistaDashboard = "cuenta"
      state.entrenamientoSeleccionado = null
      state.categoriaSeleccionada = null
    },
    mostrarMisInscripciones: (state) => {
      state.vistaDashboard = "misInscripciones"
      state.entrenamientoSeleccionado = null
      state.categoriaSeleccionada = null
    },
    mostrarHistorial: (state) => {
      state.vistaDashboard = "historial"
      state.entrenamientoSeleccionado = null
      state.categoriaSeleccionada = null
    },
    mostrarHistorialEntrenamientos: (state) => {
      state.vistaDashboard = "historialEntrenamientos"
      state.entrenamientoSeleccionado = null
      state.categoriaSeleccionada = null
    },
    mostrarDetalleEntrenamiento: (state, action) => {
      state.vistaDashboard = "detalleEntrenamiento"
      state.entrenamientoSeleccionado = action.payload
      state.categoriaSeleccionada = null
    },
    mostrarEditarEntrenamiento: (state, action) => {
      state.vistaDashboard = "editarEntrenamiento"
      state.entrenamientoSeleccionado = action.payload
      state.categoriaSeleccionada = null
    },
    mostrarDetalleCategoria: (state, action) => {
      state.vistaDashboard = "detalleCategoria"
      state.categoriaSeleccionada = action.payload
      state.entrenamientoSeleccionado = null
    },
    mostrarEditarCategoria: (state, action) => {
      state.vistaDashboard = "editarCategoria"
      state.categoriaSeleccionada = action.payload
      state.entrenamientoSeleccionado = null
    },
  },
})

export const {
  mostrarPrincipal,
  mostrarEntrenamientos,
  mostrarCategorias,
  mostrarPerfil,
  mostrarCuenta,
  mostrarMisInscripciones,
  mostrarHistorial,
  mostrarHistorialEntrenamientos,
  mostrarDetalleEntrenamiento,
  mostrarEditarEntrenamiento,
  mostrarDetalleCategoria,
  mostrarEditarCategoria,
} = dashboardSlice.actions
export default dashboardSlice.reducer
