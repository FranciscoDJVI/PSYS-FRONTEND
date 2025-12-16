import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetProduct, UpdateProduct } from '../api/api.products';
import ProductForm from '../components/ProductForm';
import logger from '../utils/logger';
import toast from 'react-hot-toast';

function UpdateProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          const res = await GetProduct(id);
          setProduct(res.data);
          setError(null)
        } catch (error) {
          logger.error("Error loading product data:", error);
          setError("Error loading product data:", error);
        }

      }
    };
    loadProduct();
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      await UpdateProduct(id, data);
      toast.success('Producto actualizado exitosamente');
    } catch (error) {
      logger.error('Error updating product:', error);
      toast.error('Error al actualizar el producto');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className='h-ful min-h-screen bg-gray-1000 dark:b-gray-900 p-8'>
      <header className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Actualizar Producto</h1>
      </header>
      <ProductForm
        onSubmit={handleUpdate}
        initialData={product}
        buttonText="Actualizar"
        isUpdate={true}
      />
    </div>
  );
}

export default UpdateProductPage;
