import { ReactNode } from "react";
import { Link } from "react-router-dom";
import StaggeredMenu from "./StaggeredMenu";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Logo */}
      <Link to="/" className="fixed top-8 left-8 z-50 hover-lift">
        <img
          src="https://hexaintegra.com/wp-content/uploads/2020/12/logo_hexa.png"
          alt="Hexa Logo"
          className="h-12 w-auto"
        />
      </Link>

      {/* Navigation Menu */}
      <div className="fixed top-8 right-8 z-50">
        <StaggeredMenu />
      </div>

      {/* Main Content */}
      <main className="w-full h-full">{children}</main>
    </div>
  );
};

export default Layout;
