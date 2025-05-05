import React from "react";

const BarraProgresoPedido = ({ pasoActivo, onPasoClick }) => {
  const pasos = [
    "Mi cesta",
    "Dirección de envío",
    "Opciones de entrega",
    "Método de pago",
    "Resumen",
  ];

  return (
    <div
      className="container mt-4 mb-4"
      style={{ borderBottom: "1px dashed #ccc", paddingBottom: "30px" }}
    >
      <div className="d-flex align-items-center justify-content-between">
        {pasos.map((paso, index) => {
          const pasoNumero = index + 1;
          const activo = pasoActivo === pasoNumero;
          const yaPasado = pasoNumero < pasoActivo;
          const futuro = pasoNumero > pasoActivo;
          const esResumen = pasoActivo === 5;

          return (
            <React.Fragment key={index}>
              <div
                className="d-flex flex-column align-items-center text-center"
                style={{
                  width: "139px",
                  margin: "0 10px",
                  cursor: yaPasado && !esResumen ? "pointer" : "default",
                  pointerEvents: yaPasado && !esResumen ? "auto" : "none",
                  transition: "all 0.3s ease",
                }}
                onClick={() => {
                  if (yaPasado && !esResumen) onPasoClick(pasoNumero);
                }}
                onMouseEnter={(e) => {
                  if (yaPasado && !esResumen)
                    e.currentTarget.querySelector("div").style.backgroundColor = "#ff5c00";
                }}
                onMouseLeave={(e) => {
                  if (yaPasado && !esResumen)
                    e.currentTarget.querySelector("div").style.backgroundColor = "#6c757d";
                }}
              >
                <div
                  className={`rounded-circle d-flex justify-content-center align-items-center ${
                    activo
                      ? "text-white fw-bold"
                      : yaPasado
                      ? "text-white"
                      : "bg-light text-muted"
                  }`}
                  style={{
                    backgroundColor: activo
                      ? "#ff5c00"
                      : yaPasado
                      ? "#6c757d"
                      : "#e9ecef",
                    width: "32px",
                    height: "32px",
                  }}
                >
                  {pasoNumero}
                </div>
                <small
                  className={`mt-1 ${
                    activo ? "fw-bold text-dark" : "text-muted"
                  }`}
                >
                  {paso}
                </small>
              </div>
              {index < pasos.length - 1 && (
                <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BarraProgresoPedido;
