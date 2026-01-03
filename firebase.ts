
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCrF8nphHnsxHf2r4s-jU8WsYRAnwAxSfo",
  authDomain: "bolao-jogos.firebaseapp.com",
  projectId: "bolao-jogos",
  storageBucket: "bolao-jogos.firebasestorage.app",
  messagingSenderId: "516531866990",
  appId: "1:516531866990:web:3004a504bfa898aa89c57f",
  measurementId: "G-VLMLTT2L9C"
};

// Inicializa o Firebase apenas se estiver no navegador
let app;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
} catch (e) {
  console.error("Erro ao inicializar Firebase:", e);
}

export { app, analytics };
