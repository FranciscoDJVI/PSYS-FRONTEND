import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function CardProduct({ product, canManage, handleDelete }) {
  const formattedPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(product.price);
  const stockColor = product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 border dark:border-gray-700">
      <div className="space-y-2">
        <div><strong>Nombre:</strong> {product.name}</div>
        <div><strong>Marca:</strong> {product.brand}</div>
        <div><strong>Modelo:</strong> {product.model}</div>
        <div><strong>Dimensiones:</strong> {product.sizes}</div>
        <div><strong>Precio:</strong> {formattedPrice}</div>
        <div title={product.description}><strong>Descripción:</strong> {product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}</div>
        <div><strong>Stock:</strong> <span className={`px-2 py-1 rounded-full text-sm ${stockColor}`}>{product.stock}</span></div>
      </div>
      {canManage && (
        <div className="flex justify-end gap-2 mt-4">
          <Link to={`/update-product/${product.id}`} className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50">
            <FontAwesomeIcon icon={faEdit} />
          </Link>
          <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}
    </div>
  );
}

export default CardProduct;