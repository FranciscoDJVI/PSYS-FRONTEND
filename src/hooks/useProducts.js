import { useState, useEffect } from 'react';
import { GetProducts, DeleteProduct as DeleteProduct } from '../api/api.products';
import logger from '../utils/logger';
import toast from 'react-hot-toast';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //Paginations states
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const loadProducts = async (url = null) => {
    try {
      setIsLoading(true);
      const res = await GetProducts(url || "products/")
      setProducts(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
      setTotalCount(res.data.count);
    } catch (error) {
      setError(error);
      logger.error("Error al cargar productos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Nextpage of list products.
  const goToNext = () => {
    if (nextPage) {
      loadProducts(nextPage)
    };
  }

  // Prevpage of list products.
  const goToPrevious = () => {
    if (prevPage) {
      loadProducts(prevPage)
    }
  };

  const deleteProduct = async (id) => {
    try {
      await DeleteProduct(id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id != id)
      );
      toast.success('Producto eliminado exitosamente');
    } catch (err) {
      logger.error('Error al eliminar el producto:', err);
    }
  };
  return {
    products,
    isLoading,
    error,
    deleteProduct,
    nextPage,
    prevPage,
    totalCount,
    goToNext,
    goToPrevious,
  };
}

