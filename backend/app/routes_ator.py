# ==============================================================================
# ROTAS PARA GERENCIAMENTO DE ATORES (CRUD COMPLETO)
# ==============================================================================
# Este módulo define as endpoints da API REST para criar, ler, atualizar e deletar
# registros da tabela 'Ator'. Todas as rotas são protegidas por JWT.

from flask import Blueprint, jsonify, request
from .models import Ator, db
from flask_jwt_extended import jwt_required

# Cria um "Blueprint" para agrupar todas as rotas relacionadas a 'atores'.
bp_atores = Blueprint('atores', __name__)

# --- LEITURA ---

@bp_atores.route('/atores', methods=['GET'])
@jwt_required() # Garante que apenas usuários logados acessem
def listar():
    """
    Retorna uma lista JSON com todos os atores cadastrados.
    """
    # SELECT * FROM atores;
    atores = Ator.query.all()

    return jsonify([a.to_dict() for a in atores]), 200

@bp_atores.route('/atores/<int:id>', methods=['GET'])
@jwt_required()
def obter(id):
    """
    Retorna os detalhes de um único ator baseado no ID.
    Se o ID não existir, retorna automaticamente erro 404 (Not Found).
    """
    ator = Ator.query.get_or_404(id)
    return jsonify(ator.to_dict()), 200

# --- CRIAÇÃO ---

@bp_atores.route('/atores', methods=['POST'])
@jwt_required()
def criar():
    """
    Recebe um JSON, cria um novo objeto Ator e salva no banco.
    """
    data = request.get_json()
    
    # Validação simples
    if not data: return jsonify({"erro": "Dados não fornecidos"}), 400

    try:
        # Instancia o modelo vazio
        novo_ator = Ator()
        
        # --- Mapeamento de Dados ---
        
        # Campos Básicos
        novo_ator.nome = data.get('nome')
        novo_ator.email = data.get('email')
        
        novo_ator.municipio = data.get('cidade') 
        novo_ator.status = 'Ativo'
        
        # Datas
        novo_ator.data_nascimento = data.get('data_nascimento')
        novo_ator.data_inicio_intervencao = data.get('data_inicio_intervencao')
        
        # Detalhes de Endereço e Sistema
        novo_ator.endereco = data.get('endereco')
        novo_ator.estado = data.get('estado')
        novo_ator.pais = data.get('pais')
        novo_ator.username = data.get('username')
        novo_ator.sessao_visual = data.get('ano_sessao')
        novo_ator.parecer = data.get('parecer')

        # Chaves Estrangeiras (Vínculos com tabelas auxiliares)
        novo_ator.unidade_id = data.get('unidade_id')
        novo_ator.profissao_id = data.get('profissao_id')
        novo_ator.modalidade_id = data.get('modalidade_ensino_id')
        novo_ator.grupo_usuario_id = data.get('grupo_usuario_id')
        novo_ator.idioma_id = data.get('idioma_id')

        # --- Persistência no Banco ---
        db.session.add(novo_ator) # Adiciona à sessão 
        db.session.commit()       # Confirma a transação 
        
        # Retorna 201 (Created) e o ID do novo recurso
        return jsonify({"mensagem": "Ator criado com sucesso", "id": novo_ator.id}), 201

    except Exception as e:
        # Se algo der errado, desfaz qualquer alteração pendente para não corromper a sessão
        db.session.rollback()
        print(f"Erro CRITICAL: {e}") # Log no console do servidor para debug
        return jsonify({"erro": "Erro ao salvar no banco"}), 500

# --- ATUALIZAÇÃO ---

@bp_atores.route('/atores/<int:id>', methods=['PUT'])
@jwt_required()
def atualizar(id):
    """
    Atualiza dados de um ator existente.
    """
    ator = Ator.query.get_or_404(id)
    data = request.get_json()

    try:
        # Verifica campo a campo: Se a chave existe no JSON, atualiza o objeto.
        if 'nome' in data: ator.nome = data['nome']
        if 'email' in data: ator.email = data['email']
        if 'cidade' in data: ator.municipio = data['cidade'] 
        if 'endereco' in data: ator.endereco = data['endereco']
        if 'estado' in data: ator.estado = data['estado']
        if 'pais' in data: ator.pais = data['pais']
        if 'ano_sessao' in data: ator.sessao_visual = data['ano_sessao']
        if 'data_nascimento' in data: ator.data_nascimento = data['data_nascimento']
        if 'data_inicio_intervencao' in data: ator.data_inicio_intervencao = data['data_inicio_intervencao']
        if 'parecer' in data: ator.parecer = data['parecer']

        # Atualização de FKs
        if 'unidade_id' in data: ator.unidade_id = data['unidade_id']
        if 'profissao_id' in data: ator.profissao_id = data['profissao_id']
        if 'modalidade_ensino_id' in data: ator.modalidade_id = data['modalidade_ensino_id']
        if 'grupo_usuario_id' in data: ator.grupo_usuario_id = data['grupo_usuario_id']

        # SQL UPDATE executado
        db.session.commit()
        return jsonify({"mensagem": "Ator atualizado com sucesso"}), 200

    except Exception as e:
        db.session.rollback() # Segurança contra falhas
        return jsonify({"erro": "Erro ao atualizar registro"}), 500

# --- REMOÇÃO ---

@bp_atores.route('/atores/<int:id>', methods=['DELETE'])
@jwt_required()
def deletar(id):
    """
    Remove um ator do banco de dados permanentemente.
    """
    ator = Ator.query.get_or_404(id)
    try:
        db.session.delete(ator) # Marca para deleção
        db.session.commit()     # Executa DELETE FROM ...
        return jsonify({"mensagem": "Ator removido com sucesso"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Erro ao deletar."}), 500