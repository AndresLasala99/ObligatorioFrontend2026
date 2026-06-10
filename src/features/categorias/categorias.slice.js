import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  categorias: [],
}

const categoriasSlice = createSlice({
  name: "categorias",
  initialState,
  reducers: {
    setCategorias: (state, action) => {
      state.categorias = action.payload
    },
    agregarCategoria: (state, action) => {
      state.categorias.unshift(action.payload)
    },
    actualizarCategoria: (state, action) => {
      state.categorias = state.categorias.map((categoria) => (
        categoria._id === action.payload._id ? action.payload : categoria
      ))
    },
    eliminarCategoria: (state, action) => {
      state.categorias = state.categorias.filter((categoria) => categoria._id !== action.payload)
    },
  },
})

export const { setCategorias, agregarCategoria, actualizarCategoria, eliminarCategoria } = categoriasSlice.actions
export default categoriasSlice.reducer
