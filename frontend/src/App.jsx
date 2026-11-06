import { Routes, Route } from 'react-router-dom';

import './App.css';

import Home from './views/Home';
import ProfileView from './views/Profile';
import RegisterView from './views/Register';
import DataProvider from './context/DataProvider';

const App = () => {
  return (
    <>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfil" element={<ProfileView />} />
          <Route path="/register" element={<RegisterView />} />
        </Routes>
      </DataProvider>
    </>
  );
};

export default App;
