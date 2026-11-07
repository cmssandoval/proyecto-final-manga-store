import { useContext } from 'react';
import UserContext from '../contexts/UserContext.jsx';

const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext debe ser usado dentro de un UserProvider');
  }
  return context;
};

export default useUserContext;
