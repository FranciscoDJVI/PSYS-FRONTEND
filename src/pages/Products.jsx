/**import ListProduct from "../components/ListProducts";
import Navbar from "../components/Navbar";

function Products() {
  return (
    <div className='h-ful min-h-screen bg-gray-1000 dark:b-gray-900 p-8'>
      <header className="flex flex-row justify-between items-center bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mb-8 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Productos</h1>
        <Navbar />
      </header>
      <ListProduct />
    </div>
  );
}**/

//export default Products;

import ListProduct from "../components/ListProducts";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
function Products() {
  const { user, role, isAuthenticated } = useAuth();
  const canManage = role === 'Admin' || role === 'Administrador_tienda';
  console.log('rol: ', role)
  console.log('useAuth completo:', { user, role, isAuthenticated });
  return (
    <div className='h-ful min-h-screen bg-gray-1000 dark:b-gray-900 p-8'>
      <header className="flex flex-row justify-between items-center bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mb-8 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Productos</h1>
        <Navbar />
      </header>
      <ListProduct canManage={canManage} />
    </div>
  );
}
export default Products;