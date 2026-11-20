import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient.js';
import useDataContext from '../hooks/useDataContext.js';
import formatClp from '../utils/formatClp.js';
import AdminMangasForm from './AdminMangasForm.jsx';
import '../styles/admin-mangas.css';

const AdminMangas = () => {
  const { categories, demographicCategories } = useDataContext();
  const [mangas, setMangas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isCurrent = true;

    const fetchMangas = async () => {
      try {
        const { data } = await axiosClient.get('/mangas');
        if (!Array.isArray(data?.mangas)) {
          throw new Error('La respuesta del catálogo no tiene un formato válido.');
        }

        if (isCurrent) setMangas(data.mangas);
      } catch (error) {
        if (isCurrent) {
          setLoadError(
            error.response?.data?.message
              || error.message
              || 'No se pudo cargar el catálogo de mangas.',
          );
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    fetchMangas();

    return () => {
      isCurrent = false;
    };
  }, []);

  const handleCreateManga = async (mangaData) => {
    setIsSaving(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const { data } = await axiosClient.post('/mangas', mangaData);
      if (!data?.manga?.id) {
        throw new Error('La respuesta al crear el manga no tiene un formato válido.');
      }

      setMangas((currentMangas) => [...currentMangas, data.manga]);
      setIsFormOpen(false);
      setSuccessMessage(`Se agregó "${data.manga.name}" al catálogo.`);
    } catch (error) {
      setApiError(
        error.response?.data?.message
          || error.message
          || 'No se pudo crear el manga.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!isFormOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSaving) {
        setIsFormOpen(false);
        setApiError('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFormOpen, isSaving]);

  const closeForm = () => {
    if (isSaving) return;
    setIsFormOpen(false);
    setApiError('');
  };

  return (
    <section className="admin-mangas-panel" aria-label="Administrar catálogo de mangas">
      <div className="admin-mangas-toolbar">
        <p>{mangas.length} {mangas.length === 1 ? 'manga' : 'mangas'} en el catálogo</p>
        <button
          className="admin-mangas-button admin-mangas-button--primary"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isFormOpen}
          aria-controls="admin-mangas-form"
          onClick={() => {
            setIsFormOpen(true);
            setApiError('');
            setSuccessMessage('');
          }}
        >
          Agregar manga
        </button>
      </div>

      {successMessage && (
        <p className="admin-mangas-notice admin-mangas-notice--success" role="status">
          {successMessage}
        </p>
      )}

      {isFormOpen && (
        <div className="checkout-modal__backdrop">
          <section
            className="checkout-modal admin-mangas-modal"
            id="admin-mangas-form"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-mangas-form-title"
          >
            <button
              type="button"
              className="checkout-modal__close"
              onClick={closeForm}
              aria-label="Cerrar formulario de manga"
              disabled={isSaving}
            >
              ×
            </button>
            <p className="checkout-modal__eyebrow">Administración de catálogo</p>
            <h2 className="checkout-modal__title" id="admin-mangas-form-title">
              Agregar manga
            </h2>
            <AdminMangasForm
              categories={categories}
              demographicCategories={demographicCategories}
              onSubmitSuccess={handleCreateManga}
              onCancel={closeForm}
              onFormChange={() => {
                setApiError('');
                setSuccessMessage('');
              }}
              apiError={apiError}
              isLoading={isSaving}
            />
          </section>
        </div>
      )}

      {loadError ? (
        <p className="admin-mangas-notice admin-mangas-notice--error" role="alert">
          {loadError}
        </p>
      ) : isLoading ? (
        <p className="admin-mangas-empty" role="status">Cargando mangas...</p>
      ) : mangas.length === 0 ? (
        <p className="admin-mangas-empty">Aún no hay mangas en el catálogo.</p>
      ) : (
        <div className="admin-mangas-table-wrap">
          <table className="admin-mangas-table">
            <thead>
              <tr>
                <th scope="col">Manga</th>
                <th scope="col">SKU</th>
                <th scope="col">Precio</th>
                <th scope="col">Stock</th>
              </tr>
            </thead>
            <tbody>
              {mangas.map((manga) => (
                <tr key={manga.id}>
                  <td>
                    <strong>{manga.name}</strong>
                    <span>{manga.volume}</span>
                  </td>
                  <td>{manga.sku}</td>
                  <td>{formatClp(manga.price)}</td>
                  <td>{manga.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminMangas;
