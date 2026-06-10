const PanelUso = () => {
  return (
    <article id="metricas" className="panel">
      <h2>Informe de uso</h2>
      <p className="text-secondary">Espacio reservado para porcentaje de uso, cambio de plan y grafico.</p>
      <div className="progress mb-3" role="progressbar" aria-label="Uso del plan" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
        <div className="progress-bar" style={{ width: "75%" }}>75%</div>
      </div>
      <div className="chart-placeholder">Grafico</div>
    </article>
  )
}

export default PanelUso
