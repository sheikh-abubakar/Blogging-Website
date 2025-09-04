import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

// Add debugging information
console.log('Starting application initialization...');
console.log('Environment:', import.meta.env.MODE);
console.log('API URL:', import.meta.env.VITE_API_URL || 'Not set');

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
  console.log('Application mounted successfully');
} catch (error) {
  console.error('Failed to mount application:', error);
  // Display error visibly in the DOM for easier debugging
  const rootDiv = document.getElementById("root");
  if (rootDiv) {
    rootDiv.innerHTML = `
      <div style="padding: 20px; background-color: #ffebee; color: #b71c1c; border-radius: 4px;">
        <h2>Application Failed to Load</h2>
        <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
        <p>Please check the console for more details.</p>
      </div>
    `;
  }
}