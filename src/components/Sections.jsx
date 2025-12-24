import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faObjectGroup,
  faInfoCircle,
  faUserEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";

function Sections() {
  const [showInfo, setShowInfo] = useState(false);
  const { role, isAuthenticated } = useAuth()

  return (
    <div>
      <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center items-center mb-8">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-blue-500 dark:text-blue-400 cursor-pointer mr-2"
            onClick={() => setShowInfo(!showInfo)}
          />
        </div>
        {showInfo && (
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-4 rounded-lg mb-4 text-justify">
            Información adicional: Esta sección te permite navegar a las áreas principales de la aplicación, como agregar productos y gestionar ventas.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/products"
            className="bg-linear-to-r text-2xl from-green-400 to-green-500 dark:from-green-500 dark:to-green-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center text-center font-semibold h-50"
          >
            <FontAwesomeIcon icon={faObjectGroup} className="text-5xl mb-2" />
            Agregar Producto
          </Link>
          <Link
            to="/sells"
            className="bg-linear-to-r text-2xl  from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center text-center font-semibold "
          >
            <FontAwesomeIcon icon={faCartShopping} className="text-5xl mb-2" />
            Ventas
          </Link>
          {(role === 'Admin' || role === 'Administrador_tienda') && (
            < Link
              to="/users"
              className="bg-linear-to-r text-2xl from-cyan-400 to-cyan-500 dark:from-cyan-500 dark:to-cyan-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center text-center font-semibold h-50"
            >
              <FontAwesomeIcon icon={faUserEdit} className="text-5xl mb-2" />
              Usuarios
            </Link>
          )}
        </div>
      </section >
    </div >
  );
}
export default Sections;
