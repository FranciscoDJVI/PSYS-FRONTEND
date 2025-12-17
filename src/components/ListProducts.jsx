import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { faToolbox, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import CardProduct from "./CardProduct";

// Clase de Tailwindcss para la disposición de columnas, usada en encabezado y filas
const COLUMNS_CLASSES = (canManage) => `grid ${canManage ? 'grid-cols-8' : 'grid-cols-7'} gap-4 place-items-start p-5`;
function ListProduct({ canManage = false }) {
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


  const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
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
    return <div className="p-6 text-center"><p className="text-lg text-gray-200 bg-gray-50 p-4 rounded-lg">No hay productos registrados.</p></div>
  }
  return (
    <div className="p-6 overflow-x-auto">
      <div className="min-w-full shadow-2xl rounded-2xl dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="mb-6 flex justify-end">
          {canManage && (
            <Link to={'/add-products/'} className="bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-xl text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-semibold">
              Nuevo Producto
              <FontAwesomeIcon icon={faToolbox} />
            </Link>
          )}
        </div>
        <div className="hidden md:block">
          <div className={`${COLUMNS_CLASSES(canManage)} bg-linear-to-r from-blue-600 to-blue-700 text-xl text-white font-bold`}>
            <div className="text-left">Nombre</div>
            <div className="text-left">Marca</div>
            <div className="text-left">Modelo</div>
            <div className="text-left">Dimensiones</div>
            <div className="text-right">Precio</div>
            <div className="text-left">Descripción</div>
            <div className="text-center">Stock</div>
            {canManage && <div className="text-center">Acciones</div>}
          </div>

          <div className="bg-gray-50">
            {Array.isArray(sortedProducts) && sortedProducts.map((product, index) => {
              const formattedPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(product.price);
              const stockColor = product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
              return (
                <div
                  className={`${COLUMNS_CLASSES(canManage)} py-4 border-b border-gray-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}
                  key={product.id}
                >
                  <div className="text-xl text-gray-700 dark:text-gray-300 truncate">{product.name}</div>
                  <div className="text-xl text-gray-700 dark:text-gray-300 truncate">{product.brand}</div>
                  <div className="text-xl text-gray-700 dark:text-gray-300 truncate">{product.model}</div>
                  <div className="text-xl text-gray-700 dark:text-gray-300 truncate">{product.sizes}</div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400 text-right">{formattedPrice}</div>
                  <div className="text-xl text-gray-600 dark:text-gray-400 max-w-xs" title={product.description}>{product.description.length > 30 ? `${product.description.substring(0, 30)}...` : product.description}</div>
                  <div className="text-center"><span className={`px-2 py-1 rounded-full text-sm ${stockColor}`}>{product.stock}</span></div>
                  {canManage && (
                    <div className="flex gap-2 justify-center">
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
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="block md:hidden">
          {Array.isArray(sortedProducts) && sortedProducts.map((product) => (
            <CardProduct key={product.id} product={product} canManage={canManage} handleDelete={handleDelete} />
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center p-6 mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:border-gray-700">
        <button
          onClick={goToPrevious}
          disabled={!prevPage}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md
                       ${prevPage ? 'bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 hover:shadow-lg' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
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
                       ${nextPage ? 'bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 hover:shadow-lg' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
        >
          Siguiente
        </button>
      </div>
    </div >
  );
}
export default ListProduct;
