import { joiResolver } from "@hookform/resolvers/joi"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"
import { agregarCategoria } from "../../features/categorias/categorias.slice.js"
import { mostrarCategorias } from "../../features/dashboard/dashboard.slice.js"
import { categoriaSchema } from "../../validators/categorias.validators.js"

const CategoriaForm = () => {
  const dispatch = useDispatch()
  const [usarIA, setUsarIA] = useState(false)
  const [generandoIA, setGenerandoIA] = useState(false)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting, isValid } } = useForm({
    resolver: joiResolver(categoriaSchema),
    mode: "onChange",
  })

  const generarDescripcionIA = async () => {
    try {
      setGenerandoIA(true)

      const prompt = `Genera una descripción breve y clara para una categoría de entrenamiento.
      Nombre de la categoría: ${watch("nombre") || "Sin nombre"}
      Pedido del usuario: ${watch("descripcion") || ""}
      Responde solo con la descripción final, sin listas ni markdown. Máximo 100 caracteres.`

      const res = await api.post("/ai", { prompt })
      setValue("descripcion", res.data.final?.trim() || "", { shouldValidate: true })
      toast.success("Descripción generada con IA.")
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo generar la descripción con IA."
        toast.error(mensaje)
      }
    } finally {
      setGenerandoIA(false)
    }
  }

  const procesarForm = async (data) => {
    try {
      const categoria = {
        nombre: data.nombre,
      }

      if (data.descripcion) categoria.descripcion = data.descripcion
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

        categoria.imagen = resUpload.data.url
      }

      const res = await api.post("/categorias", categoria)

      dispatch(agregarCategoria(res.data.categoria))
      toast.success("Categoría creada correctamente.")
      reset()
      setUsarIA(false)
    } catch (error) {
      if (debeMostrarError(error)) {
        const mensaje = error.response?.data?.message || "No se pudo crear la categoría."
        toast.error(mensaje)
      }
    }
  }

  return (
    <article className="panel">
      <div className="section-title">
        <div>
          <h2>Agregar categoría</h2>
          <p className="text-secondary">Crea una categoría para organizar tus entrenamientos.</p>
        </div>
      </div>

      <form className="categoria-form formulario-panel" onSubmit={handleSubmit(procesarForm)}>
        <div className="mb-3">
          <label htmlFor="nombreCategoria" className="form-label">Nombre</label>
          <input id="nombreCategoria" type="text" className="form-control" placeholder="Ingrese el nombre" {...register("nombre")} />
          {errors.nombre && <span className="error">{errors.nombre.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="descripcionCategoria" className="form-label">Descripción</label>
          <textarea
            id="descripcionCategoria"
            className="form-control"
            rows="3"
            placeholder={usarIA ? "Ej: Quiero una descripción para una categoría de entrenamiento CORE" : "Ingrese una descripción"}
            {...register("descripcion")}
          />
          {errors.descripcion && <span className="error">{errors.descripcion.message}</span>}
        </div>

        <div className="mb-3">
          <div className="form-check">
            <input
              id="usarIACategoria"
              type="checkbox"
              className="form-check-input"
              checked={usarIA}
              onChange={(e) => setUsarIA(e.target.checked)}
            />
            <label htmlFor="usarIACategoria" className="form-check-label">Ayúdate con IA</label>
          </div>

          {usarIA && (
            <button type="button" className="btn btn-outline-secondary btn-sm mt-2" onClick={generarDescripcionIA} disabled={generandoIA || !watch("descripcion")?.trim()}>
              {generandoIA ? "Generando..." : "Generar descripción"}
            </button>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="imagenCategoria" className="form-label">Imagen</label>
          <input id="imagenCategoria" type="file" className="form-control" accept="image/*" {...register("imagen")} />
          {errors.imagen && <span className="error">{errors.imagen.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting || !isValid}>
          {isSubmitting ? "Guardando..." : "Crear categoría"}
        </button>

        <button type="button" className="btn btn-outline-secondary w-100 mt-3" onClick={() => dispatch(mostrarCategorias())}>
          Volver
        </button>
      </form>
    </article>
  )
}

export default CategoriaForm
