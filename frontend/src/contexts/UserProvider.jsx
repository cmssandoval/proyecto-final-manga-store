import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext.jsx';
import axiosClient from '../api/axiosClient.js';

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const { navigate } = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      if ( !token ) {
        setLoading(false);
        return;
      }

      try {
        //* Simulación con data local, luego reemplazar por axios fetch
        const response = await axiosClient('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        console.error('Token inválido o expirado', error);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  const login = async ( user, password ) => {
    try {
      const response = await axiosClient.post(
        '/auth/login',
        { email, password },
      );
      const { user: userData, token: userToken } = response;
      setToken(userToken);
      setUser(userData);
      localStorage.setItem('token', userToken);
    } catch (error) {
      console.error('Error en el login', error);
    }
  };

  const logout = () => {
    try {
      axiosClient.post('/logout')
      alert('Sesión cerrada correctamente');
    } catch (error) {
      alert('Error en el servidor al cerrar sesión');
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      token,
      login,
      logout,
      loading
    }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export default UserProvider;
