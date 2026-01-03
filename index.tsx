
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("Bolão Premiado: Iniciando renderização em " + new Date().toLocaleTimeString());

const renderApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error("Elemento 'root' não encontrado no DOM.");
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Bolão Premiado: App montado com sucesso.");
  } catch (error) {
    console.error("Erro crítico na renderização:", error);
    const errorDisplay = document.getElementById('error-display');
    if (errorDisplay) {
      errorDisplay.style.display = 'block';
      errorDisplay.innerText += "\n\nFalha no React: " + (error as Error).message;
    }
  }
};

// Pequeno delay para garantir que o DOM e o importmap estejam prontos
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
