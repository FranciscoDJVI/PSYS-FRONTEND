import { useState, useCallback } from 'react';

const INITIAL_SELL_FORM_DATA = {
  id_product: "",
  name: "",
  quantity: 0,
  quantity_pay: 0,
  type_pay: "Efectivo",
  price: 0
};

const INITIAL_STATE = {
  results: [],
  loading: false,
  query: "",
  car: [],
  apiSells: [],
  totalSell: 0,
  sellFormData: INITIAL_SELL_FORM_DATA,
  showResults: false,
  selectedProduct: null,
  searchState: 'idle'
};

export const useSellContext = () => {
  const [state, setState] = useState(INITIAL_STATE);

  const setQuery = useCallback((query) => {
    setState(prev => ({ ...prev, query }));
  }, []);

  const setResults = useCallback((results) => {
    setState(prev => ({ ...prev, results }));
  }, []);

  const setLoading = useCallback((loading) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setSelectedProduct = useCallback((product) => {
    setState(prev => ({ ...prev, selectedProduct: product }));
  }, []);

  const setFormData = useCallback((data) => {
    setState(prev => ({ ...prev, sellFormData: data }));
  }, []);

  const setSearchState = useCallback((searchState) => {
    setState(prev => ({ ...prev, searchState }));
  }, []);

  const setShowResults = useCallback((show) => {
    setState(prev => ({ ...prev, showResults: show }));
  }, []);

  const addToCart = useCallback((item) => {
    setState(prev => ({
      ...prev,
      car: [...prev.car, item.display],
      apiSells: [...prev.apiSells, item.api],
      totalSell: prev.totalSell + Number(item.api.sell_subtotal),
      sellFormData: INITIAL_SELL_FORM_DATA,
      selectedProduct: null
    }));
  }, []);

  const removeFromCart = useCallback((index) => {
    setState(prev => {
      const newCar = [...prev.car];
      const newApiSells = [...prev.apiSells];
      const removedItem = newCar.splice(index, 1)[0];
      newApiSells.splice(index, 1);
      const removedSubtotal = removedItem.sells[0].sell_subtotal;

      return {
        ...prev,
        car: newCar,
        apiSells: newApiSells,
        totalSell: prev.totalSell - removedSubtotal
      };
    });
  }, []);

  const resetSell = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    setQuery,
    setResults,
    setLoading,
    setSelectedProduct,
    setFormData,
    addToCart,
    removeFromCart,
    setSearchState,
    setShowResults,
    resetSell
  };
};
