import { joiResolver } from "@hookform/resolvers/joi"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"
import { setCategorias } from "../../features/categorias/categorias.slice.js"
import { mostrarEntrenamientos } from "../../features/dashboard/dashboard.slice.js"
import { agregarEntrenamiento } from "../../features/entrenamientos/entrenamientos.slice.js"
import { entrenamientoSchema } from "../../validators/entrenamientos.validators.js"

const FormularioEntrenamiento = () => {
  const dispatch = useDispatch()
  const categorias = useSelector((state) => state.categorias.categorias)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isValid } } = useForm({
    resolver: joiResolver(entrenamientoSchema),
    mode: "onChange",
  })

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const res = await api.get("/categorias", {
          params: {
            limit: 100,
          },
        })
        dispatch(setCategorias(res.data.resultado.categorias))
      } catch (error) {
        if (debeMostrarError(error)) {
          const mensaje = error.response?.data?.message || "No se pudieron obtener las categorías."
          toast.error(mensaje)
        }
      }
    }

    obtenerCategorias()
  }, [dispatch])

  const procesarForm = async (data) => {
    try {
      const entrenamiento = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        nivel: data.nivel,
        duracionMinutos: Number(data.duracionMinutos),
        cupoMaximo: Number(data.cupoMaximo),
        fecha: new Date(data.fecha).toISOString(),
        categoria: data.categoria,
      }

      const archivoImagen = data.imagen?.[0]

      if (archivoImagen) {
        const formData = new FormData()
        formData.append("imagen", archivoImagen)
        formData.append("folder", "entrenamientos")

        const resUpload = await api.post("/uploads", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        entrenamiento.imagen = resUpload.data.url
      }

      const res = await api.post("/entrenamientos", entrenamiento)

      dispatch(agregarEntrenamiento(res.data.entrenamiento))
      toast.success("Entrenamiento creado correctamente.")
      reset()
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo crear el entrenamiento."
        toast.error(mensaje)
      }
    }
  }

  return (
    <article className="panel">
      <div className="section-title">
        <div>
          <h2>Agregar entrenamiento</h2>
          <p className="text-secondary">Crea una nueva propuesta para tus alumnos.</p>
        </div>
        <button type="button" className="btn btn-outline-secondary" onClick={() => dispatch(mostrarEntrenamientos())}>
          Volver
        </button>
      </div>
      <form onSubmit={handleSubmit(procesarForm)}>
        <div className="mb-3">
          <label htmlFor="tituloEntrenamiento" className="form-label">Titulo</label>
          <input id="tituloEntrenamiento" className="form-control" type="text" placeholder="Ingrese el título" {...register("titulo")} />
          {errors.titulo && <span className="error">{errors.titulo.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="descripcionEntrenamiento" className="form-label">Descripción</label>
          <textarea id="descripcionEntrenamiento" className="form-control" rows="3" placeholder="Ingrese una descripción" {...register("descripcion")} />
          {errors.descripcion && <span className="error">{errors.descripcion.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="categoriaEntrenamiento" className="form-label">Categoría</label>
          <select id="categoriaEntrenamiento" className="form-select" defaultValue="" {...register("categoria")}>
            <option value="" disabled>Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option value={categoria._id} key={categoria._id}>{categoria.nombre}</option>
            ))}
          </select>
          {errors.categoria && <span className="error">{errors.categoria.message}</span>}
        </div>

        <div className="row">
          <div className="col-6 mb-3">
            <label htmlFor="nivelEntrenamiento" className="form-label">Nivel</label>
            <select id="nivelEntrenamiento" className="form-select" defaultValue="" {...register("nivel")}>
              <option value="" disabled>Seleccione nivel</option>
              <option value="principiante">principiante</option>
              <option value="intermedio">intermedio</option>
              <option value="avanzado">avanzado</option>
            </select>
            {errors.nivel && <span className="error">{errors.nivel.message}</span>}
          </div>
          <div className="col-6 mb-3">
            <label htmlFor="duracionEntrenamiento" className="form-label">Minutos</label>
            <input id="duracionEntrenamiento" className="form-control" type="number" placeholder="45" {...register("duracionMinutos")} />
            {errors.duracionMinutos && <span className="error">{errors.duracionMinutos.message}</span>}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="cupoEntrenamiento" className="form-label">Cupo máximo</label>
          <input id="cupoEntrenamiento" className="form-control" type="number" placeholder="10" {...register("cupoMaximo")} />
          {errors.cupoMaximo && <span className="error">{errors.cupoMaximo.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="fechaEntrenamiento" className="form-label">Fecha</label>
          <input id="fechaEntrenamiento" className="form-control" type="datetime-local" {...register("fecha")} />
          {errors.fecha && <span className="error">{errors.fecha.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="imagenEntrenamiento" className="form-label">Imagen</label>
          <input id="imagenEntrenamiento" className="form-control" type="file" accept="image/*" {...register("imagen")} />
          {errors.imagen && <span className="error">{errors.imagen.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting || !isValid}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </article>
  )
}

export default FormularioEntrenamiento



