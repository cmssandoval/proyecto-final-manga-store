import { useState } from 'react';
import useUserContext from '../../hooks/useUserContext.js';

const PersonalDataTab = ({ user }) => {
  const { shippingAddress, updateShippingAddress } = useUserContext();
  const [addressInput, setAddressInput] = useState(shippingAddress);
  const [saveMessage, setSaveMessage] = useState('');

  const personalData = [
    { label: 'Nombre completo', value: user.full_name || user.name },
    { label: 'Nombre de usuario', value: user.display_name },
    { label: 'Correo electrónico', value: user.email },
  ];

  const handleSaveAddress = (event) => {
    event.preventDefault();

    if (!addressInput.trim()) {
      setSaveMessage('Escribe una dirección válida antes de guardarla.');
      return;
    }

    updateShippingAddress(addressInput);
    setSaveMessage('Dirección guardada para tus próximas compras.');
  };

  return (
    <div>
      <h2 className="profile-section-title">Datos Personales</h2>
      <dl className="profile-details">
        {personalData.map(({ label, value }) => (
          <div className="profile-detail" key={label}>
            <dt className="profile-detail__label">{label}</dt>
            <dd className="profile-detail__value">{value || 'No informado'}</dd>
          </div>
        ))}
      </dl>
      <form className="profile-address-form" onSubmit={handleSaveAddress}>
        <label className="profile-address-form__label" htmlFor="shipping-address">
          Dirección de envío
        </label>
        <p className="profile-address-form__hint">
          La usaremos para mostrar el destino de tus órdenes.
        </p>
        <textarea
          id="shipping-address"
          className="profile-address-form__input"
          value={addressInput}
          onChange={(event) => {
            setAddressInput(event.target.value);
            setSaveMessage('');
          }}
          rows={3}
          placeholder="Calle, número, ciudad, provincia y código postal"
          required
        />
        <button type="submit" className="profile-address-form__button">
          Guardar dirección
        </button>
        {saveMessage && <p className="profile-address-form__message" role="status">{saveMessage}</p>}
      </form>
    </div>
  );
};

export default PersonalDataTab;
