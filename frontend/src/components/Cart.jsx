import { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = ({
  items = [],
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  shippingAddress,
}) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [addressOption, setAddressOption] = useState(shippingAddress ? 'default' : 'other');
  const [alternateAddress, setAlternateAddress] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <p>Descubre tu próxima lectura y añádela aquí.</p>
        <Link to="/catalogo" className="cart-empty__link">Explorar catálogo</Link>
      </div>
    );
  }

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const openCheckout = () => {
    setAddressOption(shippingAddress ? 'default' : 'other');
    setCheckoutError(
      shippingAddress
        ? ''
        : 'No tienes una dirección de envío guardada. Ingresa otra dirección para continuar.',
    );
    setIsCheckoutOpen(true);
  };

  const handleConfirmCheckout = (event) => {
    event.preventDefault();
    const address = addressOption === 'default' ? shippingAddress : alternateAddress.trim();

    if (!address) {
      setCheckoutError(
        addressOption === 'default'
          ? 'No tienes una dirección predeterminada. Elige otra dirección o guárdala en Mi Cuenta.'
          : 'Ingresa una dirección de envío para continuar.',
      );
      return;
    }

    try {
      onCheckout(address);
    } catch (error) {
      setCheckoutError(error.message || 'No se pudo completar la compra. Inténtalo nuevamente.');
    }
  };

  return (
    <>
      <div className="cart-container">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-details">
                <div>
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                </div>
                {item.description && (
                  <p className="cart-item-description">{item.description}</p>
                )}
              </div>
              <div className="cart-item-actions-container">
                <div className="cart-item-buttons">
                  <div className="cart-quantity">
                    <button
                      type="button"
                      className="cart-quantity__button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      aria-label={`Reducir cantidad de ${item.name}`}
                    >
                      −
                    </button>
                    <span aria-label={`Cantidad: ${item.quantity}`}>{item.quantity}</span>
                    <button
                      type="button"
                      className="cart-quantity__button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Aumentar cantidad de ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="cart-remove-button"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Resumen del pedido</h2>
          <p className="cart-summary__total">Total <strong>${total.toFixed(2)}</strong></p>
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
            Pagar
          </button>
        </div>
      </div>

      {isCheckoutOpen && (
        <div className="checkout-modal-backdrop">
          <section
            className="checkout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-modal-title"
          >
            <button
              type="button"
              className="checkout-modal__close"
              onClick={() => setIsCheckoutOpen(false)}
              aria-label="Cerrar selección de dirección"
            >
              ×
            </button>
            <p className="checkout-modal__eyebrow">Antes de pagar</p>
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
              <fieldset className="checkout-address-options">
                <legend>Dirección de envío</legend>
                <label className={`checkout-address-option${shippingAddress ? '' : ' checkout-address-option--disabled'}`}>
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
                <label className="checkout-address-option">
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
                <label className="checkout-address-input">
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

              {checkoutError && shippingAddress && (
                <p className="checkout-modal__error" role="alert">{checkoutError}</p>
              )}

              <div className="checkout-modal__actions">
                <button
                  type="button"
                  className="checkout-modal__cancel"
                  onClick={() => setIsCheckoutOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="cart-checkout-button">
                  Confirmar compra
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
