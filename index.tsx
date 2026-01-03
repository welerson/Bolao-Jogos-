
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Bolão Premiado: Iniciando renderização...");

const init = () => {
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
    console.log("Bolão Premiado: Renderização concluída com sucesso.");
  } catch (error) {
    console.error("Erro fatal ao montar o aplicativo:", error);
    const display = document.getElementById('error-display');
    if (display) {
      display.style.display = 'block';
      display.innerText += "\nErro de Renderização: " + (error instanceof Error ? error.message : String(error));
    }
  }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
