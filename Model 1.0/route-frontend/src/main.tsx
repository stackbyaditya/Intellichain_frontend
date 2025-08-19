import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from '@/context'
import { AlertProvider } from '@/context'
import './index.css'

// async function enableMocking() {
//   if (process.env.NODE_ENV !== 'development') {
//     return;
//   }

//   const { worker } = await import('./mocks/browser');

//   // `worker.start()` returns a Promise that resolves once the Service Worker is ready
//   return worker.start();
// }

console.log("APP-MOUNT-START");

// enableMocking().then(() => { // Temporarily comment out
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <AlertProvider>
            <SettingsProvider>
              <App />
            </SettingsProvider>
          </AlertProvider>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
// }); // Temporarily comment out

console.log("APP-MOUNT-END");