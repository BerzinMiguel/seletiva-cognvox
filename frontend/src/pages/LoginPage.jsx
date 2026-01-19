import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/* --- ASSETS (Imagens e Ícones) --- */
import logoImg from '../assets/images/logoOficial.png'; 
import estudantesImg from '../assets/images/estudantesCognvox.png';
import aguardeImg from '../assets/images/aguarde.gif'; // Spinner de carregamento

/* --- ÍCONES (SVG) --- */
import iconAt from '../assets/images/at-sign.svg';
import iconInsta from '../assets/images/instagram.svg';
import iconWeb from '../assets/images/web.svg';

// ==============================================================================
// PÁGINA DE LOGIN 
// ==============================================================================
const LoginPage = () => {
  // --- ESTADOS LOCAIS ---
  // Controlam o que o usuário digita e o feedback visual da tela.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');     // Mensagem de erro (ex: "Senha inválida")
  const [loading, setLoading] = useState(false); // Mostra o GIF de "Aguarde" enquanto processa
  
  // Hooks do Contexto e Navegação
  const { login, isAuthenticated } = useAuth(); // Pega a função 'login' do AuthContext.jsx
  const navigate = useNavigate();

  // --- EFEITO DE PROTEÇÃO ---
  // Se o usuário já estiver logado),
  // redireciona automaticamente para a área interna (/atores) sem mostrar o formulário.
  useEffect(() => {
    if (isAuthenticated) navigate('/atores', { replace: true });
  }, [isAuthenticated, navigate]);

  // --- LOGIN  ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o reload da página HTML
    setError('');       // Limpa erros anteriores
    setLoading(true);   // Ativa o spinner

    try {
      
      // Chama a função login (que chama a API /auth/login)
      const result = await login(email, password);
      
      // Se sucesso, o Contexto já salvou o token. Só precisamos redirecionar.
      if (result.success) navigate('/atores');
      else setError(result.message || 'Falha no login');
      
    } catch (err) {
      setError('Erro de conexão.');
    } finally {
      setLoading(false); // Desativa o spinner independente do resultado
    }
  };

  /* ============================================================================
   *  (ESTILIZAÇÃO)
   * ============================================================================
   *
   */
  const colors = {
    navyBlue: '#1A2B75',
    inputBg: '#E8EBF5',
    bgGradient: 'radial-gradient(circle at center, #F3F4F6, #E0E7FF)',
  };

  const styles = {
    // Container que ocupa a tela inteira 
    viewport: {
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: colors.bgGradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif'
    },
    
    // O Cartão Central (Branco)
    mainCard: {
      display: 'flex',
      flexDirection: 'row', 
      width: '900px',
      maxWidth: '95%',
      height: '550px',
      backgroundColor: '#fff',
      borderRadius: '20px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
      overflow: 'hidden',
      position: 'relative'
    },

    // Lado Esquerdo: Formulário
    leftSection: {
      flex: '0 0 60%', // Ocupa 60% da largura do cartão
      padding: '0 50px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      zIndex: 2
    },
    
    // Lado Direito: Imagem Decorativa
    rightSection: {
      flex: '1', // Ocupa o restante (40%)
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: '30px'
    },

    bgImage: {
      position: 'absolute', top: 0, left: 0,
      width: '100%', height: '100%',
      objectFit: 'cover', objectPosition: 'center',
      zIndex: 0
    },

    headerWrapper: {
      marginBottom: '30px',
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    },
    logoImage: {
      height: 'auto', maxWidth: '180px', marginBottom: '10px'
    },
    areaRestrita: {
      color: colors.navyBlue, fontSize: '16px', fontWeight: '700',
      letterSpacing: '1px', textTransform: 'uppercase'
    },

    form: {
      display: 'flex', flexDirection: 'column', gap: '20px', 
      maxWidth: '350px', width: '100%', alignItems: 'center'
    },
    input: {
      width: '100%', height: '50px',
      backgroundColor: colors.inputBg,
      border: 'none', borderRadius: '25px',
      padding: '0 25px', fontSize: '15px',
      outline: 'none', boxSizing: 'border-box'
    },
    
    submitButton: {
      width: '130px', height: '45px',
      backgroundColor: colors.navyBlue,
      color: '#fff', border: 'none', borderRadius: '25px',
      fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
      marginTop: '10px', textTransform: 'uppercase'
    },
    
    forgotLink: {
      marginTop: '15px', color: '#64748B', fontSize: '13px',
      textDecoration: 'underline', cursor: 'pointer', display: 'inline-block'
    },

    // Barra de ícones sociais flutuante sobre a imagem
    socialWrapper: {
      zIndex: 10, display: 'flex', gap: '20px',
      padding: '12px 25px', backgroundColor: 'rgba(26, 43, 117, 0.6)',
      backdropFilter: 'blur(5px)', // Efeito de vidro fosco 
      borderRadius: '30px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    },
    socialIcon: {
      width: '22px', height: '22px',
      filter: 'brightness(0) invert(1)', // Transforma ícones pretos em brancos via CSS
      cursor: 'pointer', opacity: 0.9, transition: 'transform 0.2s'
    },
    
    errorMsg: {
      color: '#ef4444', fontSize: '13px', marginBottom: '10px', textAlign: 'center'
    }
  };

  return (
    <div style={styles.viewport}>
      <div style={styles.mainCard}>
        
        {/* === SEÇÃO ESQUERDA (Formulário) === */}
        <div style={styles.leftSection}>
          
          <div style={styles.headerWrapper}>
            <img src={logoImg} alt="Cognvox" style={styles.logoImage} />
            <div style={styles.areaRestrita}>ÁREA RESTRITA</div>
          </div>

          <form style={styles.form} onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Usuário" 
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <input 
              type="password" 
              placeholder="Senha" 
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Exibe mensagem de erro se houver falha no login */}
            {error && <div style={styles.errorMsg}>{error}</div>}

            <div>
              {/* Feedback Visual: Troca o botão por um GIF de carregamento */}
              {!loading ? (
                <button type="submit" style={styles.submitButton}>ENTRAR</button>
              ) : (
                <img src={aguardeImg} alt="Carregando" height="40px" style={{marginTop:'10px'}} />
              )}
            </div>

            <div>
              <a href="https://cognvox.net/email-recupera/" style={styles.forgotLink}>
                Esqueceu a Senha?
              </a>
            </div>
          </form>
        </div>

        {/* === SEÇÃO DIREITA  === */}
        <div style={styles.rightSection}>
          <img src={estudantesImg} alt="Estudantes" style={styles.bgImage} />

          <div style={styles.socialWrapper}>
             <a href="https://cognvox.net" target="_blank" rel="noopener noreferrer">
                <img src={iconWeb} alt="Site" style={styles.socialIcon} title="Website"/>
             </a>
             <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={iconInsta} alt="Instagram" style={styles.socialIcon} title="Instagram"/>
             </a>
             <a href="mailto:contato@cognvox.net" target="_blank" rel="noopener noreferrer">
                <img src={iconAt} alt="Email" style={styles.socialIcon} title="Contato"/>
             </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;