import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import axiosClient from "./api/axiosClient.js";

// Debug function for API testing
window.testApiConnection = async () => {
  try {
    console.log('🧪 Testing API connection...');
    const response = await axiosClient.get('prods/');
    console.log('✅ API Response:', { status: response.status, data: response.data });
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error('❌ API Connection failed:', error.message);
    console.error('Full error:', error);
    return { error: error.message, fullError: error };
  }
};

window.testProductsEndpoint = async () => {
  try {
    console.log('🧪 Testing products endpoint...');
    const response = await axiosClient.get('products/');
    console.log('✅ Products Response:', { status: response.status, data: response.data });
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error('❌ Products endpoint failed:', error.message);
    return { error: error.message };
  }
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
