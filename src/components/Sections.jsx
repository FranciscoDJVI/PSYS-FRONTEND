import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faObjectGroup,
} from "@fortawesome/free-solid-svg-icons";

function Sections() {
  return (
    <div>
      <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 text-center">
          Aquí podrás encontrar las diferentes secciones para lo que desees realizar dentro de la página.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/products"
            className="bg-gradient-to-r from-green-400 to-green-500 dark:from-green-500 dark:to-green-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center text-center font-semibold hover:scale-105 transform"
          >
            <FontAwesomeIcon icon={faObjectGroup} className="text-3xl mb-2" />
            Agregar Producto
          </Link>
          <Link
            to="/sells"
            className="bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center text-center font-semibold hover:scale-105 transform"
          >
            <FontAwesomeIcon icon={faCartShopping} className="text-3xl mb-2" />
            Ventas
          </Link>
        </div>
      </section>
    </div>
  );
}
export default Sections;
