import { useContext } from 'react';
import DataContext from '../contexts/DataContext.jsx';

const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext debe ser usado dentro de un DataProvider');
  }
  return context;
};

export default useDataContext;
