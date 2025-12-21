import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faUser } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false); // Cerrar dropdown al logout
  };

  return (
    <div>
      <nav className="flex flex-row flex-wrap items-center gap-6 font-medium mb-10 bg-white dark:bg-gray-800 p-4 dark:border-gray-700 text-xl">
        <Link to="/psys" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Home</Link>
        <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Productos</Link>
        <Link to="/sells" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Ventas</Link>
        <Link to="/sell-register" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Registros de Ventas</Link>
        <Link to="/users" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Usuarios</Link>

        <div className="ml-auto flex items-center gap-4">
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
      </nav>
    </div>
  );
}
export default Navbar;
