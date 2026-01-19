/* ==========================================================================
   ENTRADA DA APLICAÇÃO 
   ========================================================================== */
// Este arquivo é o primeiro a ser executado 

import React from 'react';
import ReactDOM from 'react-dom/client'; // Biblioteca que conecta o React ao DOM do navegador
import App from './App.jsx'; // O componente raiz que contém todas as rotas 

/* ==========================================================================
  ESTILO GLOBAL
   ========================================================================== */
// Ao importar os CSS aqui, eles são aplicados globalmente em TODO o site.
import './assets/css/bootstrap.css';        // Framework Grid/UI base
import './assets/css/bootstrap-icons.css';  // Ícones 
import './assets/css/webflow.css';          // Estilos base do Webflow
import './assets/css/cognvox.webflow.css';  // Estilos específicos exportados do Webflow
import './index.css';                       // Ajustes finos manuais

// Cria a "raiz" do React conectada ao elemento <div id="root"> do index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode: Ferramenta de desenvolvimento que ajuda a identificar problemas.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);