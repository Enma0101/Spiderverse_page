import { StrictMode } from 'react'

// ─────────────────────────────────────────────────────────
// CONSOLE INTERCEPTOR: SILENCE THIRD-PARTY WARNINGS
// The user requested to eradicate specific warnings caused 
// by unfixable third-party issues (Three.js deprecation, 
// WebGL float precision, Vite SourceMaps). 
// ─────────────────────────────────────────────────────────
const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (
    msg.includes('THREE.Clock: This module has been deprecated') ||
    msg.includes('WebGLProgram: Program Info Log') ||
    msg.includes('warning X4122: sum of') ||
    msg.includes('Alpha-premult and y-flip are deprecated')
  ) {
    return; // Ignore these specific warnings
  }
  originalWarn.apply(console, args);
};

console.error = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (
    msg.includes('Source map error') ||
    msg.includes('JSON.parse: unexpected character') ||
    msg.includes('Resource URL:')
  ) {
    return; // Ignore devtools sourcemap errors
  }
  originalError.apply(console, args);
};
// ─────────────────────────────────────────────────────────
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import './styles.css'

import './comics-page.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
