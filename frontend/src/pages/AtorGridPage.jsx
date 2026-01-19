import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api.jsx';
import { Link, useNavigate } from 'react-router-dom';

// Assets visuais
import arrowSep from '../assets/images/arrow_separaazul.png';
import arrowRight from '../assets/images/arrow_azul_rightazul.png';
import arrowLeft from '../assets/images/arrow_azul_leftazul.png';
import userPlaceholder from '../assets/images/aluno_default.png';

// ==============================================================================
// PÁGINA DE LISTAGEM DE ATORES (GRID + FILTROS)
// ==============================================================================
function AtorGridPage() {
  // --- ESTADOS DE DADOS ---
  const [atores, setAtores] = useState([]); // Lista principal exibida na tabela
  
  // --- ESTADOS DE LISTAS AUXILIARES  ---
  const [profissoes, setProfissoes] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [municipios, setMunicipios] = useState([]); 
  const [modalidades, setModalidades] = useState([]);
  
  // --- ESTADOS DOS FILTROS SELECIONADOS ---
  const [filtroUnidade, setFiltroUnidade] = useState("0");
  const [filtroProfissao, setFiltroProfissao] = useState("0");
  const [filtroMunicipio, setFiltroMunicipio] = useState("0");
  const [filtroModalidade, setFiltroModalidade] = useState("0");
  
  // Controle de UI 
  const [loadingDelete, setLoadingDelete] = useState(null);
  const navigate = useNavigate();

  // --- CARREGAMENTO INICIAL DAS OPÇÕES DE FILTRO ---
  const fetchFiltros = useCallback(async () => {
    try {
      const [profRes, uniRes, modRes, muniRes] = await Promise.all([
        api.get('/profissoes'),
        api.get('/unidades'),
        api.get('/modalidades'),
        api.get('/municipios')
      ]);
      setProfissoes(profRes.data);
      setUnidades(uniRes.data);
      setModalidades(modRes.data);
      setMunicipios(muniRes.data);
    } catch (error) { console.error(error); }
  }, []);

  // --- BUSCA ---
  // Busca os atores no backend aplicando os filtros selecionados.
  const fetchAtores = useCallback(async () => {
    try {
      // URLSearchParams: Utilitário do JS para construir query strings 
      const params = new URLSearchParams();
      
      if (filtroUnidade !== "0") params.append('unidade_id', filtroUnidade);
      if (filtroProfissao !== "0") params.append('profissao_id', filtroProfissao);
      if (filtroMunicipio !== "0") params.append('municipio', filtroMunicipio);
      if (filtroModalidade !== "0") params.append('modalidade_id', filtroModalidade);

      // GET /atores?unidade_id=...&municipio=...
      const response = await api.get('/atores', { params });
      setAtores(response.data);
    } catch (error) { console.error(error); }
  }, [filtroUnidade, filtroProfissao, filtroMunicipio, filtroModalidade]);

  // Efeito que roda ao abrir a página: Carrega filtros e a lista inicial 
  useEffect(() => { fetchFiltros(); fetchAtores(); }, [fetchFiltros, fetchAtores]);

  // Dispara a busca quando o usuário clica em "Pesquisar"
  const handlePesquisar = (e) => { e.preventDefault(); fetchAtores(); };

  // --- LÓGICA DE EXCLUSÃO ---
  const handleDelete = async (atorId) => {
    // Confirmação nativa do navegador 
    if (window.confirm("Tem certeza que deseja DELETAR este registro?")) {
      setLoadingDelete(atorId); // Ativa o spinner apenas no botão clicado
      try {
        await api.delete(`/atores/${atorId}`);
        fetchAtores(); // Recarrega a lista para sumir com o item deletado
      } catch (error) { 
        alert("Erro ao deletar. O registro pode estar vinculado."); 
      } 
      finally { setLoadingDelete(null); }
    }
  };

  return (
    <div className="main-content-area">
      {/* CABEÇALHO  */}
      <div className="divnavigation">
        <div className="div-block">
          <div className="breadcrumb-item">GESTÃO</div>
          <img src={arrowSep} loading="lazy" alt="" className="arrow-separator" />
          <div className="breadcrumb-item breadcrumb-active">
            ATOR <img src={arrowRight} loading="lazy" alt="" style={{ marginLeft: '5px' }} />
          </div>
        </div>
        <a href="#" onClick={(e) => {e.preventDefault(); navigate(-1);}} className="voltar w-inline-block">
          <img src={arrowLeft} loading="lazy" alt="" />
          <div className="bt_voltar">
            <div className="text-block-2">Voltar</div>
          </div>
        </a>
      </div>
      
      <div className="separator-breadcrumb border-top"></div>

      {/* --- ÁREA DE FILTROS --- */}
      <div className="caixa">
        <div className="form-filter-section">
          <label className="filter-title-label">FILTRO PARA PESQUISA DE ATOR</label>
          <hr />
          <div className="w-form">
            <form onSubmit={handlePesquisar} className="filter-form-row">
              
              {/* Selects de Filtro  */}
              <div className="filter-input-group">
                <label>Município</label>
                <select className="text-field-2 w-select" value={filtroMunicipio} onChange={e => setFiltroMunicipio(e.target.value)}>
                  <option value="0">Selecione TODOS</option>
                  {municipios.map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="filter-input-group">
                <label>Instituição</label>
                <select className="text-field-2 w-select" value={filtroUnidade} onChange={e => setFiltroUnidade(e.target.value)}>
                  <option value="0">Selecione TODAS</option>
                  {unidades.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                </select>
              </div>
              <div className="filter-input-group">
                <label>Modalidade</label>
                <select className="text-field-2 w-select" value={filtroModalidade} onChange={e => setFiltroModalidade(e.target.value)}>
                  <option value="0">Selecione TODAS</option>
                  {modalidades.map(m => <option key={m.id} value={m.id}>{m.descricao}</option>)}
                </select>
              </div>
              <div className="filter-input-group">
                <label>Tipo</label>
                <select className="text-field-2 w-select" value={filtroProfissao} onChange={e => setFiltroProfissao(e.target.value)}>
                  <option value="0">Selecione TODOS</option>
                  {profissoes.map(p => <option key={p.id} value={p.id}>{p.descricao}</option>)}
                </select>
              </div>

              <div className="col-md-12 mt-3">
                <button type="submit" className="btn btn-primary">
                    <i className="bi bi-search"></i> PESQUISAR
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* --- GRID / TABELA DE RESULTADOS --- */}
      <div className="caixa">
        <div className="table-actions-row mb-3">
          {/* Botão de Incluir  */}
          <Link to="/atores/novo" className="btn btn-primary">
             <i className="bi bi-plus-lg"></i> INCLUIR
          </Link>
        </div>
        
        <div className="table-responsive">
          <table className="col-md-12 table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">FOTO</th>
                <th>DADOS DO ATOR</th>
                <th>MODALIDADE</th>
                <th>TIPO</th>
                <th>INSTITUIÇÃO</th>
                <th>MUNICÍPIO</th>
                <th>PARECER</th>
                <th>STATUS</th>
                <th className="text-center" style={{ width: '160px' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {/* Renderização Condicional: Verifica se existem dados antes de fazer o map */}
              {atores.length > 0 ? atores.map(ator => (
                <tr key={ator.id}>
                  <td className="align_center text-center">{ator.id}</td>
                  <td className="align_center text-center">
                    <img className="image-2" src={userPlaceholder} alt="foto" style={{ width:'40px', height:'40px', borderRadius:'50%' }} />
                  </td>
                  <td>
                    <strong>{ator.nome}</strong><br/>
                    <small>{ator.email}</small>
                  </td>
                  {/* Dados "achatados" vindos do to_dict() do backend */}
                  <td>{ator.modalidade}</td>
                  <td>{ator.tipo}</td>
                  <td>{ator.instituicao}</td>
                  <td>{ator.municipio}</td>
                  
                  {/* Truncamento de Texto: Se o parecer for muito longo, corta e põe '...' */}
                  <td>{ator.parecer ? (ator.parecer.length > 25 ? ator.parecer.substring(0,25)+'...' : ator.parecer) : '-'}</td>
                  <td>{ator.status}</td>
                  
                  {/* Botões Editar e Excluir */}
                  <td className="text-center">
                    <div className="actions-cell">
                        {/* Link para Edição (Passando o ID na URL) */}
                        <Link to={`/atores/editar/${ator.id}`} className="btn btn-primary" title="Editar">
                          <i className="bi bi-pencil-square"></i> EDITAR
                        </Link>
                        
                        {/* Botão de Exclusão */}
                        <button 
                          onClick={() => handleDelete(ator.id)} 
                          className="btn btn-danger"
                          disabled={loadingDelete === ator.id} // Trava o botão enquanto deleta
                          title="Excluir"
                        >
                          {loadingDelete === ator.id ? '...' : (
                             <><i className="bi bi-trash"></i> EXCLUIR</>
                          )}
                        </button>
                    </div>
                  </td>
                </tr>
              )) : (
                // Fallback caso a lista esteja vazia
                <tr><td colSpan="10" className="text-center">Nenhum registro encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AtorGridPage;