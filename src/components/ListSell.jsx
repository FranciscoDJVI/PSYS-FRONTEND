import { useSells } from "../hooks/useSells";
import FormatterPesos from "../utils/CurrencyFormatter";

function ListSellRegister() {
  const {
    sells,
    isLoading,
    error,
    nextPage,
    prevPage,
    totalCount,
    totalSalesPrice,
    goToNext,
    goToPrevious,
  } = useSells();

  if (isLoading) {
    return <div className="p-6 text-center"><p className="text-lg font-medium text-gray-600">Cargando ventas...</p></div>
  }

  if (error) {
    return <div className="p-6 text-center"><p className="text-lg font-medium text-red-600 bg-red-50 p-4 rounded-lg">Error al cargar las ventas.</p></div>
  }

  if (sells.length === 0) {
    return <div className="p-6 text-center"><p className="text-lg text-gray-500 bg-gray-50 p-4 rounded-lg">No hay ventas registradas.</p></div>
  }

  return (
    <div className='h-ful min-h-screen bg-gray-1000 bg-white dark:bg-gray-900 p-2'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
        {sells.map((sell) => (
          <div
            key={sell.sell_id}
            className={`bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 w-90 max-h-128 overflow-y-auto ${(sell.status)}`}
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
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{sell.type_pay}</p>
            </div>

            <div className="mb-4">
            </div>
            <hr className="my-4 border-gray-300" />
            <h4 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">Detalles</h4>

            {Array.isArray(sell.sells) && sell.sells.map((sells, index) => (
              <div
                key={sells.id || index}
                className='p-2 rounded-lg transition-all duration-300 hover:scale-105'
              >
                <div className="shadow-xl bg-gray-200  dark:bg-gray-900 p-4">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Producto: {sells.product_name}</p>
                  <p className="text-gray-700 dark:text-gray-300">Precio: <span className="font-bold text-black dark:text-white">{FormatterPesos(sells.product_price)}</span></p>
                  <p className="text-gray-700 dark:text-gray-300">Cantidad: <span className="font-bold text-gray-800 dark:text-gray-200">{sells.quantity}</span></p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center p-6 mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <button
          onClick={goToPrevious}
          disabled={!prevPage}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md text-xl
                       ${prevPage ? 'bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-xl text-white hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 hover:shadow-lg' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
        >
          Anterior
        </button>

        <span className="text-xl font-medium text-gray-700 dark:text-gray-300">
          Total de Ventas: {totalCount}
        </span>

        <span className="text-xl font-medium text-gray-700 dark:text-gray-300">
          Dinero/Ventas: {FormatterPesos(totalSalesPrice)}
        </span>

        <button
          onClick={goToNext}
          disabled={!nextPage}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md
                       ${nextPage ? 'bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-xl text-white hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 hover:shadow-lg' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
        >
          Siguiente
        </button>

      </div>
    </div>
  );
}

export default ListSellRegister;
