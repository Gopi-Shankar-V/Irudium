import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  showMatrix?: boolean;
}

const Layout = ({ children, showMatrix = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showMatrix && (
        <div className="gradient-bg" />
      )}
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;