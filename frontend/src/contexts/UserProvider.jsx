import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext.jsx';
import axiosClient from '../api/axiosClient.js';
import userDataResponse from '../data/userData.js';

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(
    () => localStorage.getItem('shippingAddress') || '',
  );
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      //* Verifiación comentada para visualizar usuario
      //* en dev, no borrar.
      // if (!token) {
      //   setUser(null);
      //   setLoading(false);
      //   return;
      // }

      try {
        const response = await userDataResponse;

        //* Request real, no borrar.
        // const response = await axiosClient.get('/users/me');
        setUser(response.data.user ?? response.data);
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

  const login = async ({ email, password }) => {
    const response = await axiosClient.post('/login', { email, password });
    const userToken = response.data.token;

    if (!userToken) {
      throw new Error('La respuesta de autenticación no incluyó un token.');
    }

    localStorage.setItem('token', userToken);

    try {
      const userResponse = await axiosClient.get('/users/me');
      const userData = userResponse.data.user ?? userResponse.data;
      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (error) {
      localStorage.removeItem('token');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  const updateShippingAddress = (address) => {
    const normalizedAddress = address.trim();

    if (!normalizedAddress) {
      throw new Error('La dirección de envío no puede estar vacía.');
    }

    localStorage.setItem('shippingAddress', normalizedAddress);
    setShippingAddress(normalizedAddress);
  };

  return (
    <UserContext.Provider value={{
      user,
      token,
      shippingAddress,
      login,
      logout,
      updateShippingAddress,
      loading
    }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export default UserProvider;
