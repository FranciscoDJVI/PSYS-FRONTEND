import { Link } from "react-router-dom";
import Sections from "../components/Sections";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faUser } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Home() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false); // Cerrar dropdown al logout
  };

  return (
    <div className='h-ful min-h-screen bg-gray-1000 dark:b-gray-900 p-8'>
      <header className="flex bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="title-principal text-4xl font-bold text-gray-800 dark:text-white">Psys</h1>
          <div className="flex items-center gap-4">
            {/* Botón de usuario con dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <FontAwesomeIcon icon={faUser} />
                {user?.username || 'Usuario'}
              </button>
              
              {/* Dropdown menú */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">Hola, {user?.username || 'Usuario'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
            
            {/* Botón toggle tema */}
            <button
              onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
            </button>
          </div>
        </div>
      </header>
      <Sections />
    </div>
  );
}

export default Home;
