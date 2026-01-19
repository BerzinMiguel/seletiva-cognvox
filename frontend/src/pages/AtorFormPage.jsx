import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.jsx';

// Imagens e Assets
import arrowSep from '../assets/images/arrow_separaazul.png';
import arrowRight from '../assets/images/arrow_azul_rightazul.png';
import arrowLeft from '../assets/images/arrow_azul_leftazul.png';
import userPlaceholder from '../assets/images/aluno_default.png';

// ==============================================================================
// PÁGINA DE FORMULÁRIO DE ATOR 
// ==============================================================================
function AtorFormPage() {
  // Captura o parâmetro ID da URL 
  const { id } = useParams();
  const navigate = useNavigate();

  // Define o modo da tela
  const isEditing = Boolean(id);

  // --- ESTADO DO FORMULÁRIO ---
  // Um único objeto contendo todos os campos.
  // Inicializamos com strings vazias para evitar componentes sem controle do React.
  const [formData, setFormData] = useState({
    nome: '', ano_sessao: '', profissao_id: '', data_nascimento: '',
    data_inicio_intervencao: '', email: '', idioma_id: '', unidade_id: '',
    endereco: '', cidade: '', estado: 'AL', pais: 'Brasil',
    modalidade_ensino_id: '', username: '', password: '', grupo_usuario_id: '',
    parecer: ''
  });

  // --- ESTADOS PARA LISTAS DE SELEÇÃO  ---
  const [profissoes, setProfissoes] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [listaMunicipios, setListaMunicipios] = useState([]);
  
  // Controle de UI 
  const [previewImage, setPreviewImage] = useState(userPlaceholder);
  const [loading, setLoading] = useState(false);

  // --- BUSCA DE DADOS AUXILIARES --
  // Busca todas as listas necessárias para popular os select do formulário.
  const fetchSuporte = useCallback(async () => {
    try {
      const [prof, uni, mod, grp, muni] = await Promise.all([
        api.get('/profissoes'), 
        api.get('/unidades'),
        api.get('/modalidades'), 
        api.get('/grupos_usuario'),
        api.get('/municipios')
      ]);
      setProfissoes(prof.data); 
      setUnidades(uni.data);
      setModalidades(mod.data); 
      setGrupos(grp.data);
      setListaMunicipios(muni.data);
    } catch (e) { console.error(e); }
  }, []);

  // --- EFEITO DE INICIALIZAÇÃO ---
  useEffect(() => {
    // 1. Carrega as listas de apoio
    fetchSuporte();

    // 2. Se for EDIÇÃO, busca os dados do Ator no backend e preenche o formulário
    if (isEditing) {
      api.get(`/atores/${id}`).then(res => {
        const ator = res.data;
        
        // Mapeia os dados vindos do backend para o estado do formulário
        // Nota: Tratamento de Nulos (|| '') 
        setFormData({
            nome: ator.nome || '',
            ano_sessao: ator.sessao_visual || '', 
            data_nascimento: ator.data_nascimento || '',
            data_inicio_intervencao: ator.data_inicio_intervencao || '',
            email: ator.email || '',
            endereco: ator.endereco || '',
            cidade: ator.municipio || '', 
            estado: ator.estado || 'AL',
            pais: ator.pais || 'Brasil',
            username: ator.username || '',
            password: '', // Senha nunca vem do backend por segurança (fica vazia na edição)
            profissao_id: ator.profissao_id || '',
            unidade_id: ator.unidade_id || '',
            idioma_id: ator.idioma_id || '',
            modalidade_ensino_id: ator.modalidade_ensino_id || '',
            grupo_usuario_id: ator.grupo_usuario_id || '',
            parecer: ator.parecer || '' 
        });
      }).catch(err => console.error(err));
    }
  }, [id, isEditing, fetchSuporte]);

 
  // Atualiza o estado formData dinamicamente baseado no "name" do input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  // --- ENVIO DO FORMULÁRIO  ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita o reload da página
    setLoading(true); // Trava o botão de salvar
    
    // Cria uma cópia dos dados para envio
    const payload = { ...formData };
    
    // Converte IDs de String para Inteiro (HTML values são sempre strings)
    ['profissao_id', 'unidade_id', 'modalidade_ensino_id', 'grupo_usuario_id'].forEach(k => {
      if(payload[k]) payload[k] = parseInt(payload[k]);
    });

    try {
      if (isEditing) {
        // Se Editando: PUT /atores/ID
        await api.put(`/atores/${id}`, payload);
        alert('Salvo com sucesso!');
      } else {
        // Se Criando: POST /atores
        await api.post('/atores', payload);
        alert('Criado com sucesso!');
      }
      navigate('/atores'); // Volta para a listagem
    } catch (err) {
      alert("Erro ao Salvar: " + (err.response?.data?.erro || err.message));
    } finally {
      setLoading(false); // Libera o botão
    }
  };

  return (
    <div className="main-content-area">
      {/* --- CABEÇALHO --- */}
      <div className="divnavigation">
        <div className="div-block">
          {/* Mostra texto dinâmico dependendo do modo */}
          <div className="breadcrumb-item">{isEditing ? 'EDIÇÃO' : 'INCLUSÃO'}</div>
          <img src={arrowSep} loading="lazy" alt="" className="arrow-separator" />
          <div className="breadcrumb-item breadcrumb-active">
            ATOR <img src={arrowRight} loading="lazy" alt="" style={{ marginLeft: '5px' }} />
          </div>
        </div>
        
        {/* Botão Voltar */}
        <a href="#" onClick={(e) => {e.preventDefault(); navigate('/atores');}} className="voltar w-inline-block">
          <img src={arrowLeft} loading="lazy" alt="" />
          <div className="bt_voltar">
            <div className="text-block-2">Voltar</div>
          </div>
        </a>
      </div>
      
      <div className="separator-breadcrumb border-top"></div>

      {/* --- ÁREA DO FORMULÁRIO --- */}
      <div className="caixa">
        <div className="w-form">
          <form onSubmit={handleSubmit}>
            
            <div className="row">
                {/* Lógica de Preview de Imagem (Apenas Frontend por enquanto) */}
                <div className="col-md-12"><label className="text-primary">FOTO</label></div>
                <div className="col-md-3 align_center">
                    <div className="align_center photo-box-wrapper">
                        <img className="my-3" height="150" width="150" src={previewImage} alt="Foto" style={{borderRadius: '4px', border: '1px solid #ddd'}} />
                    </div>
                    <label className="btn btn-primary my-2" style={{cursor:'pointer', width: '100%'}}>
                       ESCOLHER ARQUIVO
                       <input type="file" style={{display:'none'}} accept="image/*" onChange={e => {
                           if(e.target.files[0]) setPreviewImage(URL.createObjectURL(e.target.files[0]));
                       }}/>
                    </label>
                </div>
            </div>

            <div className="row mt-4">
                {/* CAMPOS DE TEXTO E SELEÇÃO */}
                <div className="col-md-9 form-group">
                    <label>NOME (*)</label>
                    <input className="text-field-2 w-input" name="nome" value={formData.nome} onChange={handleChange} required />
                </div>
                <div className="col-md-3 form-group">
                    <label>SESSÃO ANO (*)</label>
                    <input className="text-field-2 w-input" name="ano_sessao" value={formData.ano_sessao} onChange={handleChange} required />
                </div>

                {/* Dropdown populado via API  */}
                <div className="col-md-3 form-group mt-3">
                    <label>TIPO (*)</label>
                    <select className="text-field-2 w-select" name="profissao_id" value={formData.profissao_id} onChange={handleChange} required>
                        <option value="">Selecione</option>
                        {profissoes.map(p => <option key={p.id} value={p.id}>{p.descricao}</option>)}
                    </select>
                </div>

                <div className="col-md-3 form-group mt-3">
                    <label>DATA DE NASCIMENTO (*)</label>
                    <input type="date" className="text-field-2 w-input" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} required />
                </div>

                <div className="col-md-3 form-group mt-3">
                    <label>INICIO INTERVENÇÃO (*)</label>
                    <input type="date" className="text-field-2 w-input" name="data_inicio_intervencao" value={formData.data_inicio_intervencao} onChange={handleChange} required />
                </div>

                <div className="col-md-3 form-group mt-3">
                    <label>E-MAIL (*)</label>
                    <input type="email" className="text-field-2 w-input" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="col-md-3 form-group mt-3">
                    <label>IDIOMA (*)</label>
                    <select className="text-field-2 w-select" name="idioma_id" value={formData.idioma_id} onChange={handleChange}>
                        <option value="">Selecione</option>
                        <option value="1">Português</option> 
                    </select>
                </div>

                <div className="col-md-9 form-group mt-3">
                    <label>INSTITUIÇÃO (*)</label>
                    <select className="text-field-2 w-select" name="unidade_id" value={formData.unidade_id} onChange={handleChange} required>
                        <option value="">Selecione</option>
                        {unidades.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                    </select>
                </div>

                <div className="col-md-12 form-group mt-3">
                    <label>ENDEREÇO</label>
                    <input className="text-field-2 w-input" name="endereco" value={formData.endereco} onChange={handleChange} />
                </div>

                {/* Dropdown de Cidades */}
                <div className="col-md-3 form-group mt-3">
                    <label>CIDADE / MUNICÍPIO</label>
                    <select className="text-field-2 w-select" name="cidade" value={formData.cidade} onChange={handleChange}>
                        <option value="">Selecione</option>
                        {listaMunicipios.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                </div>
                
                <div className="col-md-3 form-group mt-3">
                    <label>ESTADO</label>
                    <select className="text-field-2 w-select" name="estado" value={formData.estado} onChange={handleChange}>
                        <option value="AL">AL</option>
                        <option value="PE">PE</option>
                        <option value="SP">SP</option>
                        <option value="RJ">RJ</option>
                    </select>
                </div>

                <div className="col-md-3 form-group mt-3">
                    <label>PAIS</label>
                    <input className="text-field-2 w-input" name="pais" value={formData.pais} onChange={handleChange} />
                </div>

                <div className="col-md-3 form-group mt-3">
                    <label>MODALIDADE DE ENSINO (*)</label>
                    <select className="text-field-2 w-select" name="modalidade_ensino_id" value={formData.modalidade_ensino_id} onChange={handleChange} required>
                        <option value="">Selecione</option>
                        {modalidades.map(m => <option key={m.id} value={m.id}>{m.descricao}</option>)}
                    </select>
                </div>

                {/* LOGICA DE SENHA: Só mostra campos de Usuário/Senha se for NOVO cadastro .
                    Na edição, não permitimos alterar senha por aqui. */}
                {!isEditing && (
                    <>
                        <div className="col-md-6 form-group mt-3">
                            <label>USUÁRIO (*)</label>
                            <input className="text-field-2 w-input" name="username" value={formData.username} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 form-group mt-3">
                            <label>SENHA (*)</label>
                            <input type="password" className="text-field-2 w-input" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                    </>
                )}

                <div className="col-md-12 form-group mt-3">
                    <label>GRUPO DE ACESSO DO USUÁRIO (*)</label>
                    <select className="text-field-2 w-select" name="grupo_usuario_id" value={formData.grupo_usuario_id} onChange={handleChange} required>
                        <option value="">Selecione</option>
                        {grupos.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}
                    </select>
                </div>

                <div className="col-md-12 form-group mt-3">
                    <label>PARECER</label>
                    <textarea 
                        className="text-field-2 w-input" 
                        name="parecer" 
                        value={formData.parecer} 
                        onChange={handleChange} 
                        rows="4"
                        placeholder="Insira observações..."
                        style={{ height: 'auto', paddingTop: '10px' }}
                    ></textarea>
                </div>

            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="col-md-12 my-4 d-flex flex-wrap align-items-center" style={{ gap: '10px' }}>
                <button type="submit" disabled={loading} className="btn btn-primary">
                    <i className="bi bi-check2"></i> {loading ? 'Salvando...' : 'SALVAR'}
                </button>
                <button type="button" onClick={() => navigate('/atores')} className="btn btn-primary">
                    <i className="bi bi-arrow-left"></i> VOLTAR
                </button>
                <button type="reset" onClick={() => setFormData({})} className="btn btn-primary">
                    <i className="bi bi-eraser"></i> LIMPAR
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AtorFormPage;