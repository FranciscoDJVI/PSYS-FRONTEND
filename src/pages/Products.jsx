import ListProduct from "../components/ListProducts";
import Navbar from "../components/Navbar";

function Products() {
  return (
    <div>
      <header className="flex flex-row justify-between items-center bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mb-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Productos</h1>
        <Navbar />
      </header>
      <ListProduct />
    </div>
  );
}

export default Products;
