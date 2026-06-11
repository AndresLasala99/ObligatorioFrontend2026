import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import api, { debeMostrarError } from "../../api/api.js"

const Motivacion = () => {
  const [frase, setFrase] = useState(null)
  const [cargando, setCargando] = useState(false)

  const obtenerFrase = async () => {
    setCargando(true)

    try {
      const response = await api.get("/motivacion")
      setFrase(response.data.frase)
    } catch (error) {
      if (debeMostrarError(error)) {
        toast.error("No se pudo obtener la frase motivacional.")
      }
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    obtenerFrase()
  }, [])

  return (
    <section className="dashboard-stack">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Motivacion</p>
          <h1>Frase motivacional</h1>
          <p className="text-secondary">Una frase para acompañar tu entrenamiento.</p>
        </div>
      </header>

      <article className="panel">
        {frase ? (
          <>
            <h2>"{frase.frase}"</h2>
          </>
        ) : (
          <p className="text-secondary mb-4">Todavia no hay una frase cargada.</p>
        )}

        <button type="button" className="btn btn-primary" onClick={obtenerFrase} disabled={cargando}>
          {cargando ? "Cargando..." : "Nueva frase"}
        </button>
      </article>
    </section>
  )
}

export default Motivacion
