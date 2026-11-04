import { Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import ProfileView from './views/Profile';

import './App.css';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<ProfileView />} />
      </Routes>
    </>
  );
};

export default App;
