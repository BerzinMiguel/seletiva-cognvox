import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// ==============================================================================
// AUTENTICAÇÃO 
// ==============================================================================
// Segurança do Frontend.
// Ele armazena quem é o usuário logado e fornece as funções de Login/Logout
// para qualquer página da aplicação.

// 1. CRIA O CONTEXTO VAZIO
const AuthContext = createContext({});

// Em vez de importar useContext e AuthContext em todo arquivo,
// basta importar 'useAuth()' para acessar os dados do usuário.
export function useAuth() {
  return useContext(AuthContext);
}

// 3. PROVIDER 
// Este componente envolve toda a aplicação 
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Estado do usuário (null = não logado)
  const [loading, setLoading] = useState(true); // Controla o carregamento inicial

  // --- EFEITO DE INICIALIZAÇÃO 
  // Roda apenas uma vez quando a tela carrega.
  // Verifica se o usuário já tinha feito login antes 
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        // Se achou o token, reinjeta ele no cabeçalho do Axios.
        // Assim, as próximas requisições já vão autenticadas.
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erro ao restaurar sessão", e);
        localStorage.clear(); // Se o JSON estiver corrompido, limpa tudo por segurança
      }
    }
    // Libera a renderização da tela
    setLoading(false);
  }, []);

  // --- FUNÇÃO DE LOGIN ---
  // Conectada ao Backend Python (routes_auth.py)
  const login = async (email, password) => {
    try {
      // Faz o POST enviando as credenciais
      const response = await api.post('/auth/login', { email, password });

      // Se o backend aceitar e retornar o token:
      if (response.data.accessToken) {
        const { accessToken, user } = response.data;

        // 1. Salva no navegador para persistência
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        // 2. Configura o Axios globalmente com esse token
        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        
        // 3. Atualiza o estado da aplicação
        setUser(user);
        return { success: true };
      } 
      
      // Caso o backend retorne 200 mas sem token 
      return { success: false, message: response.data.erro || 'Falha na autenticação' };

    } catch (error) {
      console.error("Erro no login:", error);
      // Retorna a mensagem de erro vinda do backend 
      return { 
        success: false, 
        message: error.response?.data?.erro || 'Erro ao conectar com o servidor.' 
      };
    }
  };

  // --- FUNÇÃO DE LOGOUT ---
  const logout = () => {
    // Limpa o armazenamento local
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    // Remove o token do cabeçalho do Axios
    api.defaults.headers.Authorization = undefined;
    
    // Zera o estado do usuário
    setUser(null);
  };

  // Objeto com tudo que será exposto para as outras páginas
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user, 
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Renderização Condicional:
        Isso evita que a tela de Login pisque para um usuário que já estava logado.
      */}
      {!loading && children}
    </AuthContext.Provider>
  );
}