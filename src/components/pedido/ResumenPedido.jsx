import { useCarritoStore } from "../../store/carritoStore";

const ResumenPedido = ({
  mostrarBoton = true,
  textoBoton = "Guardar y continuar",
  onContinuar
}) => {
  const carrito = useCarritoStore((state) => state.carrito);
  const productos = useCarritoStore((state) => state.productos);

  const subtotal = Object.entries(carrito).reduce((acum, [id, cantidad]) => {
    const producto = productos[id];
    return acum + (producto?.precio || 0) * cantidad;
  }, 0);

  return (
    <div className="border rounded p-3">
      <h5 className="mb-3">Resumen</h5>
      <div
        className="d-flex justify-content-between"
        style={{ fontSize: "0.875rem" }}
      >
        <span>Subtotal artículos</span>
        <strong>{subtotal.toFixed(2)}€</strong>
      </div>
      <hr className="my-2" style={{ borderTop: "2px dashed #ccc" }} />
      <div className="d-flex justify-content-between align-items-center fw-bold fs-6">
        <span style={{ fontSize: "1rem" }}>Total (Impuestos incluidos)</span>
        <span style={{ fontSize: "1.5rem" }}>{subtotal.toFixed(2)}€</span>
      </div>

      <button
        className="btn fw-bold w-100 mt-3"
        onClick={()=>onContinuar({total:subtotal})}
        disabled={!mostrarBoton}
        style={{
          backgroundColor: "#ff5c00",
          borderColor: "#ff5c00",
          color: "white",
          opacity: mostrarBoton ? 1 : 0.5,
          cursor: mostrarBoton ? "pointer" : "not-allowed"
        }}
      >
        {textoBoton}
      </button>
    </div>
  );
};

export default ResumenPedido;