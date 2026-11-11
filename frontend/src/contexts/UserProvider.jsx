import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext.jsx';
import axiosClient from '../api/axiosClient.js';

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(
    () => localStorage.getItem('shippingAddress'  || '')
  );
  const [token, setToken] = useState(
    () => localStorage.getItem('token')
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const fetchUser = async () => {
    const { data } = await axiosClient.get('/users/me');    
    return data?.user ?? null;
  };

  useEffect(() => {
    const id = axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        const sentToken = Boolean(error.config?.headers?.Authorization);
        if (error.response?.status === 401 && sentToken) clearSession();
        return Promise.reject(error);
      },
    );
    return () => {
      axiosClient.interceptors.response.eject(id);
    }
  }, [clearSession]);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
          const fetchedUser = await fetchUser();
          setUser(fetchedUser);
        }
      } catch (error) {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, [clearSession]);

  const login = async (credentials) => {
    const { data } = await axiosClient.post('/users/login', credentials);
    localStorage.setItem('token', data.token);
    setToken(data.token)
  
    try {
      const fetchedUser = await fetchUser();
      setUser(fetchedUser);
      return fetchedUser;
    } catch (error) {
      clearSession();
      throw error;
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      await axiosClient.post('/users/register', {
        email,
        full_name: name,
        display_name: name.trim(),
        password,
      });
      return '¡Usuario creado correctamente!';
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearSession();
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
