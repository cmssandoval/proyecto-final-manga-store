import { useEffect } from 'react';
import AdminMangas from '../components/AdminMangas.jsx';

const AdminMangasView = () => {
  useEffect(() => {
    document.title = 'Administrar mangas | MoonShelf';
  }, []);

  return (
    <main className="admin-mangas-page" aria-labelledby="admin-mangas-title">
      <div className="admin-mangas-shell">
        <header className="admin-mangas-header">
          <div>
            <p className="admin-mangas-eyebrow">Administración</p>
            <h1 id="admin-mangas-title">Mangas</h1>
            <p>Administra el catálogo de productos de MoonShelf.</p>
          </div>
        </header>
        <AdminMangas />
      </div>
    </main>
  );
};

export default AdminMangasView;
