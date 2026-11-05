import { Routes, Route } from 'react-router-dom';

import './App.css';

import Home from './views/Home';
import ProfileView from './views/Profile';
import RegisterView from './views/Register';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<ProfileView />} />
        <Route path="/register" element={<RegisterView />} />
      </Routes>
    </>
  );
};

export default App;
