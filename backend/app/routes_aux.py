# ==============================================================================
# ROTAS AUXILIARES 
# ==============================================================================
# endpoints de leitura (GET) para popular os campos de seleção


from flask import Blueprint, jsonify
from .models import Unidade, Profissao, Modalidade, GrupoUsuario, Ator, db
from flask_jwt_extended import jwt_required

bp_aux = Blueprint('aux', __name__)

# --- ENDPOINTS PARA POPULAR LISTAS (SELECTS) ---

@bp_aux.route('/unidades', methods=['GET'])
@jwt_required()
def listar_unidades():
    """
    Retorna lista de todas as Unidades cadastradas.
    Usado no select 'Instituição' no formulário.
    """
    dados = Unidade.query.all()
    # Retorna apenas ID e Nome
    return jsonify([{'id': u.id, 'nome': u.nome} for u in dados]), 200

@bp_aux.route('/profissoes', methods=['GET'])
@jwt_required()
def listar_profissoes():
    """
    Retorna lista de Tipos de Profissão (ex: Estudante, Profissional).
    """
    dados = Profissao.query.all()
    return jsonify([{'id': p.id, 'descricao': p.descricao} for p in dados]), 200

@bp_aux.route('/modalidades', methods=['GET'])
@jwt_required()
def listar_modalidades():
    """
    Retorna lista de Modalidades de Ensino (ex: Presencial, Híbrido).
    """
    dados = Modalidade.query.all()
    return jsonify([{'id': m.id, 'descricao': m.descricao} for m in dados]), 200

@bp_aux.route('/grupos_usuario', methods=['GET'])
@jwt_required()
def listar_grupos():
    """
    Retorna lista de Grupos de Usuário.
    """
    dados = GrupoUsuario.query.all()
    return jsonify([{'id': g.id, 'nome': g.nome} for g in dados]), 200

# --- ROTA DINÂMICA DE MUNICÍPIOS ---

@bp_aux.route('/municipios', methods=['GET'])
@jwt_required()
def listar_municipios():
    """
    Gera uma lista de cidades baseada nos dados já existentes no banco.
    Isso evita ter que criar uma tabela separada com 5.000 cidades brasileiras.
    """
    cidades = db.session.query(Ator.municipio).distinct().all()
    lista = [c[0] for c in cidades if c[0]] 
    if not lista:
        lista = ["Recife", "Maceió", "Coruripe", "São Paulo", "Arapiraca", "Caruaru"]
        
    # Retorna a lista ordenada alfabeticamente para facilitar a busca visual do usuário
    return jsonify(sorted(lista)), 200