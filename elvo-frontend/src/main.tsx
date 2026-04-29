import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from './app/Providers';
import { AppRouter } from './app/Router';
import './styles/globals.css';
import api from './lib/axios';
import { useAuthStore } from './store/auth.store';

// Restore auth header from persisted store on every page load
const token = useAuthStore.getState().accessToken;
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <AppRouter />
    </Providers>
  </React.StrictMode>
);
