import Navbar from "../components/Navbar";
import SellForm from "./SellForm";

function Sell() {
  return (
    <div className='h-ful min-h-screen bg-gray-1000 dark:b-gray-900 p-8'>
      <header className="flex flex-row justify-between items-center bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mb-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Ventas</h1>
        <Navbar />
      </header>
      <SellForm />
    </div>
  );
}

export default Sell;
