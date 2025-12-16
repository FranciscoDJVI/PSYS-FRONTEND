import { useState, useEffect } from 'react';
import { GetSell } from '../api/api.sell';

export function useSells() {
  const [sells, setSells] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //Pagination states
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const loadSells = async (url = null) => {
    try {
      setIsLoading(true);
      const res = await GetSell(url || "sells/")
      setSells(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
      setTotalCount(res.data.count);
    } catch (error) {
      setError(error);
      console.error("Error al cargar ventas:", error);
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
    goToNext,
    goToPrevious,
  };
}
