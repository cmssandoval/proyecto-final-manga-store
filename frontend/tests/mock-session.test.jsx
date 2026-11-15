import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import CartContext from '../src/contexts/CartContext.jsx';
import DataContext from '../src/contexts/DataContext.jsx';
import UserContext from '../src/contexts/UserContext.jsx';
import HeaderMiniBanner from '../src/components/HeaderMiniBanner.jsx';

describe('Header authentication', () => {
  
  it('shows the sign-in link when the user is not authenticated', () => {
    render(
      <MemoryRouter>
        <CartContext.Provider value={{ cartCount: 0 }}>
          <DataContext.Provider value={{ mangas: [] }}>
            <UserContext.Provider value={{ user: null }}>
              <HeaderMiniBanner />
            </UserContext.Provider>
          </DataContext.Provider>
        </CartContext.Provider>
      </MemoryRouter>
    );

    const loginLink = screen.getByRole('link', { name: /iniciar sesión/i });
    
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

});
