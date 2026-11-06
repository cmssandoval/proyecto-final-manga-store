import { useContext } from 'react';
import DataContext from '../contexts/DataContext';

const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe ser usado dentro de un DataProvider');
  }
  return context;
};

export default useDataContext;
