const PersonalDataTab = ({ user }) => {
  const personalData = [
    { label: 'Nombre completo', value: user.full_name || user.name },
    { label: 'Nombre de usuario', value: user.display_name },
    { label: 'Correo electrónico', value: user.email },
  ];

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
    </div>
  );
};

export default PersonalDataTab;
