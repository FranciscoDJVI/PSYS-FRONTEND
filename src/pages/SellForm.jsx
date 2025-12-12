import { useState, useEffect, useCallback } from "react";
import { GetproductsSearch } from "../api/api.products";
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faShoppingBag, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PostSell } from "../api/api.sell"
import FormatterPesos from "../utils/CurrencyFormatter";

const INITIAL_STATE = {
  id_product: "",
  name: "",
  quantity: 0,
  quantity_pay: 0,
  type_pay: "Efectivo",
  price: 0
};

const IVA = 0.19

function SellForm() {
  const [sellFormData, setFormData] = useState(INITIAL_STATE);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [iva, setIva] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [change, setChange] = useState(0)
  const [car, setCar] = useState([])
  const [totalSell, setTotalSell] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [apiSells, setApiSells] = useState([])
  const handleChangeSearch = (e) => {
    setQuery(e.target.value);
  };

  const fetchProductSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    const normalizedQuery = searchQuery.trim().toLowerCase();
    try {
      const allData = await GetproductsSearch();
      const res = allData.data;
      console.log(res)
      const productSearch = res.filter(producto =>
        producto.name.toLowerCase().includes(normalizedQuery)
      );
      setResults(productSearch);
    } catch (error) {
      console.error("Error al obtener o filtrar productos:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [setResults, setLoading]);

  useEffect(() => {
    const normaliceQuery = query.toLowerCase()
    const delayDebounceFn = setTimeout(() => {
      if (normaliceQuery.length >= 3) {
        fetchProductSearch(normaliceQuery);
      } else {
        setResults([]);
      }
    }, 200);
    return () => clearTimeout(delayDebounceFn);
  }, [query, fetchProductSearch]);

  const handleChange = (e) => {
    setFormData({
      ...sellFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast.error("Selecciona un producto primero.");
      return;
    }
    const quantity = parseInt(sellFormData.quantity)
    const sellSubtotal = selectedProduct.price * quantity;
    const typePay = sellFormData.type_pay
    // Data for rendering
    const sellData = {
      "sells": [
        {
          'product': selectedProduct.name,
          "quantity": quantity,
          "sell_subtotal": sellSubtotal
        }
      ],
      'type_pay': typePay
    };
    // Data to send to API.
    const apiItem = {
      "product": selectedProduct.id,
      "product_name": selectedProduct.name,
      "product_price": selectedProduct.price.toString(),
      "quantity": quantity,
      "sell_subtotal": sellSubtotal.toString()
    };
    setCar(prevCar => [...prevCar, sellData]);
    setApiSells(prev => [...prev, apiItem]);
    setTotalSell(prevTotal => prevTotal + sellSubtotal);
    setFormData(INITIAL_STATE)
    setQuery("")
    setSelectedProduct(null);
    setTotal(0)
    setIva(0)
    setSubtotal(0)
    setChange(0)
  }
  const deleteItem = (indexToDelete) => {
    const itemToDelete = car[indexToDelete];
    const newCar = car.filter((_, i) => i !== indexToDelete);
    const newApiSells = apiSells.filter((_, i) => i !== indexToDelete);
    setCar(newCar)
    setApiSells(newApiSells)
    setTotalSell(prevTotal => prevTotal - itemToDelete.sells[0].sell_subtotal);
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
    console.log(dataToSend)
    const response = await PostSell(dataToSend);
    if (response.status !== 201) {
      toast.error("Error al realizar la venta");
    } else {
      toast.success("Venta realizada con éxito!");
      setFormData(INITIAL_STATE);
      setCar([])
      setApiSells([])
      setTotal(0)
      setSelectedProduct(null);
    }
  };
  useEffect(() => {
    const subtotalCart = totalSell / (1 + IVA);
    const ivaCart = totalSell - subtotalCart;
    setSubtotal(subtotalCart);
    setIva(ivaCart);
    setTotal(totalSell);
    setChange(sellFormData.quantity_pay - totalSell);
  }, [totalSell, sellFormData.quantity_pay]);
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 mb-0 border border-gray-200 dark:border-gray-700 overflow-y-auto min-h-screen">
      {loading && <p className="text-blue-500 text-center">Cargando...</p>}
      {!loading && results.length > 0 && (
        <ul className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mb-6 max-h-40 overflow-y-auto shadow-inner">
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
                setSelectedProduct(product); // Set selected product
                setQuery(product.name);
                setResults([]);
              }}
              className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer transition-colors duration-200 border-b border-gray-200 dark:border-gray-600 last:border-b-0 text-gray-900 dark:text-white"
            >
              <span className="font-semibold text-gray-800">{product.id}</span> - {product.name} - <span className="text-green-600 font-bold">Precio: ${product.price}</span>
            </li>
          ))}
        </ul>
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
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Vender
            </button>
            <button
              type="button"
              onClick={handleAddCar}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
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
              <span className="text-green-600 dark:text-green-400">{FormatterPesos(totalSell)}</span>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
export default SellForm;
