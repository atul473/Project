import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Core Styles (Imported first to ensure the Gemini theme is applied immediately)
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx';

// Initialize the root element
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Optional: Dev message to confirm the frontend environment is ready
if (import.meta.env.DEV) {
  console.log("%c✦ Smart Digital Library Initialized ✦", "color: #4b90ff; font-weight: bold; font-size: 14px;");
}