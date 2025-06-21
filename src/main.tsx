// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppRouter from './routes/Router.tsx';
import { AppProvider } from './context/appProvider.tsx';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <AppProvider>
      <AppRouter />
    </AppProvider>
  // </StrictMode>,
);