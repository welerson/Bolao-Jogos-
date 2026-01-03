
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("Bolão Premiado: Sistema iniciado.");

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Erro fatal: Root não encontrado.");
}
