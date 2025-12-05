import { Link } from "react-router-dom";
import Sections from "../components/Sections";

function Home() {
  return (
    <div className="min-h-screen">
      <header className="flex flex-row justify-between items-center bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mb-8 border border-gray-200 dark:border-gray-700">
        <h1 className="title-principal text-4xl font-bold text-gray-800 dark:text-white">Psys</h1>
        <Link to="/" className="title-principal text-lg text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">Cerrar Sesión</Link>
      </header>
      <Sections />
    </div>
  );
}

export default Home;
