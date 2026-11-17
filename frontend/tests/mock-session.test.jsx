import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import CartContext from '../src/contexts/CartContext.jsx';
import DataContext from '../src/contexts/DataContext.jsx';
import UserContext from '../src/contexts/UserContext.jsx';
import HeaderMiniBanner from '../src/components/HeaderMiniBanner.jsx';
import OrdersContext from '../src/contexts/OrdersContext.jsx';

describe('Header authentication', () => {
  
  it('shows the sign-in link when the user is not authenticated', () => {
    render(
      <MemoryRouter>
        <DataContext.Provider value={{ mangas: [] }}>
          <UserContext.Provider value={{ user: null }}>
            <OrdersContext.Provider value={{ orders: [] }}>
              <CartContext.Provider value={{ cartCount: 0 }}>
                <HeaderMiniBanner />
              </CartContext.Provider>
            </OrdersContext.Provider>
          </UserContext.Provider>
        </DataContext.Provider>
      </MemoryRouter>
    );

    const loginLink = screen.getByRole('link', { name: /iniciar sesión/i });
    
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

});
