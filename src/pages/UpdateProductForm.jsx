import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetProduct, UpdateProduct } from '../api/api.products';
import ProductForm from '../components/ProductForm';
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
      console.error('Error updating product:', error);
      toast.error('Error al actualizar el producto');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }


  return (
    <div>
      <header className="bg-white shadow-md p-6 rounded-lg mb-8 border border-gray-200 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Actualizar Producto</h1>
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

