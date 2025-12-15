import { Link } from "react-router-dom";
import Sections from "../components/Sections";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../context/ThemeContext";

function Home() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className='h-ful min-h-screen bg-gray-1000 dark:b-gray-900 p-8'>
      <header className="flex bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="title-principal text-4xl font-bold text-gray-800 dark:text-white">Psys</h1>
          <Link to="/" className="title-principal text-lg text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">Cerrar Sesión</Link>
        </div>
        <button
          onClick={toggleTheme}
          className="ml-auto text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
        </button>
      </header>
      <Sections />
    </div>
  );
}

export default Home;
