import ProductForm from '../components/ProductForm';
import { PostProducts } from '../api/api.products';
import toast from 'react-hot-toast';

function AddProduct() {
  const handleCreate = async (data) => {
    try {
      await PostProducts(data);
      toast.success('Producto agregado exitosamente');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Error al agregar el producto');
    }
  };

  return (
    <div>
      <header className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mb-8 border border-gray-200 dark:border-gray-700 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Agregar Producto</h1>
      </header>
      <ProductForm
        onSubmit={handleCreate}
        buttonText="Agregar"
        isUpdate={false}
      />
    </div>
  );
}

export default AddProduct;

