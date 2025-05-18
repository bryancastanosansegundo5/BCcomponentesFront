import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaTelegram,
  FaTiktok,
  FaTwitch,
} from "react-icons/fa";
import "../../styles/panelPerfil.css"; // para usar .link-animado

const Footer = () => {
  const linkStyle = {
    cursor: "pointer",
    transition: "color 0.2s ease",
  };

  return (
    <footer className="bg-light text-dark mt-5 border-top pt-4">
      {/* Columnas de enlaces */}
      <div className="container border-bottom pb-4">
        <div className="row text-start justify-content-between">
          {/* Por qué comprar */}
          <div className="col-6 col-md-2 mb-3">
            <h6 className="fw-bold">Por qué comprar</h6>
            <ul className="list-unstyled small footer-list">
              {[
                "Cómo comprar",
                "Formas de pago",
                "Gastos de envío",
                "Cupones descuento",
                "Preguntas frecuentes",
                "Opiniones de clientes",
                "Tarjetas regalo",
                "Servicios para empresas",
                "Compras para empresas",
              ].map((item, i) => (
                <li key={i}>
                  <span
                    className="link-animado fw-medium d-inline-block"
                    style={linkStyle}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quiénes somos */}
          <div className="col-6 col-md-2 mb-3">
            <h6 className="fw-bold">Quiénes somos</h6>
            <ul className="list-unstyled small footer-list">
              {[
                "Quiénes somos",
                "Compromisos",
                "Nuestras tiendas",
                "Nuestras Marcas",
                "Condiciones de compra",
                "Afiliados",
                "Aviso legal",
                "Privacidad",
                "Condiciones Generales Marketplace",
              ].map((item, i) => (
                <li key={i}>
                  <span
                    className="link-animado fw-medium d-inline-block"
                    style={linkStyle}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contactar */}
          <div className="col-6 col-md-2 mb-3">
            <h6 className="fw-bold">Contactar</h6>
            <ul className="list-unstyled small footer-list">
              {[
                "Contacto y Ayuda",
                "Devoluciones y Garantías",
                "Wiki BCcomponentes",
                "Opina y Gana",
                "Publicidad",
                "Trabaja con nosotros",
                "Canal ético",
                "Política de cookies",
              ].map((item, i) => (
                <li key={i}>
                  <span
                    className="link-animado fw-medium d-inline-block"
                    style={linkStyle}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Otros */}
          <div className="col-6 col-md-2 mb-3">
            <h6 className="fw-bold">Otros</h6>
            <ul className="list-unstyled small footer-list">
              {[
                "Replay",
                "Black Friday",
                "Cyber Monday",
                "BCDays",
                "Marketplace",
                "Servicio logístico Fulfillment",
                "Servicio de reparaciones",
                "Concursos",
                "Cita asistencia técnica",
                "Programa de embajadores",
              ].map((item, i) => (
                <li key={i}>
                  <span
                    className="link-animado fw-medium d-inline-block"
                    style={linkStyle}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Comunidad */}
          <div className="col-12 col-md-3 mb-3">
            <h6 className="fw-bold">Comunidad</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 footer-list">
              {[
                {
                  icon: <FaInstagram color="#E4405F" className="me-2" />,
                  text: "Instagram",
                },
                {
                  icon: <FaTwitter color="#1DA1F2" className="me-2" />,
                  text: "Twitter",
                },
                {
                  icon: <FaFacebook color="#1877F2" className="me-2" />,
                  text: "Facebook",
                },
                {
                  icon: <FaTelegram color="#0088cc" className="me-2" />,
                  text: "Telegram",
                },
                {
                  icon: <FaYoutube color="#FF0000" className="me-2" />,
                  text: "Youtube",
                },
                {
                  icon: <FaTiktok color="#000000" className="me-2" />,
                  text: "TikTok",
                },
                {
                  icon: <FaTwitch color="#9146FF" className="me-2" />,
                  text: "Twitch",
                },
              ].map((item, i) => (
                <li key={i}>
                  <span
                    className="link-animado fw-medium d-inline-block d-flex align-items-center"
                    style={linkStyle}
                  >
                    {item.icon}
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pie legal */}
      <div className="container text-center small text-muted py-3">
        BCcomponentes. Zamora. ESPAÑA. <br />
        &copy; {new Date().getFullYear()} Tienda Online – Todos los derechos
        reservados.
      </div>
    </footer>
  );
};

export default Footer;
