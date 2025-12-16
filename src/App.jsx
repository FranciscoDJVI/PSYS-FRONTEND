import Home from "./pages/Home";
import Products from "./pages/Products";
import { Routes, Route } from "react-router-dom";
import AddProduct from "./pages/AddProductPage";
import UpdateProductPage from "./pages/UpdateProductForm";
import Sell from "./pages/Sells.jsx";
import SellRegister from './pages/SellRegister.jsx'
import { Toaster } from 'react-hot-toast';
import Login from "./components/Login.jsx";
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function AppContent() {
  const { isDark } = useTheme();

  return (
    <div className="mx-0 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: isDark ? '#374151' : '#1f2937',
            color: '#f9fafb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path='/psys' element={<ProtectedRoute> <Home /></ProtectedRoute>}></Route>            <Route path="/products" element={<Products />}></Route>
        <Route path="/add-products" element={<ProtectedRoute><AddProduct /></ProtectedRoute>}></Route>
        <Route path="/update-product/:id" element={<ProtectedRoute><UpdateProductPage /></ProtectedRoute>}></Route>
        <Route path="/sells" element={<ProtectedRoute><Sell /></ProtectedRoute>}></Route>
        <Route path="/sell-register" element={<ProtectedRoute><SellRegister /></ProtectedRoute>}></Route>
      </Routes>
    </div >
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
export default App;
