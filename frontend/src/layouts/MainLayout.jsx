import HeaderMiniBanner from '../components/HeaderMiniBanner';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <HeaderMiniBanner />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
