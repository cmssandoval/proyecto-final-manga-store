import { useState } from 'react';
import createMangaSchema from '../schemas/CreateMangaSchema.js';

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  volume: '',
  author: '',
  editorial: '',
  image_link: '',
  sku: '',
  origin: '',
  release_date: '',
  price: '',
  stock: '',
  categoryIds: [],
  demographicCategoryIds: [],
};

const createSlug = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const AdminMangasForm = ({
  categories,
  demographicCategories,
  onSubmitSuccess,
  onCancel,
  apiError,
  onFormChange,
  isLoading,
}) => {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');
  const [slugWasEdited, setSlugWasEdited] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
      ...(name === 'name' && !slugWasEdited ? { slug: createSlug(value) } : {}),
    }));
    setError('');
    onFormChange();
  };

  const handleSlugChange = (event) => {
    setSlugWasEdited(true);
    handleChange(event);
  };

  const handleCategoryChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: checked
        ? [...currentData[name], value]
        : currentData[name].filter((categoryId) => categoryId !== value),
    }));
    setError('');
    onFormChange();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const result = createMangaSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    onSubmitSuccess(result.data);
  };

  return (
    <>
      {(!error && apiError) && (
        <p className="admin-mangas-notice admin-mangas-notice--error" role="alert">{apiError}</p>
      )}
      {(!apiError && error) && (
        <p className="admin-mangas-notice admin-mangas-notice--error" role="alert">{error}</p>
      )}

      <form className="admin-mangas-form" onSubmit={handleSubmit}>
        <div className="admin-mangas-form-grid">
          <div className="admin-mangas-field">
            <label htmlFor="manga-name">Nombre</label>
            <input id="manga-name" name="name" value={formData.name} onChange={handleChange} required maxLength={255} autoFocus />
          </div>
          <div className="admin-mangas-field">
            <label htmlFor="manga-slug">Slug</label>
            <input id="manga-slug" name="slug" value={formData.slug} onChange={handleSlugChange} required maxLength={255} />
          </div>
          <div className="admin-mangas-field">
            <label htmlFor="manga-volume">Volumen</label>
            <input id="manga-volume" name="volume" value={formData.volume} onChange={handleChange} required maxLength={50} />
          </div>
          <div className="admin-mangas-field">
            <label htmlFor="manga-author">Autor</label>
            <input id="manga-author" name="author" value={formData.author} onChange={handleChange} required maxLength={150} />
          </div>
          <div className="admin-mangas-field">
            <label htmlFor="manga-editorial">Editorial</label>
            <input id="manga-editorial" name="editorial" value={formData.editorial} onChange={handleChange} required maxLength={150} />
          </div>
          <div className="admin-mangas-field">
            <label htmlFor="manga-image-link">URL de imagen</label>
            <input id="manga-image-link" name="image_link" type="url" value={formData.image_link} onChange={handleChange} required maxLength={2048} />
          </div>
          <div className="admin-mangas-field">
            <label htmlFor="manga-sku">SKU</label>
            <input id="manga-sku" name="sku" value={formData.sku} onChange={handleChange} required maxLength={64} />
          </div>
          <div className="admin-mangas-field">
            <label htmlFor="manga-origin">Origen</label>
            <input id="manga-origin" name="origin" value={formData.origin} onChange={handleChange} required maxLength={100} />
          </div>
          <div className="admin-mangas-field">
            <label htmlFor="manga-release-date">Fecha de lanzamiento</label>
            <input id="manga-release-date" name="release_date" type="date" value={formData.release_date} onChange={handleChange} required />
          </div>
          <div className="admin-mangas-field">
            <label htmlFor="manga-price">Precio (CLP)</label>
            <input id="manga-price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="admin-mangas-field">
            <label htmlFor="manga-stock">Stock</label>
            <input id="manga-stock" name="stock" type="number" min="0" step="1" value={formData.stock} onChange={handleChange} required />
          </div>
          <div className="admin-mangas-field admin-mangas-field--full">
            <label htmlFor="manga-description">Descripción</label>
            <textarea id="manga-description" name="description" rows="4" value={formData.description} onChange={handleChange} required maxLength={5000} />
          </div>
          <fieldset className="admin-mangas-category-group">
            <legend>Categorías</legend>
            {categories.length > 0 ? categories.map((category) => (
              <label className="admin-mangas-checkbox" key={category.id}>
                <input
                  type="checkbox"
                  name="categoryIds"
                  value={category.id}
                  checked={formData.categoryIds.includes(category.id)}
                  onChange={handleCategoryChange}
                />
                {category.name}
              </label>
            )) : <p>No hay categorías disponibles.</p>}
          </fieldset>
          <fieldset className="admin-mangas-category-group">
            <legend>Demografía</legend>
            {demographicCategories.length > 0 ? demographicCategories.map((category) => (
              <label className="admin-mangas-checkbox" key={category.id}>
                <input
                  type="checkbox"
                  name="demographicCategoryIds"
                  value={category.id}
                  checked={formData.demographicCategoryIds.includes(category.id)}
                  onChange={handleCategoryChange}
                />
                {category.name}
              </label>
            )) : <p>No hay categorías demográficas disponibles.</p>}
          </fieldset>
        </div>

        <div className="checkout-modal__actions">
          <button
            className="checkout-modal__cancel"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="admin-mangas-button admin-mangas-button--primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar manga'}
          </button>
        </div>
      </form>
    </>
  );
};

export default AdminMangasForm;
