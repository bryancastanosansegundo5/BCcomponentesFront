import { useChatCompatibilidadStore } from "../../store/chatCompatibilidadStore";
import { useRecomendacionesStore } from "../../store/recomendacionesStore";

const FondoOscuro = ({ onClick }) => {
  const chatVisible = useChatCompatibilidadStore((s) => s.chatVisible);
  const recomendacionesVisible = useRecomendacionesStore((s) => s.visible);

  const mostrar = chatVisible || recomendacionesVisible;

  if (!mostrar) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
      style={{ zIndex: 1039 }}
      onClick={onClick}
    />
  );
};

export default FondoOscuro;