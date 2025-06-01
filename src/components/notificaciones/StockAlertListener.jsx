import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { WS_BASE_URL } from '@/utils/config';

const StockAlertListener = () => {
  const { user } = useAuth();
  const toastMapRef = useRef({}); // clave: productoId, valor: toastId

  useEffect(() => {
    if (!user || !user.id) return;

    const client = new Client({
      brokerURL: `${WS_BASE_URL}stock-alert/websocket`,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/avisos/stock/usuario/${user.id}`, (message) => {
          // Esperamos un JSON con { id: productoId, mensaje: texto }
          let parsed;
          try {
            parsed = JSON.parse(message.body);
          } catch (e) {
            console.error('❌ Mensaje no válido:', message.body);
            return;
          }

          const { id, mensaje } = parsed;

          // Si ya hay un toast para este producto, no lo duplicamos
          if (toastMapRef.current[id]) return;

          const newToastId = toast.custom((t) => (
            <div
              style={{
                background: '#fff9c4',
                color: '#333',
                border: '1px solid #f0e68c',
                fontWeight: 500,
                padding: '12px 16px',
                borderRadius: '8px',
                maxWidth: '320px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ flex: 1 }}>⚠️ {mensaje}</span>
              <button
                style={{
                  marginLeft: '1rem',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  paddingRight: '4px'
                }}
                onClick={() => {
                  toast.dismiss(t.id);
                  delete toastMapRef.current[id];
                }}
              >
                ×
              </button>
            </div>
          ), {
            duration: Infinity,
            id: `stock-${id}`,
            onDismiss: () => {
              delete toastMapRef.current[id];
            }
          });

          toastMapRef.current[id] = newToastId;
        });
      }
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [user]);

  return null;
};

export default StockAlertListener;
