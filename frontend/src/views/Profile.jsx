import { useState } from 'react';
import PersonalDataTab from '../components/profile/PersonalDataTab.jsx';
import OrdersTab from '../components/profile/OrdersTab.jsx';
import TrackingTab from '../components/profile/TrackingTab.jsx';
import useUserContext from '../hooks/useUserContext.js';
import '../styles/profile.css';

const profileTabs = [
  { id: 'personal-data', label: 'Datos Personales', component: PersonalDataTab },
  { id: 'orders', label: 'Mis Pedidos', component: OrdersTab },
  { id: 'tracking', label: 'Seguimiento', component: TrackingTab },
];

const ProfileView = () => {
  const { user } = useUserContext();
  const [activeTab, setActiveTab] = useState(profileTabs[0].id);
  const ActiveTab = profileTabs.find((tab) => tab.id === activeTab).component;
  const userName = user.display_name || user.full_name || user.name || user.email || 'Usuario';

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <header className="profile-hero">
          <div>
            <p className="profile-eyebrow">Cuenta</p>
            <h1 className="profile-title">Mi Cuenta</h1>
          </div>
          <p className="profile-status">Sesión iniciada</p>
        </header>

        <section className="profile-panel" aria-label="Información de la cuenta">
          <div className="profile-user">
            {user.image_link ? (
              <img className="profile-avatar" src={user.image_link} alt="" />
            ) : (
              <div className="profile-avatar" aria-hidden="true">
                {userName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <p className="profile-eyebrow">Bienvenido/a</p>
              <p className="profile-user__name">{userName}</p>
            </div>
          </div>

          <div className="profile-tabs" role="tablist" aria-label="Secciones de cuenta">
            {profileTabs.map(({ id, label }) => (
              <button
                key={id}
                id={`${id}-tab`}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                aria-controls="profile-tab-panel"
                className={`profile-tab${activeTab === id ? ' profile-tab--active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            id="profile-tab-panel"
            role="tabpanel"
            aria-labelledby={`${activeTab}-tab`}
            className="profile-tab-panel"
            tabIndex={0}
          >
            <ActiveTab user={user} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProfileView;
