import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Navbar from "./components/Navbar";
import Register from "./pages/auth/Register";
import Perfil from "./pages/user/Perfil";
import Direcciones from "./pages/user/Direcciones";
import Pedidos from "./pages/user/Pedidos";
import TramitarPedido from "./pages/user/TramitarPedido";
import ViniloDetalle from "./pages/public/ViniloDetalle";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVinilos from "./pages/admin/VinilosAdmin";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminDirecciones from "./pages/admin/AdminDirecciones";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminProveedores from "./pages/admin/AdminProveedores";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<><Home /><Footer /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/direcciones" element={<Direcciones />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/tramitar-pedido" element={<TramitarPedido />} />
        <Route path="/vinilo/:id" element={<ViniloDetalle />} />

        {/* Rutas protegidas para administrador */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/vinilos"
          element={
            <AdminRoute>
              <AdminVinilos />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <AdminRoute>
              <AdminUsuarios />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/direcciones"
          element={
            <AdminRoute>
              <AdminDirecciones />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <AdminRoute>
              <AdminPedidos />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/proveedores"
          element={
            <AdminRoute>
              <AdminProveedores />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
