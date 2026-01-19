import axios from 'axios';

// Cria uma instância do Axios com configurações padrão.
// baseURL: Define o prefixo de todas as chamadas.
const api = axios.create({
  baseURL: 'http://localhost:5000', 
});

// ==============================================================================
// REQUISIÇÃO 
// ==============================================================================
// Este bloco roda ANTES de cada requisição sair do navegador.
// Injetar o Token JWT automaticamente no cabeçalho.
api.interceptors.request.use(async (config) => {
  // Busca o token salvo no navegador
  const token = localStorage.getItem('accessToken');
  
  // Se existir um token, adiciona o cabeçalho Authorization
  // Isso evita ter que passar o token manualmente em cada chamada da API.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==============================================================================
// RESPOSTA 
// ==============================================================================
// Este bloco roda assim que a resposta chega do Backend, mas ANTES de chegar
// no seu componente 
// Centralizar o tratamento de tokens expirados.

api.interceptors.response.use(
  (response) => response, // Se der sucesso (200, 201), apenas repassa os dados.
  (error) => {
    // Pega a URL original da requisição que falhou
    const requestUrl = error.config ? error.config.url : '';
    
    // Verifica se o erro foi 401 (Não autorizado)
    if (error.response && error.response.status === 401) {
      
      // --- LÓGICA DE SEGURANÇA CRUCIAL ---
      // Se o usuário tentar fazer LOGIN e errar a senha, o backend retorna 401.
      // Nesse caso, NÃO devemos redirecionar, pois ele já está na tela de login.
      // O erro deve passar para o componente LoginPage exibir "Senha Inválida".
      
      // Mas, se ele tentar acessar '/atores' e der 401,
      // significa que o token venceu ou é falso. Forçamos o logout.
      if (!requestUrl.includes('/login')) {
          console.error("Sessão expirada ou Token inválido. Redirecionando para Login...");
          
          // Limpa os dados do usuário do navegador
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          
          // Força o redirecionamento para a tela de login 
          window.location.href = '/login';
      }
    }
    
    // Repassa o erro para que o componente possa tratar falhas específicas
    return Promise.reject(error);
  }
);

export default api;