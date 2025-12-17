import { vi, describe, it, expect, beforeEach } from 'vitest'
import { apiLogger } from '../api/apiLogger'

// Mock console methods
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

describe('apiLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('request logging', () => {
    it('logs request with method, url, and metadata', () => {
      const config = {
        method: 'get',
        url: '/api/products',
        headers: { 'Content-Type': 'application/json' },
        data: { name: 'test' },
        metadata: { requestId: '123' },
      }

      apiLogger.request(config)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[API REQUEST] GET /api/products',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { name: 'test' },
          requestId: '123',
        }
      )
    })

    it('handles missing method gracefully', () => {
      const config = {
        url: '/api/products',
      }

      apiLogger.request(config)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[API REQUEST] undefined /api/products',
        expect.any(Object)
      )
    })
  })

  describe('response logging', () => {
    it('logs successful response with duration', () => {
      const response = {
        status: 200,
        config: {
          method: 'get',
          url: '/api/products',
          metadata: { requestId: '123' },
        },
        data: [{ id: 1, name: 'Product' }],
      }
      const duration = 150

      apiLogger.response(response, duration)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[API RESPONSE] 200 GET /api/products - 150ms',
        {
          data: [{ id: 1, name: 'Product' }],
          requestId: '123',
        }
      )
    })

    it('handles missing config method', () => {
      const response = {
        status: 200,
        config: { url: '/api/products' },
        data: [],
      }

      apiLogger.response(response, 100)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[API RESPONSE] 200 undefined /api/products - 100ms',
        expect.any(Object)
      )
    })
  })

  describe('error logging', () => {
    it('logs request setup error', () => {
      const error = new Error('Request failed')
      error.config = {
        url: '/api/products',
        method: 'post',
        metadata: { requestId: '123' },
      }

      apiLogger.error(error, {
        type: 'REQUEST_SETUP_ERROR',
        phase: 'request',
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[API ERROR] POST /api/products - undefined Request failed',
        {
          type: 'REQUEST_SETUP_ERROR',
          phase: 'request',
          requestId: '123',
          response: undefined,
        }
      )
    })

    it('logs response error with status', () => {
      const error = new Error('Not Found')
      error.response = {
        status: 404,
        data: { detail: 'Product not found' },
      }
      error.config = {
        url: '/api/products/999',
        method: 'get',
        metadata: { requestId: '456' },
        _retry: true,
      }

      apiLogger.error(error, {
        attemptNumber: 2,
        hasRefreshToken: true,
        duration: 500,
        phase: 'response',
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[API ERROR] GET /api/products/999 - 404 Not Found',
        {
          attemptNumber: 2,
          hasRefreshToken: true,
          duration: 500,
          phase: 'response',
          requestId: '456',
          response: { detail: 'Product not found' },
        }
      )
    })

    it('handles network error without response', () => {
      const error = new Error('Network Error')

      apiLogger.error(error, { phase: 'network' })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[API ERROR] undefined undefined - NETWORK Network Error',
        {
          phase: 'network',
          requestId: undefined,
          response: undefined,
        }
      )
    })

    it('handles error without config', () => {
      const error = new Error('Unknown error')

      apiLogger.error(error)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[API ERROR] undefined undefined - NETWORK Unknown error',
        expect.any(Object)
      )
    })
  })

  describe('performance logging', () => {
    it('logs slow requests', () => {
      const data = {
        type: 'SLOW_REQUEST',
        url: '/api/products',
        duration: 6000,
        size: 1024,
      }

      apiLogger.performance(data)

      expect(consoleWarnSpy).toHaveBeenCalledWith('[API PERFORMANCE]', data)
    })
  })

  describe('response size calculation', () => {
    it('calculates JSON string length', () => {
      const data = { products: [{ id: 1 }, { id: 2 }] }

      const size = apiLogger.calculateResponseSize(data)

      expect(size).toBe(JSON.stringify(data).length)
    })

    it('returns 0 for invalid data', () => {
      const data = { circular: {} }
      data.circular.self = data // Create circular reference

      const size = apiLogger.calculateResponseSize(data)

      expect(size).toBe(0)
    })
  })
})