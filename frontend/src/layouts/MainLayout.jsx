import HeaderMiniBanner from "../components/HeaderMiniBanner";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <HeaderMiniBanner />
      <Outlet />
    </>
  );
};

export default MainLayout;
