import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
    obtenerValoracionesAdmin,
    buscarValoracionesFiltradas,
} from "../../../services/adminService";
import ModalEditarValoracion from "./editar/ModalEditarValoracion";
import { BiPencil } from "react-icons/bi";

const GestionValoracionesAdmin = () => {
    const { token } = useAuth();
    const [valoraciones, setValoraciones] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [valoracionSeleccionada, setValoracionSeleccionada] = useState(null);
    const [mensajeError, setMensajeError] = useState("");
    const [campo, setCampo] = useState("usuario");
    const [valor, setValor] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef();
    const [visibilidad, setVisibilidad] = useState(""); // "", "true", "false"

    const cargarValoraciones = async () => {
        try {
            const data = await obtenerValoracionesAdmin(token, 0);
            setValoraciones(data.content);
            setTotalPages(data.totalPages);
            setPage(1);         // 👈 OBLIGATORIO: para que scroll cargue desde page 1
            setHasMore(!data.last);
        } catch (error) {
            setMensajeError(error.message);
            setTimeout(() => setMensajeError(""), 3000);
        }
    };
    const cargarMasValoraciones = async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const filtros = {};
            if (campo === "visibilidad" && valor !== "") {
                filtros.visible = valor === "true"; // 👈 convierte string → boolean
            } else {
                if (valor) filtros[campo] = valor;
            }
            if (fechaInicio) filtros.fechaInicio = fechaInicio;
            if (fechaFin) filtros.fechaFin = fechaFin;

            const data = await buscarValoracionesFiltradas(token, filtros, page, 20);
            setValoraciones((prev) => [...prev, ...data.content]);
            setHasMore(!data.last);
            setPage((prev) => prev + 1);
        } catch (error) {
            setMensajeError("Error al cargar valoraciones");
            setTimeout(() => setMensajeError(""), 3000);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && hasMore) {
                    cargarMasValoraciones();
                }
            },
            { threshold: 1 }
        );

        const currentRef = observerRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [isLoading, hasMore]);




    const buscarConFiltros = async () => {
        try {
            const filtros = {};

            if (campo === "visibilidad" && valor !== "") {
                filtros.visible = valor === "true"; // 👈 convierte string → boolean
            } else {
                if (valor) filtros[campo] = valor;
            }
            if (fechaInicio) filtros.fechaInicio = fechaInicio;
            if (fechaFin) filtros.fechaFin = fechaFin;

            const data = await buscarValoracionesFiltradas(token, filtros, 0);
            setValoraciones(data.content);
            setTotalPages(data.totalPages);
            setPage(1); // 🔧 empieza en 1 para que el scroll siga con la segunda página
            setHasMore(!data.last); // 🔧 importante

        } catch (error) {
            setMensajeError("Error al buscar valoraciones");
            setTimeout(() => setMensajeError(""), 3000);
        }
    };






    return (
        <div className="container py-4" style={{ maxWidth: "1400px" }}>
            <h4 className="fw-bold mb-4 border-bottom pb-2">Moderación de comentarios</h4>
            <div className="mb-4">
                <div className="row g-3 align-items-center mb-2">
                    <div className="col-md-auto">
                        <select
                            className="form-select"
                            value={campo}
                            onChange={(e) => {
                                setCampo(e.target.value);
                                setValor("");
                            }}
                            style={{ borderRadius: "10px", minWidth: "160px" }}
                        >
                            <option value="usuario">Usuario</option>
                            <option value="comentario">Comentario</option>
                            <option value="puntuacion">Puntuación</option>
                            <option value="producto">Producto</option>
                            <option value="visibilidad">Visibilidad</option>
                        </select>
                    </div>

                    <div className="col-md">
                        {campo === "puntuacion" ? (
                            <select
                                className="form-select"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                                style={{ borderRadius: "10px" }}
                            >
                                <option value="">Todas</option>
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <option key={n} value={n}>
                                        {n} ★
                                    </option>
                                ))}
                            </select>
                        ) : campo === "visibilidad" ? (
                            <select
                                className="form-select"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                                style={{ borderRadius: "10px" }}
                            >
                                <option value="">Todas</option>
                                <option value="true">Visibles</option>
                                <option value="false">No visibles</option>

                            </select>
                        ) : (
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar..."
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                                style={{ borderRadius: "10px" }}
                            />
                        )}
                    </div>

                    <div className="col-md-auto">
                        <input
                            type="date"
                            className="form-control"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            style={{ borderRadius: "10px" }}
                        />
                    </div>

                    <div className="col-md-auto">
                        <input
                            type="date"
                            className="form-control"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            style={{ borderRadius: "10px" }}
                        />
                    </div>

                    <div className="col-md-auto">
                        <button
                            className="btn text-white"
                            style={{ backgroundColor: "#ff5c00", borderRadius: "10px", minWidth: "100px" }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#C74900")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff5c00")}
                            onClick={() => buscarConFiltros()}
                        >
                            Buscar
                        </button>
                    </div>
                </div>
            </div>


            {mensajeError && (
                <p className="text-danger fw-semibold">{mensajeError}</p>
            )}

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Imagen</th>
                            <th>Producto</th>
                            <th>Comentario</th>
                            <th>Puntuación</th>
                            <th>Visible</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {valoraciones.map((val) => (
                            <tr key={val.id}>
                                <td>{val.id}</td>
                                <td>
                                    <img
                                        src={val.imagenProducto}
                                        alt={val.producto}
                                        style={{ height: "50px", objectFit: "contain" }}
                                    />
                                </td>
                                <td>{val.producto}</td>
                                <td

                                >
                                    {val.comentario}
                                </td>
                                <td>{val.puntuacion}</td>
                                <td>
                                    <span
                                        className={`badge ${val.visible ? "bg-success" : "bg-secondary"}`}
                                    >
                                        {val.visible ? "Sí" : "No"}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <button
                                        className="btn text-white"
                                        style={{
                                            backgroundColor: "#ff5c00",
                                            borderRadius: "10px",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.target.style.backgroundColor = "#C74900")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.target.style.backgroundColor = "#ff5c00")
                                        }
                                        title="Editar visibilidad"
                                        onClick={() => {
                                            setValoracionSeleccionada(val);
                                            setModalVisible(true);
                                        }}
                                    >
                                        <BiPencil />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {/* Este es el "observador" que se activa al llegar abajo */}
                        <tr key="observer" ref={observerRef}>
                            <td colSpan="6" className="text-center text-muted">
                                {isLoading ? "Cargando más..." : hasMore ? "" : "No hay más valoraciones"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {modalVisible && valoracionSeleccionada && (
                <ModalEditarValoracion
                    visible={modalVisible}
                    valoracion={valoracionSeleccionada}
                    onClose={() => setModalVisible(false)}
                    onActualizado={buscarConFiltros}
                />
            )}
        </div>
    );
};

export default GestionValoracionesAdmin;
