import { Link } from 'react-router-dom';
import '../styles/not-found.css';

const NotFound = () => (
  <main className="not-found-page">
    <section className="not-found-card" aria-labelledby="not-found-title">
      <p className="not-found-card__eyebrow">Error 404</p>
      <h1 className="not-found-card__title" id="not-found-title">
        Esta página no existe
      </h1>
      <p className="not-found-card__description">
        Es posible que el enlace esté roto o que la página haya sido movida.
      </p>
      <Link to="/" className="not-found-card__link">
        Volver al inicio
      </Link>
    </section>
  </main>
);

export default NotFound;
