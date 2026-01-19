import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Imagens
import logo from '../assets/images/logo.png'; 
import userPlaceholder from '../assets/images/aluno_default.png';

// CSS Imports
// Importação de estilos globais e bibliotecas (Bootstrap, Webflow)
import '../assets/css/cognvox.webflow.css';
import '../assets/css/webflow.css';
import '../assets/css/bootstrap.css';
import '../assets/css/bootstrap-icons.css';

// ==============================================================================
// COMPONENTE DE LAYOUT 
// ==============================================================================
// Este componente envolve todas as páginas internas do sistema.
// Ele renderiza a Sidebar fixa à esquerda e o conteúdo da página à direita.
const Layout = ({ children }) => {
  // Hooks de Contexto e Navegação
  const { logout, user } = useAuth(); // Acesso aos dados do usuário logado
  const navigate = useNavigate();
  const location = useLocation();
  

  // Estado para controlar qual menu está expandido.
 
  const [activeMenu, setActiveMenu] = useState('gestao'); 

  // Função de Logout: Limpa o token e redireciona para login
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Utilitário para verificar rota ativa 
  const isActive = (path) => location.pathname.startsWith(path);

  // Função para alternar (abrir/fechar) os submenus
  const toggleMenu = (menuId) => {
    // Se clicar no menu que já está aberto, ele fecha (null)
    if (activeMenu === menuId) {
      setActiveMenu(null); 
    } else {
      // Senão, abre o novo e fecha o anterior automaticamente (efeito sanfona)
      setActiveMenu(menuId); 
    }
  };

  // --- Configuração dos Itens do Menu ---
  // Array de objetos para facilitar a renderização e manutenção.
  const menuItems = [
    { id: 'gestao', label: 'Gestão', icon: 'bi-grid-fill', subs: [{ label: 'Atores', path: '/atores' }, { label: 'Turmas', path: '#' }] },
    { id: 'agenda', label: 'Agenda', icon: 'bi-calendar-date-fill', subs: [{ label: 'Calendário', path: '#' }] },
    { id: 'sessoes', label: 'Sessões', icon: 'bi-play-circle-fill', subs: [{ label: 'Histórico', path: '#' }] },
    { id: 'cursos', label: 'Cursos EAD', icon: 'bi-mortarboard-fill', subs: [{ label: 'Meus Cursos', path: '#' }] },
    { id: 'avaliacao', label: 'Avaliação', icon: 'bi-clipboard-check-fill', subs: [{ label: 'Resultados', path: '#' }] },
    { id: 'praticas', label: 'Práticas', icon: 'bi-puzzle-fill', subs: [{ label: 'Exercícios', path: '#' }] },
    { id: 'indicadores', label: 'Indicadores', icon: 'bi-bar-chart-fill', subs: [{ label: 'Dashboard', path: '#' }] },
    { id: 'familia', label: 'Família', icon: 'bi-people-fill', subs: [{ label: 'Responsáveis', path: '#' }] },
    { id: 'artefato', label: 'Artefato', icon: 'bi-box-seam-fill', subs: [{ label: 'Materiais', path: '#' }] },
    { id: 'idioma', label: 'Idioma', icon: 'bi-translate', subs: [{ label: 'Configuração', path: '#' }] },
    { id: 'mensagens', label: 'Mensagens', icon: 'bi-chat-dots-fill', subs: [{ label: 'Caixa de Entrada', path: '#' }] },
    { id: 'log', label: 'Log Geral', icon: 'bi-file-earmark-text-fill', subs: [{ label: 'Auditoria', path: '#' }] },
    { id: 'patrimonio', label: 'Patrimônio', icon: 'bi-building-fill', subs: [{ label: 'Bens', path: '#' }] },
    { id: 'relatorios', label: 'Relatórios', icon: 'bi-file-text-fill', subs: [{ label: 'Geral', path: '#' }] },
    { id: 'suporte', label: 'Suporte', icon: 'bi-headset', subs: [{ label: 'Abrir Chamado', path: '#' }] },
  ];

  return (
    // Wrapper Flexbox: Garante que Sidebar e Conteúdo fiquem lado a lado
    <div className="layout-wrapper" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#eef1f5' }}>
      
      {/* =================================================================================
          SIDEBAR 
         ================================================================================= */}
      <div className="sidebar-blue" style={{ 
        width: '260px', 
        backgroundColor: '#203a8a', /* Azul Institucional */
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed', /* Fixa a barra na tela enquanto o conteúdo rola */
        height: '100%',
        zIndex: 1000,
        boxShadow: '4px 0 15px rgba(32, 58, 138, 0.4)', 
        overflow: 'hidden'
      }}>
        
        {/* 1. ÁREA DA LOGO */}
        <div className="logo-area" style={{ 
          padding: '15px', 
          backgroundColor: 'transparent', 
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <img src={logo} alt="Cognvox" style={{ maxWidth: '140px' }} />
        </div>

        {/* 2. PERFIL DO USUÁRIO  */}
        <div className="user-profile-horizontal" style={{
          padding: '15px 20px',
          display: 'flex',
          alignItems: 'center', 
          gap: '15px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.1)'
        }}>
          {/* Avatar / Foto */}
          <div className="user-avatar" style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #fff',
            flexShrink: 0
          }}>
            <img src={userPlaceholder} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {/* Nome / Email  */}
          <div className="user-name" style={{ 
            color: '#fff', 
            fontWeight: '600', 
            fontSize: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
             {/* Exibe parte do email ou 'Admin' se não houver usuário */}
             {user?.email ? user.email.split('@')[0] : 'Admin'}
          </div>
        </div>

        {/* 3. MENU DE NAVEGAÇÃO*/}
        {/* 'flex: 1' faz esta área ocupar todo o espaço vertical disponível restante */}
        <nav className="nav-scroll" style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '10px 0',
          scrollbarWidth: 'thin',
          scrollbarColor: '#4a62a8 #203a8a'
        }}>
          {/* Loop para renderizar os itens do menu baseados no array 'menuItems' */}
          {menuItems.map((item) => (
            <div key={item.id} className="nav-group">
              
              {/* Item Principal (Pai) */}
              <div 
                onClick={() => toggleMenu(item.id)}
                style={{ 
                  padding: '12px 20px', 
                  cursor: 'pointer',
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // Destaque visual se estiver ativo
                  color: activeMenu === item.id ? '#fff' : 'rgba(255,255,255,0.7)',
                  backgroundColor: activeMenu === item.id ? 'rgba(0,0,0,0.2)' : 'transparent',
                  transition: 'all 0.2s',
                  borderLeft: activeMenu === item.id ? '4px solid #00c6ff' : '4px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <i className={`bi ${item.icon}`} style={{ marginRight: '10px', fontSize: '16px' }}></i>
                  {item.label}
                </div>
                {/* Ícone da seta (gira dependendo se está aberto ou fechado) */}
                <i className={`bi bi-chevron-${activeMenu === item.id ? 'down' : 'right'}`} style={{ fontSize: '10px', opacity: 0.7 }}></i>
              </div>

              {/* Submenu  */}
              {/* Só aparece se o ID deste item for igual ao 'activeMenu' no estado */}
              {activeMenu === item.id && (
                <div className="submenu" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
                  {item.subs.map((sub, idx) => (
                    <Link 
                      key={idx} 
                      to={sub.path} 
                      style={{ 
                        display: 'block', 
                        padding: '10px 20px 10px 50px', // Indentação para indicar hierarquia
                        color: 'rgba(255,255,255,0.8)', 
                        textDecoration: 'none', 
                        fontSize: '13px',
                        transition: 'color 0.2s'
                      }}
                      // Hover effect inline
                      onMouseOver={(e) => e.target.style.color = '#fff'}
                      onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}
                    >
                      • {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* 4. RODAPÉ DA SIDEBAR */}
        <div style={{ 
          padding: '15px', 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          backgroundColor: 'rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px' 
        }}>
          {/* Botão de Logout */}
          <button 
            onClick={handleLogout} 
            style={{ 
              background: 'transparent', border: 'none', color: '#ffadad', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: 'bold'
            }}
          >
            <i className="bi bi-power" style={{ marginRight: '8px' }}></i>
            Sair
          </button>

          {/* Copyright */}
          <div style={{ 
            fontSize: '10px', 
            color: 'rgba(255,255,255,0.4)', 
            textAlign: 'left', 
            lineHeight: '1.4',
            marginTop: '5px' 
          }}>
              © 2026 COGNVOX<br/>
              Todos os direitos reservados.
          </div>
        </div>

      </div>

      {/* =================================================================================
          ÁREA DE CONTEÚDO PRINCIPAL (Main Content)
         ================================================================================= */}
      <div className="main-content" style={{ 
        flex: 1, 
        marginLeft: '260px', // CRUCIAL: Empurra o conteúdo para não ficar atrás da sidebar fixa
        padding: '0',
        backgroundColor: '#eef1f5'
      }}>
        {}
        {children}
      </div>

    </div>
  );
};

export default Layout;