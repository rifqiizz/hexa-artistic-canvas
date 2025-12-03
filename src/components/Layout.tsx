import { ReactNode } from "react";
import { Link } from "react-router-dom";
import StaggeredMenu from "./StaggeredMenu";
import PageNavigation from "./PageNavigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Logo */}
      <Link to="/" className="fixed top-8 left-8 z-50 hover-lift">
        <img
          src="https://grcartikon.co.id/wp-content/uploads/2015/04/grcartikondotcom-logotype1.png"
          alt="Hexa Logo"
          className="h-12 w-auto"
        />
      </Link>

      {/* Navigation Menu */}
      <div className="fixed top-8 right-8 z-50">
        <StaggeredMenu />
      </div>

      {/* Page Navigation Arrows */}
      <PageNavigation />

      {/* Main Content */}
      <main className="w-full h-full">{children}</main>
    </div>
  );
};

export default Layout;
