import { Routes, Route } from 'react-router-dom';

import './App.css';

import Home from './views/Home';
import ProfileView from './views/Profile';
import RegisterView from './views/Register';
import MainLayout from './layouts/MainLayout';

import AppProviders from './contexts/AppProviders';

const App = () => {
  return (
    <>
      <AppProviders>

        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/perfil" element={<ProfileView />} />
            <Route path="/register" element={<RegisterView />} />
          </Route>
        </Routes>

      </AppProviders>
    </>
  );
};

export default App;
