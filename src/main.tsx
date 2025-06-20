import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ✅ Modular Context Provider (auth)
import { AuthProvider } from './feature/auth/hooks/AuthProvider.tsx';

// 🚀 Best practice: wrap app in AuthProvider here
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
