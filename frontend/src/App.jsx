import { Routes, Route } from 'react-router-dom';

import './App.css';

import Home from './views/Home.jsx';
import ProfileView from './views/Profile.jsx';
import RegisterView from './views/Register.jsx';
import MainLayout from './layouts/MainLayout.jsx';

import AppProviders from './contexts/AppProviders.jsx';
import LoginView from './views/Login.jsx';

const App = () => {
  return (
    <>
      <AppProviders>

        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/perfil" element={<ProfileView />} />
            <Route path="/register" element={<RegisterView />} />
            <Route path="/login" element={<LoginView />} />
          </Route>
        </Routes>

      </AppProviders>
    </>
  );
};

export default App;
