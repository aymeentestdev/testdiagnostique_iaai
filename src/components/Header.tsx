import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useTest } from '../context/TestContext';

interface HeaderProps {
  minimal?: boolean;
}

const Header: React.FC<HeaderProps> = ({ minimal = false }) => {
  const location = useLocation();
  const { userName } = useTest();
  
  return (
    <header className={`w-full ${minimal ? 'py-2 bg-white shadow-sm' : 'py-4 bg-primary-900 text-white'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <GraduationCap className={`h-8 w-8 ${minimal ? 'text-primary-900' : 'text-white'}`} />
          <span className={`font-heading text-xl font-bold ${minimal ? 'text-primary-900' : 'text-white'}`}>IAAI</span>
        </Link>
        
        {!minimal && (
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className={`font-medium hover:text-secondary-300 transition-colors ${location.pathname === '/' ? 'text-secondary-400' : ''}`}>
              Home
            </Link>
            {userName && (
              <Link to="/test" className={`font-medium hover:text-secondary-300 transition-colors ${location.pathname === '/test' ? 'text-secondary-400' : ''}`}>
                Test
              </Link>
            )}
            {userName && (
              <Link to="/results" className={`font-medium hover:text-secondary-300 transition-colors ${location.pathname === '/results' ? 'text-secondary-400' : ''}`}>
                Results
              </Link>
            )}
          </nav>
        )}
        
        {!minimal && userName && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-secondary-500 rounded-full flex items-center justify-center text-primary-900 font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium">{userName}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;