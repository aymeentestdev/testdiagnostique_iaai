import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isTestPage = location.pathname === '/test';
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header minimal={isTestPage} />
      <main className="flex-grow">
        {children}
      </main>
      {!isTestPage && <Footer />}
    </div>
  );
};

export default Layout;