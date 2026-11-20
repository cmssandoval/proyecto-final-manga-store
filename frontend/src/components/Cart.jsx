import { useState } from 'react';
import { Link } from 'react-router-dom';
import formatClp from '../utils/formatClp';
import calculateOrderTotals from '../utils/calculateOrderTotals.js';

const Cart = ({
  items = [],
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onCheckout,
  shippingAddress,
  isLoading = false,
  error = '',
}) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [addressOption, setAddressOption] = useState(shippingAddress ? 'default' : 'other');
  const [alternateAddress, setAlternateAddress] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [cartActionError, setCartActionError] = useState('');
  const [isClearingCart, setIsClearingCart] = useState(false);

  if (isLoading) {
    return <p role="status">Cargando carrito...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        {error && <p role="alert">{error}</p>}
        <h2 className="cart-empty__title">Tu carrito está vacío</h2>
        <p className="cart-empty__description">Descubre tu próxima lectura y añádela aquí.</p>
        <Link to="/catalogo" className="cart-empty__link">Explorar catálogo</Link>
      </div>
    );
  }

  const { netAmount, taxAmount, total } = calculateOrderTotals(items);

  const handleRemoveItem = async (productId) => {
    setCartActionError('');
    try {
      await onRemoveItem(productId);
    } catch (actionError) {
      setCartActionError(actionError.message || 'No se pudo quitar el manga del carrito.');
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    setCartActionError('');
    try {
      await onUpdateQuantity(productId, quantity);
    } catch (actionError) {
      setCartActionError(actionError.message || 'No se pudo actualizar la cantidad.');
    }
  };

  const handleClearCart = async () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres vaciar el carrito? Esta acción no se puede deshacer.',
    );
    if (!confirmed) return;

    setCartActionError('');
    setIsClearingCart(true);
    try {
      await onClearCart();
    } catch (actionError) {
      setCartActionError(actionError.message || 'No se pudo vaciar el carrito.');
    } finally {
      setIsClearingCart(false);
    }
  };

  const openCheckout = () => {
    setAddressOption(shippingAddress ? 'default' : 'other');
    setAlternateAddress('');
    setCheckoutError('');
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setAddressOption(shippingAddress ? 'default' : 'other');
    setAlternateAddress('');
    setCheckoutError('');
  };

  const handleConfirmCheckout = async (event) => {
    event.preventDefault();
    if (isSubmittingOrder) return;
    const address = addressOption === 'default' ? shippingAddress : alternateAddress.trim();

    if (!address) {
      setCheckoutError(
        addressOption === 'default'
          ? 'No tienes una dirección predeterminada. Elige otra dirección o guárdala en Mi Cuenta.'
          : 'Ingresa una dirección de envío para continuar.',
      );
      return;
    }

    setIsSubmittingOrder(true);
    try {
      await onCheckout(address);
      closeCheckout();
      window.alert('¡Orden registrada!');
    } catch (error) {
      setCheckoutError(error.message || 'No se pudo completar la compra. Inténtalo nuevamente.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <>
      <div className="cart-page__layout">
        {(error || cartActionError) && (
          <p role="alert">{cartActionError || error}</p>
        )}
        <div className="cart-page__items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item__image" />
              <div className="cart-item__details">
                <div>
                  <h3 className="cart-item__title">{item.name}</h3>
                  <p className="cart-item__price">{formatClp(item.price)}</p>
                </div>
                {item.description && (
                  <p className="cart-item__description">{item.description}</p>
                )}
              </div>
              <div className="cart-item__actions">
                <div className="cart-item__controls">
                  <div className="cart-item__quantity">
                    <button
                      type="button"
                      className="cart-item__quantity-button"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      aria-label={`Reducir cantidad de ${item.name}`}
                    >
                      −
                    </button>
                    <span aria-label={`Cantidad: ${item.quantity}`}>{item.quantity}</span>
                    <button
                      type="button"
                      className="cart-item__quantity-button"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Aumentar cantidad de ${item.name}`}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="cart-item__remove-button"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary__header">
            <h2 className="cart-summary__title">Resumen del pedido</h2>
            <button
              type="button"
              className="cart-summary__clear-button"
              onClick={handleClearCart}
              disabled={isClearingCart}
              aria-label="Vaciar carrito"
            >
              {isClearingCart ? 'Vaciando...' : 'Vaciar carrito'}
            </button>
          </div>
          <p className="cart-summary__amount">
            <span>Subtotal</span>
            <strong>{formatClp(netAmount)}</strong>
          </p>
          <p className="cart-summary__amount">
            <span>IVA (19%)</span>
            <strong>{formatClp(taxAmount)}</strong>
          </p>
          <p className="cart-summary__total">Total <strong>{formatClp(total)}</strong></p>
          {shippingAddress && (
            <p className="cart-summary__address">
              Dirección predeterminada: <strong>{shippingAddress}</strong>
            </p>
          )}
          <button
            type="button"
            className="cart-checkout-button"
            onClick={openCheckout}
          >
            Continuar compra
          </button>
        </div>
      </div>

      {isCheckoutOpen && (
        <div className="checkout-modal__backdrop">
          <section
            className="checkout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-modal-title"
          >
            <button
              type="button"
              className="checkout-modal__close"
              onClick={closeCheckout}
              aria-label="Cerrar selección de dirección"
            >
              ×
            </button>
            <p className="checkout-modal__eyebrow">Confirmar pedido</p>
            <h2 className="checkout-modal__title" id="checkout-modal-title">
              ¿A dónde enviamos tu pedido?
            </h2>

            {!shippingAddress && (
              <p className="checkout-modal__error" role="alert">
                No tienes una dirección de envío guardada en tu perfil. Ingresa otra dirección para esta compra.
                {' '}Puedes guardar una dirección predeterminada en <Link to="/perfil">Mi Cuenta</Link>.
              </p>
            )}

            <form onSubmit={handleConfirmCheckout}>
              <fieldset className="checkout-modal__address-options">
                <legend>Dirección de envío</legend>
                <label className={`checkout-modal__address-option${shippingAddress ? '' : ' checkout-modal__address-option--disabled'}`}>
                  <input
                    type="radio"
                    name="checkout-address"
                    value="default"
                    checked={addressOption === 'default'}
                    disabled={!shippingAddress}
                    onChange={() => {
                      setAddressOption('default');
                      setCheckoutError('');
                    }}
                  />
                  <span>
                    <strong>Usar dirección predeterminada</strong>
                    <span>{shippingAddress || 'No hay una dirección guardada en tu perfil.'}</span>
                  </span>
                </label>
                <label className="checkout-modal__address-option">
                  <input
                    type="radio"
                    name="checkout-address"
                    value="other"
                    checked={addressOption === 'other'}
                    onChange={() => {
                      setAddressOption('other');
                      setCheckoutError('');
                    }}
                  />
                  <span>
                    <strong>Enviar a otra dirección</strong>
                    <span>Usar una dirección solo para esta orden.</span>
                  </span>
                </label>
              </fieldset>

              {addressOption === 'other' && (
                <label className="checkout-modal__address-input">
                  <span>Nueva dirección</span>
                  <textarea
                    value={alternateAddress}
                    onChange={(event) => {
                      setAlternateAddress(event.target.value);
                      setCheckoutError('');
                    }}
                    rows={3}
                    placeholder="Calle, número, ciudad, provincia y código postal"
                    required
                    autoFocus
                  />
                </label>
              )}

              {checkoutError && (
                <p className="checkout-modal__error" role="alert">{checkoutError}</p>
              )}

              <div className="checkout-modal__actions">
                <button
                  type="button"
                  className="checkout-modal__cancel"
                  onClick={closeCheckout}
                  disabled={isSubmittingOrder}
                >
                  Cancelar
                </button>
                <button type="submit" className="cart-checkout-button" disabled={isSubmittingOrder}>
                  {isSubmittingOrder ? 'Procesando...' : 'Confirmar pedido'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default Cart;
