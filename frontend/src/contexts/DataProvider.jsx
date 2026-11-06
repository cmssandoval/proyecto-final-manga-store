import { useEffect, useState } from 'react';
import DataContext from './DataContext.jsx';

import featuredProducts from '../data/featuredProducts';

const DataProvider = ({ children }) => {
  const [ homeData, setHomeData] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        //* Simulación con data local, luego reemplazar por axios fetch
        const response = await featuredProducts;
        setHomeData(response);
      } catch {
        throw new Error('Error al obtener el catálogo de Home');
      }
    };

    fetchHomeData();    
  }, []);

  return (
    <DataContext.Provider value={{
        homeData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
