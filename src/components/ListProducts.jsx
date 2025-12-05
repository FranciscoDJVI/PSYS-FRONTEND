import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { faToolbox, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

// Clase de Tailwindcss para la disposición de columnas, usada en encabezado y filas
const COLUMNS_CLASSES = "grid grid-cols-10 place-items-center p-5";

function ListProduct() {
  const {
    products,
    isLoading,
    error,
    deleteProduct,
    nextPage,
    prevPage,
    totalCount,
    goToNext,
    goToPrevious,
  } = useProducts();

  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este producto? Esta acción es irreversible.")) {
      deleteProduct(id);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center"><p className="text-lg font-medium text-gray-600">Cargando productos...</p></div>
  }

  if (error) {
    return <div className="p-6 text-center"><p className="text-lg font-medium text-red-600 bg-red-50 p-4 rounded-lg">Error al cargar los productos.</p></div>
  }

  if (products.length === 0) {
    return <div className="p-6 text-center"><p className="text-lg text-gray-500 bg-gray-50 p-4 rounded-lg">No hay productos registrados.</p></div>
  }

  return (
    <div className="p-6 overflow-x-auto">
      <div className="min-w-full shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="mb-6 flex justify-end">
          <Link to={'/add-products/'} className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-semibold">
            Nuevo Producto
            <FontAwesomeIcon icon={faToolbox} />
          </Link>
        </div>
        <div className={`${COLUMNS_CLASSES} bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-t-2xl`}>
          <div className="truncate">Nombre</div>
          <div className="truncate">Marca</div>
          <div className="truncate">Modelo</div>
          <div className="truncate">Dimensiones</div>
          <div className="truncate">Stock</div>
          <div className="truncate">Precio</div>
          <div className="truncate ml-60">Descripción</div>
          <div className="truncate ml-100">Stock</div>
          <div className="truncate ml-100">Acciones</div>
        </div>

        <div className="bg-gray-50">
          {Array.isArray(products) && products.map((product, index) => (
            <div
              className={`${COLUMNS_CLASSES} py-4 border-b border-gray-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}
              key={product.id}
            >
              <div className="text-sm text-gray-700 dark:text-gray-300 truncate">{product.name}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 truncate">{product.brand}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 truncate">{product.model}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 truncate">{product.sizes}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">{product.stock}</div>
              <div className="text-sm font-bold text-green-600 dark:text-green-400">${product.price}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs ml-60">{product.description}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 truncate ml-100">{product.stock}</div>
              <div className="flex gap-2 justify-center ml-100">
                <Link to={`/update-product/${product.id}`} className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50">
                  <FontAwesomeIcon icon={faEdit} />
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center p-6 mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <button
          onClick={goToPrevious}
          disabled={!prevPage}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md
                       ${prevPage ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 hover:shadow-lg' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
        >
          Anterior
        </button>

        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Total de Productos: {totalCount}
        </span>

        <button
          onClick={goToNext}
          disabled={!nextPage}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md
                       ${nextPage ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 hover:shadow-lg' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
        >
          Siguiente
        </button>

      </div>
    </div >

  );
}
export default ListProduct;
