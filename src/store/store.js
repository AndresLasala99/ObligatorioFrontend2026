import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/auth.slice.js"
import categoriasReducer from "../features/categorias/categorias.slice.js"
import dashboardReducer from "../features/dashboard/dashboard.slice.js"
import entrenamientosReducer from "../features/entrenamientos/entrenamientos.slice.js"
import inscripcionesReducer from "../features/inscripciones/inscripciones.slice.js"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categorias: categoriasReducer,
    dashboard: dashboardReducer,
    entrenamientos: entrenamientosReducer,
    inscripciones: inscripcionesReducer,
  },
})
