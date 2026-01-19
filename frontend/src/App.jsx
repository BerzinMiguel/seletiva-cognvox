import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';

// Pages 
import LoginPage from './pages/LoginPage';
import AtorGridPage from './pages/AtorGridPage';
import AtorFormPage from './pages/AtorFormPage';

// ==============================================================================
// ROTA PRIVADA 
// ==============================================================================
// Envolve as páginas que precisam de proteção.
// 1. Está carregando? -> Espera.
// 2. Não está logado? -> Redireciona para Login.
// 3. Está logado? -> Renderiza a página dentro do Layout.

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Pega o estado global de autenticação

  // 1. CARREGAMENTO
  // Enquanto o AuthContext verifica o LocalStorage, mostramos um aviso simples.
  // Isso evita que o usuário seja redirecionado para o login incorretamente.
  if (loading) {
    return <div style={{display:'flex', justifyContent:'center', marginTop:'50px'}}>Verificando credenciais...</div>;
  }

  // 2. BLOQUEIO DE SEGURANÇA
  // Se terminou de carregar e isAuthenticated é false, expulsa o usuário.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. RENDERIZAÇÃO PROTEGIDA
  // Se passou pelas verificações, renderiza a página solicitada.
  // componente <Layout>.
  return <Layout>{children}</Layout>;
};

// ==============================================================================
// APP PRINCIPAL
// ==============================================================================
function App() {
  return (
    // Habilita a navegação sem recarregar a página 
    <Router>
      {/*Envolve tudo para que TODAS as rotas tenham acesso ao usuário logado */}
      <AuthProvider>
        <Routes>
          
          {/* REGRA 1: Redirecionamento da Raiz*/}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* REGRA 2: Rota Pública*/}
          <Route path="/login" element={<LoginPage />} />

          {/* REGRA 3: Rotas Blindadas  */}
          
          {/* Rota de Listagem  */}
          <Route 
            path="/atores" 
            element={
              <PrivateRoute>
                <AtorGridPage />
              </PrivateRoute>
            } 
          />
          
          {/* Rota de Criação  */}
          <Route 
            path="/atores/novo" 
            element={
              <PrivateRoute>
                <AtorFormPage />
              </PrivateRoute>
            } 
          />

          {/* Rota de Edição  */}
          <Route 
            path="/atores/editar/:id" 
            element={
              <PrivateRoute>
                <AtorFormPage />
              </PrivateRoute>
            } 
          />

          {/* Rota Pega-Tudo
              Se o usuário digitar qualquer URL, manda de volta para o login.
              Funciona como uma página 404 que redireciona. */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;