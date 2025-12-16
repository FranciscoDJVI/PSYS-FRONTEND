import { useState, useEffect } from 'react';
import { GetSell } from '../api/api.sell';
import logger from '../utils/logger';
import toast from 'react-hot-toast';

export function useSells() {
  const [sells, setSells] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Total sells price
  const [totalSalesPrice, setTotalSellsPrice] = useState(0);

  const loadSells = async (url = null) => {
    try {
      setIsLoading(true);
      const res = await GetSell(url || "sells/")
      setSells(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
      setTotalCount(res.data.count);
      setTotalSellsPrice(res.data.total_sales);
    } catch (error) {
      setError(error);
      logger.error("Error al cargar ventas:", error);
      toast.error('Error al cargar las ventas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSells();
  }, []);

  // Nextpage of list sells.
  const goToNext = () => {
    if (nextPage) {
      loadSells(nextPage)
    };
  }

  // Prevpage of list sells.
  const goToPrevious = () => {
    if (prevPage) {
      loadSells(prevPage)
    }
  };

  return {
    sells,
    isLoading,
    error,
    nextPage,
    prevPage,
    totalCount,
    totalSalesPrice,
    goToNext,
    goToPrevious,
  };
}
