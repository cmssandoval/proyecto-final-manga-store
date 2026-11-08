import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AppProviders from '../src/contexts/AppProviders.jsx';
import UserContext from '../src/contexts/UserContext.jsx';
import HeaderMiniBanner from '../src/components/HeaderMiniBanner.jsx';

describe('Autenticación en el Header', () => {
  
  test('Debe mostrar el enlace de "Iniciar Sesión" cuando el usuario no está autenticado', () => {
    render(
      <MemoryRouter>
        <AppProviders>
          <UserContext.Provider value={{ user: null }}>
            <HeaderMiniBanner />
          </UserContext.Provider>
        </AppProviders>
      </MemoryRouter>
    );

    const loginLink = screen.getByRole('link', { name: /iniciar sesión/i });
    
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

});
