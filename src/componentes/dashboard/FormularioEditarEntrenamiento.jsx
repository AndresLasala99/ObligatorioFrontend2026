import { joiResolver } from "@hookform/resolvers/joi"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"
import { setCategorias } from "../../features/categorias/categorias.slice.js"
import { mostrarDetalleEntrenamiento, mostrarEntrenamientos } from "../../features/dashboard/dashboard.slice.js"
import { actualizarEntrenamiento } from "../../features/entrenamientos/entrenamientos.slice.js"
import { entrenamientoSchema } from "../../validators/entrenamientos.validators.js"

const FormularioEditarEntrenamiento = () => {
  const dispatch = useDispatch()
  const categorias = useSelector((state) => state.categorias.categorias)
  const entrenamiento = useSelector((state) => state.dashboard.entrenamientoSeleccionado)

  const formatearFechaInput = (fecha) => {
    if (!fecha) return ""

    const fechaParseada = new Date(fecha)
    const offset = fechaParseada.getTimezoneOffset()
    const fechaLocal = new Date(fechaParseada.getTime() - offset * 60000)
    return fechaLocal.toISOString().slice(0, 16)
  }

  const formatearFechaBackend = (fecha) => {
    return fecha.replace("T", " ")
  }

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isValid } } = useForm({
    resolver: joiResolver(entrenamientoSchema),
    mode: "onChange",
    defaultValues: {
      titulo: entrenamiento?.titulo || "",
      descripcion: entrenamiento?.descripcion || "",
      nivel: entrenamiento?.nivel || "",
      duracionMinutos: entrenamiento?.duracionMinutos || "",
      cupoMaximo: entrenamiento?.cupoMaximo || 10,
      fecha: formatearFechaInput(entrenamiento?.fecha),
      categoria: entrenamiento?.categoria?._id || "",
    },
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

  useEffect(() => {
    if (entrenamiento) {
      reset({
        titulo: entrenamiento.titulo || "",
        descripcion: entrenamiento.descripcion || "",
        nivel: entrenamiento.nivel || "",
        duracionMinutos: entrenamiento.duracionMinutos || "",
        cupoMaximo: entrenamiento.cupoMaximo || 10,
        fecha: formatearFechaInput(entrenamiento.fecha),
        categoria: entrenamiento.categoria?._id || "",
      })
    }
  }, [entrenamiento, reset])

  const procesarForm = async (data) => {
    try {
      const entrenamientoActualizar = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        nivel: data.nivel,
        duracionMinutos: Number(data.duracionMinutos),
        cupoMaximo: Number(data.cupoMaximo),
        fecha: formatearFechaBackend(data.fecha),
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

        entrenamientoActualizar.imagen = resUpload.data.url
      }

      const res = await api.patch(`/entrenamientos/${entrenamiento._id}`, entrenamientoActualizar)

      dispatch(actualizarEntrenamiento(res.data.entrenamientoActualizado))
      dispatch(mostrarDetalleEntrenamiento(res.data.entrenamientoActualizado))
      toast.success("Entrenamiento actualizado correctamente.")
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo actualizar el entrenamiento."
        toast.error(mensaje)
      }
    }
  }

  if (!entrenamiento) {
    return null
  }

  return (
    <article className="panel">
      <div className="section-title">
        <div>
          <h2>Editar entrenamiento</h2>
          <p className="text-secondary">Modifica los datos del entrenamiento seleccionado.</p>
        </div>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => dispatch(mostrarEntrenamientos())}>
          Volver
        </button>
      </div>

      {entrenamiento.imagen && (
        <img className="detalle-entrenamiento-img" src={entrenamiento.imagen} alt={entrenamiento.titulo} />
      )}

      <form onSubmit={handleSubmit(procesarForm)}>
        <div className="mb-3">
          <label htmlFor="editarTituloEntrenamiento" className="form-label">Titulo</label>
          <input id="editarTituloEntrenamiento" className="form-control" type="text" placeholder="Ingrese el título" {...register("titulo")} />
          {errors.titulo && <span className="error">{errors.titulo.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="editarDescripcionEntrenamiento" className="form-label">Descripción</label>
          <textarea id="editarDescripcionEntrenamiento" className="form-control" rows="3" placeholder="Ingrese una descripción" {...register("descripcion")} />
          {errors.descripcion && <span className="error">{errors.descripcion.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="editarCategoriaEntrenamiento" className="form-label">Categoría</label>
          <select id="editarCategoriaEntrenamiento" className="form-select" {...register("categoria")}>
            <option value="" disabled>Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option value={categoria._id} key={categoria._id}>{categoria.nombre}</option>
            ))}
          </select>
          {errors.categoria && <span className="error">{errors.categoria.message}</span>}
        </div>

        <div className="row">
          <div className="col-6 mb-3">
            <label htmlFor="editarNivelEntrenamiento" className="form-label">Nivel</label>
            <select id="editarNivelEntrenamiento" className="form-select" {...register("nivel")}>
              <option value="" disabled>Seleccione nivel</option>
              <option value="principiante">principiante</option>
              <option value="intermedio">intermedio</option>
              <option value="avanzado">avanzado</option>
            </select>
            {errors.nivel && <span className="error">{errors.nivel.message}</span>}
          </div>
          <div className="col-6 mb-3">
            <label htmlFor="editarDuracionEntrenamiento" className="form-label">Minutos</label>
            <input id="editarDuracionEntrenamiento" className="form-control" type="number" placeholder="45" {...register("duracionMinutos")} />
            {errors.duracionMinutos && <span className="error">{errors.duracionMinutos.message}</span>}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="editarCupoEntrenamiento" className="form-label">Cupo máximo</label>
          <input id="editarCupoEntrenamiento" className="form-control" type="number" placeholder="10" {...register("cupoMaximo")} />
          {errors.cupoMaximo && <span className="error">{errors.cupoMaximo.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="editarFechaEntrenamiento" className="form-label">Fecha</label>
          <input id="editarFechaEntrenamiento" className="form-control" type="datetime-local" {...register("fecha")} />
          {errors.fecha && <span className="error">{errors.fecha.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="editarImagenEntrenamiento" className="form-label">Imagen nueva</label>
          <input id="editarImagenEntrenamiento" className="form-control" type="file" accept="image/*" {...register("imagen")} />
          {errors.imagen && <span className="error">{errors.imagen.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting || !isValid}>
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </article>
  )
}

export default FormularioEditarEntrenamiento



