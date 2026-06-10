import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  entrenamientos: [],
}

const entrenamientosSlice = createSlice({
  name: "entrenamientos",
  initialState,
  reducers: {
    setEntrenamientos: (state, action) => {
      state.entrenamientos = action.payload
    },
    agregarEntrenamiento: (state, action) => {
      state.entrenamientos.unshift(action.payload)
    },
    eliminarEntrenamiento: (state, action) => {
      state.entrenamientos = state.entrenamientos.filter((entrenamiento) => entrenamiento._id !== action.payload)
    },
    actualizarEntrenamiento: (state, action) => {
      state.entrenamientos = state.entrenamientos.map((entrenamiento) => (
        entrenamiento._id === action.payload._id ? action.payload : entrenamiento
      ))
    },
  },
})

export const {
  setEntrenamientos,
  agregarEntrenamiento,
  eliminarEntrenamiento,
  actualizarEntrenamiento,
} = entrenamientosSlice.actions
export default entrenamientosSlice.reducer
