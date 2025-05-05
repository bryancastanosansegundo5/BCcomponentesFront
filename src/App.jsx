import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/generales/Header';
import HeaderAdministracion from './components/generales/HeaderAdministracion';
import PanelCarrito from './components/carrito/PanelCarrito';
import PanelAdministracion from './components/admin/PanelAdministracion';
import PanelCuentaUsuario from './components/usuario/PanelCuentaUsuario';
import PerfilUsuario from './components/usuario/MiPerfil/PerfilUsuario';
import HistorialPedidos from './components/usuario/MisPedidos/HistorialPedidos';
import Catalogo from './components/catalogo/Catalogo';
import Inicio from './components/index/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Cesta from './components/pedido/Cesta';
import MetodoPago from './components/pedido/MetodoPago';
import ResumenPedidoFinal from './components/pedido/ResumenPedidoFinal';
import FormularioDireccion from './components/pedido/FormularioDireccion';
import Footer from './components/generales/Footer';
import OpcionesEntrega from './components/pedido/OpcionesEntrega';
import GestionClientes from "./components/admin/gestionUsuarios/GestionClientes";
import GestionEmpleados from "./components/admin/gestionUsuarios/GestionEmpleados";
import GestionAdministradores from "./components/admin/gestionUsuarios/GestionAdministradores";
import VistaEstadisticas from "./components/admin/estadisticas/VistaEstadisticas";
import Configuracion from "./components/admin/configuracion/Configuracion";
import GestionProductos from "./components/admin/productos/GestionProductos";
import VistaLogLogin from "./components/admin/logs/VistaLogLogin";
import StockAlertListener from './components/notificaciones/StockAlertListener';
import { Toaster } from 'react-hot-toast';
import DetalleProducto from './components/catalogo/DetalleProducto';
import { useAdminStore } from './store/adminStore';
import GestionProveedores from "./components/admin/proveedores/GestionProveedores";

import './App.css';

function App() {
  const location = useLocation();
  const state = location.state;
  const modoAdministracion = useAdminStore((state) => state.modoAdministracion);
  return (
    <>
      <StockAlertListener />
      <Toaster position="bottom-right" />
      <div className="d-flex flex-column min-vh-100">
      {modoAdministracion ? <HeaderAdministracion /> : <Header />}
        <PanelCarrito />
        <PanelAdministracion />
        <PanelCuentaUsuario />
        <main className="flex-grow-1 p-4"style={{marginTop:"5rem"}}>
          <Routes location={state?.background || location}>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/productos" element={<Catalogo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/perfil" element={<PerfilUsuario />} />
            <Route path="/pedidos" element={<HistorialPedidos />} />
            <Route path="/cesta" element={<Cesta />} />
            <Route path="/formularioDireccion" element={<FormularioDireccion />} />
            <Route path="/opcionesEntrega" element={<OpcionesEntrega />} />
            <Route path="/pago" element={<MetodoPago />} />
            <Route path="/resumen" element={<ResumenPedidoFinal />} />
            <Route path="/empleado/gestion-clientes" element={<GestionClientes />} />
            <Route path="/empleado/gestion-productos" element={<GestionProductos />} />
            <Route path="/empleado/gestion-proveedores" element={<GestionProveedores />} />
            <Route path="/admin/gestion-empleados" element={<GestionEmpleados />} />
            <Route path="/admin/gestion-administradores" element={<GestionAdministradores />} />
            <Route path="/admin/configuracion" element={<Configuracion />} />
            <Route path="/admin/logs" element={<VistaLogLogin />} />
            <Route path="/admin/estadisticas" element={<VistaEstadisticas />} />
          </Routes>
          {state?.background && (
            <Routes>
              <Route path="/producto/:id" element={<DetalleProducto />} />
            </Routes>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;