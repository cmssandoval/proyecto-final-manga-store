import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserContext from './UserContext.jsx';
import userDataResponse from '../data/userData.js';

// import axiosClient from '../api/axiosClient.js';

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(
    () => localStorage.getItem('shippingAddress') || '',
  );
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  // const location = useLocation();

  // useEffect(() => {
  //   const verifyUser = async () => {
  //     setLoading(true);

  //     try {
  //       const response = await axiosClient.get('/users/me');
  //       setUser(response.data.user ?? response.data);
  //     } catch (error) {
  //       console.error('Token inválido o expirado', error);
  //       setUser(null);
  //       setToken(null);
  //       localStorage.removeItem('token');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   verifyUser();
  // }, [location.pathname, token]);

  //* Este useEffect es solo para efectos de la revisión
  useEffect(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    //* Llamada a la API, descomentar una vez evaluado el frontend.
    // const response = await axiosClient.post('/login', credentials);
    // const userToken = response.data.token;
    // const userResponse = await axiosClient.get('/users/me');

    const userData = {
      ...userDataResponse.data.user,
      email: credentials.email,
    };
    setToken(null);
    localStorage.removeItem('token');
    setUser(userData);
    return userData;
  };

  const register = async ({ name, email, password }) => {
    // * Llamada a la API, descomentar una vez evaluado el frontend.
    // const response = await axiosClient.post('/register', {
    //   full_name: name,
    //   display_name: name,
    //   email,
    //   password,
    // });

    return {
      name,
      email,
    };
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
      register,
      logout,
      updateShippingAddress,
      loading
    }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export default UserProvider;
