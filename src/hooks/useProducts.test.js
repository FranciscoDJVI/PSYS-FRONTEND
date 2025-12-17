import { renderHook, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useProducts } from '../hooks/useProducts'
import { GetProducts, DeleteProduct } from '../api/api.products'
import logger from '../utils/logger'
import toast from 'react-hot-toast'

// Mock dependencies
vi.mock('../api/api.products')
vi.mock('../utils/logger')
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
  },
}))

describe('useProducts Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads products successfully', async () => {
    const mockProducts = {
      data: {
        results: [
          { id: 1, name: 'Product 1', price: 10.0 },
          { id: 2, name: 'Product 2', price: 20.0 },
        ],
        next: null,
        previous: null,
        count: 2,
      },
    }
    GetProducts.mockResolvedValue(mockProducts)

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts.data.results)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.nextPage).toBeNull()
      expect(result.current.prevPage).toBeNull()
      expect(result.current.totalCount).toBe(2)
    })

    expect(GetProducts).toHaveBeenCalledWith('products/')
  })

  it('handles API error on load', async () => {
    const mockError = new Error('API Error')
    mockError.response = { status: 500, data: { detail: 'Server error' } }
    GetProducts.mockRejectedValue(mockError)

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.products).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe(mockError)
    })

    expect(logger.error).toHaveBeenCalledWith('Error al cargar productos:', mockError)
  })

  it('handles network error gracefully', async () => {
    const networkError = new Error('Network Error')
    GetProducts.mockRejectedValue(networkError)

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.products).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe(networkError)
    })
  })

  it('deletes product successfully', async () => {
    const initialProducts = [
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' },
    ]
    const mockProducts = {
      data: {
        results: initialProducts,
        next: null,
        previous: null,
        count: 2,
      },
    }
    GetProducts.mockResolvedValue(mockProducts)
    DeleteProduct.mockResolvedValue()

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.products).toEqual(initialProducts)
    })

    result.current.deleteProduct(1)

    await waitFor(() => {
      expect(result.current.products).toEqual([{ id: 2, name: 'Product 2' }])
    })

    expect(DeleteProduct).toHaveBeenCalledWith(1)
    expect(toast.success).toHaveBeenCalledWith('Producto eliminado exitosamente')
  })

  it('handles delete product error', async () => {
    const initialProducts = [{ id: 1, name: 'Product 1' }]
    const mockProducts = {
      data: {
        results: initialProducts,
        next: null,
        previous: null,
        count: 1,
      },
    }
    GetProducts.mockResolvedValue(mockProducts)

    const mockDeleteError = new Error('Delete failed')
    DeleteProduct.mockRejectedValue(mockDeleteError)

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.products).toEqual(initialProducts)
    })

    result.current.deleteProduct(1)

    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith('Error al eliminar el producto:', mockDeleteError)
      // Product should not be removed from state on error
      expect(result.current.products).toEqual(initialProducts)
    })
  })

  it('handles pagination navigation', async () => {
    const mockProductsPage1 = {
      data: {
        results: [{ id: 1, name: 'Product 1' }],
        next: 'products/?page=2',
        previous: null,
        count: 3,
      },
    }
    const mockProductsPage2 = {
      data: {
        results: [{ id: 2, name: 'Product 2' }],
        next: null,
        previous: 'products/?page=1',
        count: 3,
      },
    }

    GetProducts.mockResolvedValueOnce(mockProductsPage1)
      .mockResolvedValueOnce(mockProductsPage2)

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.products).toEqual([{ id: 1, name: 'Product 1' }])
      expect(result.current.nextPage).toBe('products/?page=2')
    })

    result.current.goToNext()

    await waitFor(() => {
      expect(result.current.products).toEqual([{ id: 2, name: 'Product 2' }])
      expect(result.current.prevPage).toBe('products/?page=1')
    })

    expect(GetProducts).toHaveBeenCalledWith('products/?page=2')
  })

  it('does not navigate if no next/previous page', async () => {
    const mockProducts = {
      data: {
        results: [{ id: 1, name: 'Product 1' }],
        next: null,
        previous: null,
        count: 1,
      },
    }
    GetProducts.mockResolvedValue(mockProducts)

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.products).toEqual([{ id: 1, name: 'Product 1' }])
    })

    result.current.goToNext()
    result.current.goToPrevious()

    // Should not call GetProducts again since no pages
    expect(GetProducts).toHaveBeenCalledTimes(1)
  })

  it('handles malformed API response', async () => {
    const malformedResponse = {
      data: {
        // Missing results, next, etc.
        invalid: 'data',
      },
    }
    GetProducts.mockResolvedValue(malformedResponse)

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.products).toBeUndefined()
      expect(result.current.isLoading).toBe(false)
      // Should handle gracefully without throwing
    })
  })
})