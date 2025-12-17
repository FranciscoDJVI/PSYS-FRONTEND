import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import ErrorBoundary from '../components/ErrorBoundary'
import logger from '../utils/logger'

// Mock logger
vi.mock('../utils/logger')

// Component that throws an error
const ErrorComponent = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>Normal component</div>
}

// Component that throws in event handler
const EventErrorComponent = () => {
  const handleClick = () => {
    throw new Error('Event error')
  }
  return <button onClick={handleClick}>Click me</button>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children normally when no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('catches and displays error UI when child throws', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument()
    expect(screen.getByText('Ha ocurrido un error inesperado. Por favor, intenta recargar la página.')).toBeInTheDocument()
    expect(screen.getByText('Intentar nuevamente')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('logs error details', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(logger.error).toHaveBeenCalledWith('ErrorBoundary caught an error:', expect.any(Object))

    consoleSpy.mockRestore()
  })

  it('calls onError callback when provided', () => {
    const onErrorMock = vi.fn()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary onError={onErrorMock}>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(onErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object)
    )

    consoleSpy.mockRestore()
  })

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary fallback={customFallback}>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('shows error details in development mode', () => {
    // Mock NODE_ENV
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Detalles del error (desarrollo)')).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
    consoleSpy.mockRestore()
  })

  it('hides error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.queryByText('Detalles del error (desarrollo)')).not.toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
    consoleSpy.mockRestore()
  })

  it('retries and recovers from error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { rerender } = render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument()

    // Click retry button
    const retryButton = screen.getByText('Intentar nuevamente')
    fireEvent.click(retryButton)

    // Rerender with normal component
    rerender(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Normal component')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('handles errors in event handlers', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <EventErrorComponent />
      </ErrorBoundary>
    )

    const button = screen.getByText('Click me')
    fireEvent.click(button)

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('handles async errors', async () => {
    const AsyncErrorComponent = () => {
      const [error, setError] = React.useState(false)

      React.useEffect(() => {
        const timer = setTimeout(() => setError(true), 100)
        return () => clearTimeout(timer)
      }, [])

      if (error) {
        throw new Error('Async error')
      }

      return <div>Loading...</div>
    }

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <AsyncErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await new Promise(resolve => setTimeout(resolve, 150))

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })
})