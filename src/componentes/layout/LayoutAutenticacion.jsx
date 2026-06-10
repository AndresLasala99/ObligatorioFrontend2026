const LayoutAutenticacion = ({ etiqueta, titulo, descripcion, children }) => {
  return (
    <section className="auth-page">
      <main className="auth-shell container">
        <section className="auth-brand">
          <span className="badge text-bg-light">{etiqueta}</span>
          <h1>{titulo}</h1>
          <p>{descripcion}</p>
        </section>

        <section className="auth-card">
          {children}
        </section>
      </main>
    </section>
  )
}

export default LayoutAutenticacion
