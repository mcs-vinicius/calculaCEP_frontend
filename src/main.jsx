// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; 

// A lógica de ThemeProvider e CssBaseline agora está DENTRO do App.jsx
// para permitir a troca dinâmica de tema (Claro/Escuro).

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);