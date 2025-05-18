import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Navbar from './components/Navbar';
import Register from './pages/auth/Register';
import Perfil from './pages/user/Perfil';
import EditarPerfil from './pages/user/EditarPerfil';
import Direcciones from './pages/user/Direcciones';
import Pedidos from './pages/user/Pedidos';
import TramitarPedido from './pages/user/TramitarPedido';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/direcciones" element={<Direcciones />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/tramitar-pedido" element={<TramitarPedido />} />
      </Routes>
    </BrowserRouter>
  );
}
