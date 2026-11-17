import { useEffect, useState } from 'react';
import DataContext from './DataContext.jsx';
import axiosClient from '../api/axiosClient.js';

const DataProvider = ({ children }) => {
  const [ mangas, setMangas] = useState([]);
  const [ isMangasLoading, setIsMangasLoading ] = useState(true);
  const [ categories, setCategories ] = useState([]);
  const [ demographicCategories, setDemographicCategories ] = useState([]);

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const response = await axiosClient.get('/mangas');
        setMangas(response.data?.mangas);
      } catch {
        throw new Error('Error al obtener el catálogo');
      } finally {
        setIsMangasLoading(false);
      }
    };

    fetchMangas();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get('/mangas/categories');
        setCategories(response.data?.categories);
      } catch {
        throw new Error('Error al obtener las categorías');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchDemographicCategories = async () => {
      try {
        const response = await axiosClient.get('/mangas/demographic-categories');
        setDemographicCategories(response.data?.categories);
      } catch {
        throw new Error('Error al obtener las categorías demográficas');
      }
    };

    fetchDemographicCategories();
  }, []);

  return (
    <DataContext.Provider value={{
        mangas,
        isMangasLoading,
        categories,
        demographicCategories
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
