import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Login from '../components/Login'
import { AuthProvider } from '../context/AuthContext'
import axiosClient from '../api/axiosClient'
import toast from 'react-hot-toast'

// Mock dependencies
vi.mock('../api/axiosClient')
vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))
vi.mock('../utils/logger', () => ({
  error: vi.fn(),
}))
vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    login: vi.fn(),
    logout: vi.fn(),
  }),
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form correctly', () => {
    renderLogin()

    expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument()
    expect(screen.getByText('Ingresar')).toBeInTheDocument()
  })

  it('displays error message on failed login', async () => {
    const mockLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'))
    vi.mocked(require('../context/AuthContext').useAuth).mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
    })

    renderLogin()

    const usernameInput = screen.getByPlaceholderText('Usuario')
    const passwordInput = screen.getByPlaceholderText('Contraseña')
    const submitButton = screen.getByText('Ingresar')

    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'wrongpassword')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error de inicio de sesión. Por favor, verifica tus credenciales.')
    })
  })

  it('shows validation errors for empty fields', async () => {
    renderLogin()

    const submitButton = screen.getByText('Ingresar')
    fireEvent.click(submitButton)

    // HTML5 validation should prevent submission
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('handles network errors gracefully', async () => {
    const mockLogin = vi.fn().mockRejectedValue(new Error('Network Error'))
    vi.mocked(require('../context/AuthContext').useAuth).mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
    })

    renderLogin()

    const usernameInput = screen.getByPlaceholderText('Usuario')
    const passwordInput = screen.getByPlaceholderText('Contraseña')
    const submitButton = screen.getByText('Ingresar')

    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'testpass')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error de inicio de sesión. Por favor, verifica tus credenciales.')
    })
  })

  it('navigates on successful login for non-admin user', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ access: 'token', refresh: 'refresh' })
    vi.mocked(require('../context/AuthContext').useAuth).mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
    })

    renderLogin()

    const usernameInput = screen.getByPlaceholderText('Usuario')
    const passwordInput = screen.getByPlaceholderText('Contraseña')
    const submitButton = screen.getByText('Ingresar')

    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'testpass')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Inicio de sesión exitoso. ¡Bienvenido!')
      expect(mockNavigate).toHaveBeenCalledWith('/psys')
    })
  })

  it('handles admin login correctly', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ access: 'token', refresh: 'refresh' })
    vi.mocked(require('../context/AuthContext').useAuth).mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
    })

    renderLogin()

    const usernameInput = screen.getByPlaceholderText('Usuario')
    const passwordInput = screen.getByPlaceholderText('Contraseña')
    const submitButton = screen.getByText('Ingresar')

    await userEvent.type(usernameInput, 'admin')
    await userEvent.type(passwordInput, 'adminpass')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/psys')
    })
  })
})