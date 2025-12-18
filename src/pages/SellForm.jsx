import { useEffect, useCallback } from "react";
import { GetproductsSearch } from "../api/api.products";
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faShoppingBag, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PostSell } from "../api/api.sell"
import FormatterPesos from "../utils/CurrencyFormatter";
import logger from "../utils/logger";
import { useSellContext } from "../context/useSellContextHook";

const IVA = 0.19

function SellForm() {
  const {
    state,
    setQuery,
    setResults,
    setLoading,
    setSelectedProduct,
    setFormData,
    addToCart,
    removeFromCart,
    setSearchState,
    setShowResults,
    resetSell
  } = useSellContext();

  const {
    results,
    loading,
    query,
    car,
    apiSells,
    totalSell,
    sellFormData,
    showResults
  } = state;

  const subtotal = totalSell;
  const iva = (subtotal * IVA);
  const total = subtotal + iva;
  const change = parseFloat(sellFormData.quantity_pay || 0) - total;

  const handleChangeSearch = (e) => {
    setQuery(e.target.value);
  };

  const fetchProductSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setResults([]);
      setLoading(false);
      setShowResults(false);
      setSearchState('idle');
      return;
    }
    setSearchState('searching');
    setShowResults(true);
    try {
      // API call con timeout razonable
      const response = await GetproductsSearch();

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid API response format');
      }
      // Filtrado client-side
      const filteredProducts = response.data.filter(producto => {
        if (!producto || !producto.name) return false;
        return producto.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      // Actualizar estado
      setResults(filteredProducts);
      setSearchState('results');

    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setSearchState('error');
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  }, [setResults, setLoading, setSearchState, setShowResults]);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 3) {
      setResults([]);
      setShowResults(false);
      setLoading(false);
      setSearchState('idle');
      return;
    }
    const debounceTimer = setTimeout(() => {
      fetchProductSearch(normalizedQuery);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, fetchProductSearch, setLoading, setResults, setSearchState, setShowResults]);

  const handleChange = (e) => {
    setFormData({
      ...sellFormData,
      [e.target.name]: e.target.value,
    });
  };
  // Add products to car and send data.
  const handleAddCar = async (e) => {
    e.preventDefault();
    if (!state.selectedProduct) {
      toast.error("Selecciona un producto primero.");
      return;
    }
    const quantity = parseInt(sellFormData.quantity)
    const sellSubtotal = state.selectedProduct.price * quantity;
    const typePay = sellFormData.type_pay

    const item = {
      display: {
        sells: [{
          product: state.selectedProduct.name,
          quantity: quantity,
          sell_subtotal: sellSubtotal
        }],
        type_pay: typePay
      },
      api: {
        product: state.selectedProduct.id,
        product_name: state.selectedProduct.name,
        product_price: state.selectedProduct.price.toString(),
        quantity: quantity,
        sell_subtotal: sellSubtotal.toString()
      }
    };

    addToCart(item);
    setQuery("");
    setSelectedProduct(null);
  }
  const deleteItem = (indexToDelete) => {
    removeFromCart(indexToDelete);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (car.length === 0) {
      toast.error("El carrito está vacío. Agregue productos para vender.");
      return;
    }
    const dataToSend = {
      sells: apiSells,
      type_pay: sellFormData.type_pay
    };

    try {
      const response = await PostSell(dataToSend);

      if (response.status !== 201 && response.status !== 200) {
        toast.error("Error al realizar la venta");
      } else {
        toast.success("Venta realizada con éxito!");
        resetSell();
      }
    } catch (error) {
      // Error ya está loggeado por axiosClient interceptor
      if (import.meta.env.DEV) {
        logger.warn('Error adicional en handleSubmit:', error.message);
      }
      toast.error("Error al realizar la venta. Verifica stock del producto o tu conexión.");
    }
  };



  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 mb-0 border border-gray-200 dark:border-gray-700 overflow-y-auto min-h-screen">
      {showResults && (
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mb-6 shadow-inner">
          {loading && (
            <div className="p-3 text-center">
              <p className="text-blue-500 animate-pulse">Buscando productos...</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="max-h-40 overflow-y-auto">
              {results.map((product) => (
                <li
                  key={product.id}
                  onClick={() => {
                    setFormData({
                      ...sellFormData,
                      id_product: product.id,
                      name: product.name,
                      price: product.price,
                    });
                    setSelectedProduct(product);
                    setQuery(product.name);
                    setResults([]);
                    setShowResults(false);
                    setSearchState('idle');
                  }}
                  className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer transition-colors duration-200 border-b border-gray-200 dark:border-gray-600 last:border-b-0 text-gray-900 dark:text-white"
                >
                  <span className="font-semibold text-gray-800">{product.id}</span> - {product.name} - <span className="text-green-600 font-bold">Precio: ${product.price}</span>
                </li>
              ))}
            </ul>
          )}

          {!loading && results.length === 0 && (
            <div className="p-3 text-center">
              <p className="text-gray-500">No se encontraron productos que coincidan con tu búsqueda</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 text-gray-700 border -border-gray-100 p-4  rounded-2xl"
        >
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Buscar Producto</label>
            <input
              name="search-input"
              type="text"
              placeholder="Buscar producto..."
              value={query}
              onChange={handleChangeSearch}
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <input type="hidden"
            name="id_product"
            value={sellFormData.id_product}
            onChange={handleChange}
          />
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Cantidad</label>
            <input
              name="quantity"
              type="number"
              placeholder="Cantidad"
              value={sellFormData.quantity}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-linear-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Vender
            </button>
            <button
              type="button"
              onClick={handleAddCar}
              className="flex-1 bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faShoppingBag} />
              Agregar al Carrito
            </button>
          </div>
        </form>
        <aside className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl shadow-md border border-gray-500 dark:border-gray-600">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">Resumen</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Subtotal:</span>
              <span className="font-bold text-green-600 dark:text-green-400">{FormatterPesos(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">IVA:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{FormatterPesos(iva)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Total:</span>
              <span className="font-bold text-green-600 dark:text-green-400">{FormatterPesos(total)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Cambio:</span>
              <span className="font-bold text-red-600 dark:text-red-400">{FormatterPesos(change)}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
              <select
                name="type_pay"
                value={sellFormData.type_pay}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 dark:text-white"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta debito">Tarjeta Débito</option>
                <option value="Tarjeta credito">Tarjeta Crédito</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monto Pagado</label>
              <input
                name="quantity_pay"
                type="number"
                placeholder="Monto pagado"
                value={sellFormData.quantity_pay}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </aside>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="flex justify-between items-center mb-6">
            <span className="text-4xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faCartShopping} className="text-blue-500 dark:text-blue-400" />
            </span>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xl font-semibold">
              {car.length} artículos
            </span>
          </h2>
          <div className="max-h-64 overflow-y-auto mb-4">
            <ul className="space-y-3">
              {car.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 dark:text-gray-200">{item.sells[0].product}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Cantidad: {item.sells[0].quantity}</div>
                  </div>
                  <div className="font-bold text-green-600 dark:text-green-400 mr-4">{FormatterPesos(item.sells[0].sell_subtotal)}</div>
                  <button
                    type="button"
                    onClick={() => deleteItem(index)}
                    className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span className="text-gray-800 dark:text-white">Total:</span>
              <span className="text-green-600 dark:text-green-400">{FormatterPesos(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
export default SellForm;
