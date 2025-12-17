import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../context/AuthContext'
import axiosClient from '../api/axiosClient'
import logger from '../utils/logger'
import toast from 'react-hot-toast'

// Mock dependencies
vi.mock('../api/axiosClient')
vi.mock('../utils/logger')
vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

  it('provides default auth state', () => {
    renderWithAuth()

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated')
    expect(screen.getByTestId('user')).toHaveTextContent('no-user')
  })

  it('handles successful login', async () => {
    const mockResponse = {
      data: {
        access: 'access-token',
        refresh: 'refresh-token',
        user_data: { username: 'testuser', email: 'test@example.com' },
        roles: ['user'],
      },
    }
    axiosClient.post.mockResolvedValue(mockResponse)

    renderWithAuth()

    const loginButton = screen.getByText('Login')
    loginButton.click()

    await waitFor(() => {
      expect(localStorage.getItem('access_token')).toBe('access-token')
      expect(localStorage.getItem('refresh_token')).toBe('refresh-token')
      expect(localStorage.getItem('userRole')).toBe('user')
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
      expect(screen.getByTestId('user')).toHaveTextContent('testuser')
    })
  })

  it('handles login failure with network error', async () => {
    const networkError = new Error('Network Error')
    networkError.response = { status: 500 }
    axiosClient.post.mockRejectedValue(networkError)

    renderWithAuth()

    const loginButton = screen.getByText('Login')
    loginButton.click()

    await waitFor(() => {
      expect(logger.error).toHaveBeenCalled()
      expect(toast.error).toHaveBeenCalledWith('Error de inicio de sesión. Por favor, verifica tus credenciales.')
      expect(localStorage.getItem('access_token')).toBeNull()
    })
  })

  it('handles login failure with 401 error', async () => {
    const authError = new Error('Unauthorized')
    authError.response = { status: 401, data: { detail: 'Invalid credentials' } }
    axiosClient.post.mockRejectedValue(authError)

    renderWithAuth()

    const loginButton = screen.getByText('Login')
    loginButton.click()

    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith('Login fallido:', { detail: 'Invalid credentials' })
      expect(toast.error).toHaveBeenCalledWith('Error de inicio de sesión. Por favor, verifica tus credenciales.')
    })
  })

  it('handles token refresh on mount', async () => {
    localStorage.setItem('refresh_token', 'valid-refresh-token')
    const mockRefreshResponse = {
      data: { access: 'new-access-token' },
    }
    axiosClient.post.mockResolvedValue(mockRefreshResponse)

    renderWithAuth()

    await waitFor(() => {
      expect(axiosClient.post).toHaveBeenCalledWith('auth/token/refresh/', { refresh: 'valid-refresh-token' })
      expect(localStorage.getItem('access_token')).toBe('new-access-token')
    })
  })

  it('handles token refresh failure on mount', async () => {
    localStorage.setItem('refresh_token', 'invalid-refresh-token')
    const refreshError = new Error('Invalid refresh token')
    refreshError.response = { status: 401 }
    axiosClient.post.mockRejectedValue(refreshError)

    renderWithAuth()

    await waitFor(() => {
      expect(logger.warn).toHaveBeenCalledWith('Error de red en refresh silencioso, manteniendo sesión.')
    })
  })

  it('clears tokens on logout', () => {
    localStorage.setItem('access_token', 'token')
    localStorage.setItem('refresh_token', 'refresh')
    localStorage.setItem('userRole', 'admin')
    localStorage.setItem('user', JSON.stringify({ username: 'test' }))

    renderWithAuth()

    const logoutButton = screen.getByText('Logout')
    logoutButton.click()

    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
    expect(localStorage.getItem('userRole')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated')
  })

  it('loads user from localStorage on mount', () => {
    localStorage.setItem('user', JSON.stringify({ username: 'storeduser' }))
    localStorage.setItem('access_token', 'stored-token')

    renderWithAuth()

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('user')).toHaveTextContent('storeduser')
  })

  it('handles malformed user data in localStorage', () => {
    localStorage.setItem('user', 'invalid-json')
    localStorage.setItem('access_token', 'token')

    // Should not throw error, handle gracefully
    expect(() => renderWithAuth()).not.toThrow()
    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
  })
})