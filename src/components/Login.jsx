import { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logger from '../utils/logger';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      if (username !== 'admin') {
        toast.success('Inicio de sesión exitoso. ¡Bienvenido!');
        navigate('/psys');
        return;
      }
      //
      const from = location.state?.from?.pathname || '/psys';
      navigate(from, { replace: true });
      navigate('/psys');
    } catch (err) {
      logger.error('Login fallido', err);
      toast.error('Error de inicio de sesión. Por favor, verifica tus credenciales.');
      setError('Credenciales inválidas. Por favor, verifica tu usuario y contraseña.');
    }
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="login-form p-8 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
        <h2 className='text-center text-2xl font-bold text-gray-800 dark:text-white mb-6'>Iniciar Sesión</h2>

        {error && <p className="error-message text-red-600 font-medium text-center mb-4 p-2 bg-red-50 rounded-lg">{error}</p>}

        <div className='space-y-4'>
          <div className="form-group">
            <input
              type="text"
              id="username"
              value={username}
              placeholder='Usuario'
              onChange={(e) => setUsername(e.target.value)}
              required
              className='w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 focus:bg-white dark:focus:bg-gray-600 rounded-lg p-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              placeholder='Contraseña'
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 focus:bg-white dark:focus:bg-gray-600 rounded-lg p-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
            />
          </div>
        </div>

        <div className='text-center mt-6'>
          <button type="submit" className='bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>Ingresar</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
