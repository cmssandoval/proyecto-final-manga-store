import { Routes, Route } from 'react-router-dom';

import './App.css';

import Home from './views/Home.jsx';
import Catalog from './views/Catalog.jsx';
import ProfileView from './views/Profile.jsx';
import RegisterView from './views/Register.jsx';
import LoginView from './views/Login.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import ProductDetail from './views/ProductDetail.jsx';
import Cart from './views/CartView.jsx';

import AppProviders from './contexts/AppProviders.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => {
  return (
    <>
      <AppProviders>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/catalogo/:id" element={<ProductDetail />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/perfil" element={<ProfileView />} />
            </Route>
            <Route path="/register" element={<RegisterView />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/cart" element={<Cart />} />
          </Route>
        </Routes>
      </AppProviders>
    </>
  );
};

export default App;
