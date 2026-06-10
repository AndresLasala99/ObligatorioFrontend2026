import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  inscripciones: [],
}

const inscripcionesSlice = createSlice({
  name: "inscripciones",
  initialState,
  reducers: {
    setInscripciones: (state, action) => {
      state.inscripciones = action.payload
    },
    agregarInscripcion: (state, action) => {
      const existe = state.inscripciones.some((inscripcion) => inscripcion._id === action.payload._id)

      if (existe) {
        state.inscripciones = state.inscripciones.map((inscripcion) => (
          inscripcion._id === action.payload._id ? action.payload : inscripcion
        ))
      } else {
        state.inscripciones.unshift(action.payload)
      }
    },
    actualizarInscripcion: (state, action) => {
      state.inscripciones = state.inscripciones.map((inscripcion) => (
        inscripcion._id === action.payload._id ? action.payload : inscripcion
      ))
    },
  },
})

export const {
  setInscripciones,
  agregarInscripcion,
  actualizarInscripcion,
} = inscripcionesSlice.actions
export default inscripcionesSlice.reducer
