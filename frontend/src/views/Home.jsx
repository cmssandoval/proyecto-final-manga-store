import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faGift, faHeadset, faEnvelope } from '@fortawesome/free-solid-svg-icons';

import HeaderMiniBanner from '../components/HeaderMiniBanner';
import ProductCard from '../components/ProductCard';
import SectionTitle from '../components/SectionTitle';
import Footer from '../components/Footer';

import blackCloverImage from '../assets/img/Bclover32.jpg';
import dorohedoroImage from '../assets/img/dorohedoro12.jpg';
import nagatoroImage from '../assets/img/Nagatoro3.jpg';
import kaseImage from '../assets/img/Kase4.jpg';

const featuredProducts = [
  {
    series: 'Shonen',
    title: 'Black Clover',
    volume: 'Vol. 12',
    price: '$14.90',
    short: 'BC',
    tag: 'Top',
    colors: ['#f9d7e4', '#cfeeff'],
    image: blackCloverImage,
  },
  {
    series: 'Shonen',
    title: 'Dorohedoro',
    volume: 'Vol. 7',
    price: '$12.50',
    short: 'AH',
    tag: 'New',
    colors: ['#f7dff8', '#d8f4ff'],
    image: dorohedoroImage,
  },
  {
    series: 'Comedia',
    title: 'Nagatoro-san',
    volume: 'Vol. 16',
    price: '$16.20',
    short: 'JK',
    tag: 'Hot',
    colors: ['#f9d7d5', '#d9ebff'],
    image: nagatoroImage,
  },
  {
    series: 'Yuri',
    title: 'Kase-San & Yamada',
    volume: 'Vol. 4',
    price: '$15.00',
    short: 'DS',
    tag: 'Gift',
    colors: ['#f9dfe9', '#dceeff'],
    image: kaseImage,
  },
];

const serviceItems = [
  { icon: faBox, text: 'Envíos rápidos' },
  { icon: faGift, text: 'Gift cards' },
  { icon: faHeadset, text: 'Atención real' },
];

const Home = () => {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (productTitle) => {
    setCartCount((current) => current + 1);
    alert(`${productTitle} añadido al carrito`);
    console.log(`${productTitle} añadido al carrito`);
  };

  return (
    <div className="page">
      <div className="shell">
        <HeaderMiniBanner cartCount={cartCount} />

        <main className="main">
          <section className="hero">
            <div className="glow glow-right" />
            <div className="glow glow-left" />

            <div className="hero-grid">
              <div className="hero-copy">
                <p className="eyebrow">Colección nueva</p>
                <h1 className="title">Descubre tu próxima obsesión manga.</h1>
                <p className="description">
                  Encuentra ediciones premium, clásicos irresistibles y lanzamientos exclusivos para cada fan del manga.
                </p>
                <div className="actions">
                  <button className="button primary">Ver catálogo</button>
                  <button className="button secondary">Colecciones</button>
                </div>
              </div>

              <div className="feature-panel">
                <div className="feature-card">
                  <div className="feature-head">
                    <span className="pill">Best seller</span>
                    <span className="price">$22.90</span>
                  </div>

                  <div className="feature-cover">
                    <div className="cover-box">
                      <span className="cover-letter">M</span>
                    </div>
                  </div>

                  <div className="stats">
                    <div className="stat">
                      <span>Páginas</span>
                      <strong>220</strong>
                    </div>
                    <div className="stat">
                      <span>Edición</span>
                      <strong>Deluxe</strong>
                    </div>
                    <div className="stat">
                      <span>Rating</span>
                      <strong>4.9</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.title}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>

          <section className="info-grid">
            <div className="newsletter">              <div className="input-box">
                <input
                  type="email"
                  className="input"
                />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
