
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import { WishlistProvider } from './WishlistContext';
import { ToastProvider } from './ToastContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);
