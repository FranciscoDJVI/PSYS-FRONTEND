import { useEffect, useState } from "react";
import { GetSell } from "../api/api.sell";
import FormatterPesos from "../utils/CurrencyFormatter";


const getCardColorClasses = (status) => {
  const statusLower = status?.toLowerCase();

  switch (statusLower) {
    case 'confirmed':
      return "border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20";
    case 'pending':
      return "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20";
    case 'canceled':
      return "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20";
    default:
      return "border-l-4 border-gray-400 bg-gray-50 dark:bg-gray-700/20";
  }
};


function ListSellRegister() {
  const [sellRegister, setSellRegister] = useState([]);


  useEffect(() => {
    async function loadSell() {
      try {
        const response = await GetSell();
        setSellRegister(response.data.results);
        console.log(response.data);
      } catch (error) {
        console.error("Error al cargar ventas:", error);
      }
    }
    loadSell();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {sellRegister.map((sell) => (
        <div
          key={sell.sell_id}
          className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${getCardColorClasses(sell.status)}`}
        >
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fecha</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">{sell.created_at}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Usuario</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">{sell.user}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{FormatterPesos(sell.total_price)}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tipo de pago</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">${sell.type_pay}</p>
          </div>

          <div className="mb-4">
          </div>
          <hr className="my-4 border-gray-300" />
          <h4 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">Detalles</h4>

          {Array.isArray(sell.sells) && sell.sells.map((sells, index) => (
            <div
              key={sells.id || index}
              className='mb-3 p-4 rounded-lg transition-all duration-300 hover:scale-105'
            >
              <div className="space-y-2 shadow-2xl bg-gray-900 p-4 rounded-2xl">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Producto: {sells.product_name}</p>
                <p className="text-gray-700 dark:text-gray-300">Precio: <span className="font-bold text-black dark:text-white">{FormatterPesos(sells.product_price)}</span></p>
                <p className="text-gray-700 dark:text-gray-300">Cantidad: <span className="font-bold text-gray-800 dark:text-gray-200">{sells.quantity}</span></p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ListSellRegister;
