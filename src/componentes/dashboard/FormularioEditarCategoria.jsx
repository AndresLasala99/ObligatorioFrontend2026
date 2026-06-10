import { joiResolver } from "@hookform/resolvers/joi"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"
import { actualizarCategoria } from "../../features/categorias/categorias.slice.js"
import { mostrarDetalleCategoria, mostrarCategorias } from "../../features/dashboard/dashboard.slice.js"
import { categoriaSchema } from "../../validators/categorias.validators.js"

const FormularioEditarCategoria = () => {
  const dispatch = useDispatch()
  const categoria = useSelector((state) => state.dashboard.categoriaSeleccionada)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isValid } } = useForm({
    resolver: joiResolver(categoriaSchema),
    mode: "onChange",
    defaultValues: {
      nombre: categoria?.nombre || "",
      descripcion: categoria?.descripcion || "",
    },
  })

  useEffect(() => {
    if (categoria) {
      reset({
        nombre: categoria.nombre || "",
        descripcion: categoria.descripcion || "",
      })
    }
  }, [categoria, reset])

  const procesarForm = async (data) => {
    try {
      const categoriaActualizar = {
        nombre: data.nombre,
      }

      if (data.descripcion) categoriaActualizar.descripcion = data.descripcion

      const archivoImagen = data.imagen?.[0]

      if (archivoImagen) {
        const formData = new FormData()
        formData.append("imagen", archivoImagen)
        formData.append("folder", "categorias")

        const resUpload = await api.post("/uploads", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        categoriaActualizar.imagen = resUpload.data.url
      }

      const res = await api.patch(`/categorias/${categoria._id}`, categoriaActualizar)

      dispatch(actualizarCategoria(res.data.categoriaActualizada))
      dispatch(mostrarDetalleCategoria(res.data.categoriaActualizada))
      toast.success("Categoría actualizada correctamente.")
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo actualizar la categoría."
        toast.error(mensaje)
      }
    }
  }

  if (!categoria) {
    return null
  }

  return (
    <article className="panel">
      <div className="section-title">
        <div>
          <h2>Editar categoría</h2>
          <p className="text-secondary">Modifica los datos de la categoría seleccionada.</p>
        </div>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => dispatch(mostrarCategorias())}>
          Volver
        </button>
      </div>

      {categoria.imagen && (
        <img className="detalle-entrenamiento-img" src={categoria.imagen} alt={categoria.nombre} />
      )}

      <form onSubmit={handleSubmit(procesarForm)}>
        <div className="mb-3">
          <label htmlFor="editarNombreCategoria" className="form-label">Nombre</label>
          <input id="editarNombreCategoria" type="text" className="form-control" placeholder="Ingrese el nombre" {...register("nombre")} />
          {errors.nombre && <span className="error">{errors.nombre.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="editarDescripcionCategoria" className="form-label">Descripción</label>
          <textarea id="editarDescripcionCategoria" className="form-control" rows="3" placeholder="Ingrese una descripción" {...register("descripcion")} />
          {errors.descripcion && <span className="error">{errors.descripcion.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="editarImagenCategoria" className="form-label">Imagen nueva</label>
          <input id="editarImagenCategoria" type="file" className="form-control" accept="image/*" {...register("imagen")} />
          {errors.imagen && <span className="error">{errors.imagen.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting || !isValid}>
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </article>
  )
}

export default FormularioEditarCategoria


