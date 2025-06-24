import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { useTest } from '../context/TestContext';

interface HeaderProps {
  minimal?: boolean;
}

const Header: React.FC<HeaderProps> = ({ minimal = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userName, clearAnswers, setCurrentSubject } = useTest();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Intercept clicks towards home when a test is in progress
  const handleHomeNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (location.pathname === '/test') {
      e.preventDefault();
      setShowResetConfirm(true);
    } else {
      // If no test in progress, just reset silently as per global rule
      clearAnswers();
      setCurrentSubject(null);
    }
  };

  const confirmResetAndNavigate = () => {
    clearAnswers();
    setCurrentSubject(null);
    setShowResetConfirm(false);
    navigate('/');
  };

  return (
    <header className={`w-full ${minimal ? 'py-2 bg-white shadow-sm' : 'py-4 bg-primary-900 text-white'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" onClick={handleHomeNavigation} className="flex items-center space-x-2">
          <GraduationCap className={`h-8 w-8 ${minimal ? 'text-primary-900' : 'text-white'}`} />
          <span className={`font-heading text-xl font-bold ${minimal ? 'text-primary-900' : 'text-white'}`}>IAAI</span>
        </Link>
        
        {!minimal && (
          <nav className="hidden md:flex space-x-6">
            <Link to="/" onClick={handleHomeNavigation} className={`font-medium hover:text-secondary-300 transition-colors ${location.pathname === '/' ? 'text-secondary-400' : ''}`}>
              Accueil
            </Link>
            {userName && (
              <Link to="/test" className={`font-medium hover:text-secondary-300 transition-colors ${location.pathname === '/test' ? 'text-secondary-400' : ''}`}>
                Test
              </Link>
            )}
            {userName && (
              <Link to="/results" className={`font-medium hover:text-secondary-300 transition-colors ${location.pathname === '/results' ? 'text-secondary-400' : ''}`}>
                Résultats
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
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-center mb-4">Revenir à l'Accueil ?</h3>
            <p className="text-gray-600 mb-6 text-center">
              Le test sera réinitialisé. Êtes-vous sûr de vouloir quitter le test ?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Continuer le Test
              </button>
              <button
                onClick={confirmResetAndNavigate}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Revenir à l'Accueil
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;