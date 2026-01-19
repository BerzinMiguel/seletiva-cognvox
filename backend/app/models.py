# ==============================================================================
# MODELOS DE DADOS 
# ==============================================================================
# Este arquivo define as tabelas do banco de dados como classes Python.

from . import db

class User(db.Model):
    """
    Tabela de Usuários do Sistema (Acesso Administrativo/Login).
    """
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # impede que dois usuários tenham o mesmo e-mail
    email = db.Column(db.String(150), unique=True, nullable=False)
    
    # Armazena o HASH da senha, nunca a senha em texto plano
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Define se o usuário tem privilégios de administrador
    is_admin = db.Column(db.Boolean, default=False)


class Ator(db.Model):
    """
    Entidade Principal (Ator/Participante).
    Esta tabela centraliza os dados cadastrais e se relaciona com várias tabelas auxiliares.
    """
    __tablename__ = 'atores'
    
    # --- Dados Pessoais e de Identificação ---
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(150))
    email = db.Column(db.String(150))
    
    # --- Dados Demográficos e Visuais ---
    sessao_visual = db.Column(db.String(50)) 
    idade_visual = db.Column(db.String(50))
    
    # --- Endereço ---
    municipio = db.Column(db.String(100))
    endereco = db.Column(db.String(255))
    cidade = db.Column(db.String(100))
    estado = db.Column(db.String(50))
    pais = db.Column(db.String(50))
    
    # --- Status e Datas ---
    status = db.Column(db.String(20), default='Ativo')
    data_nascimento = db.Column(db.Date)
    data_inicio_intervencao = db.Column(db.Date)
    
    # --- Campos de Sistema / Controle ---
    username = db.Column(db.String(100))
    parecer = db.Column(db.Text) 

    # --- Chaves Estrangeiras ---
    # Estes campos armazenam apenas o ID numérico que referencia outra tabela.
    unidade_id = db.Column(db.Integer, db.ForeignKey('unidades.id'))
    profissao_id = db.Column(db.Integer, db.ForeignKey('profissoes.id'))
    modalidade_id = db.Column("modalidade_ensino_id", db.Integer, db.ForeignKey('modalidades.id'))
    grupo_usuario_id = db.Column(db.Integer, db.ForeignKey('grupos_usuario.id'))
    idioma_id = db.Column(db.Integer)

    # --- Relacionamentos ---
    # Estas propriedades não criam colunas no banco, mas permitem acessar o OBJETO inteiro.
    unidade = db.relationship('Unidade')
    tipo_profissao = db.relationship('Profissao')
    modalidade = db.relationship('Modalidade')

    def to_dict(self):
        """
        Essencial para retornar dados em formato JSON nas APIs 
        """
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "parecer": self.parecer,
            "status": self.status,
            "municipio": self.municipio,
            "sessao_visual": self.sessao_visual,
            
            # Tratamento de Datas: O JSON não aceita objetos date do Python.
            "data_nascimento": self.data_nascimento.isoformat() if self.data_nascimento else None,
            "data_inicio_intervencao": self.data_inicio_intervencao.isoformat() if self.data_inicio_intervencao else None,
            
            # IDs
            "unidade_id": self.unidade_id,
            "profissao_id": self.profissao_id,
            "modalidade_ensino_id": self.modalidade_id,
            "grupo_usuario_id": self.grupo_usuario_id,
            "idioma_id": self.idioma_id,

            # Traz o nome/descrição das tabelas relacionadas para facilitar o uso no Frontend
            # Evita que o frontend tenha que fazer requisições extras só para pegar o nome da Unidade.
            "instituicao": self.unidade.nome if self.unidade else "-",
            "tipo": self.tipo_profissao.descricao if self.tipo_profissao else "-",
            "modalidade": self.modalidade.descricao if self.modalidade else "-"
        }

# ==============================================================================
# CLASSES AUXILIARES 
# ==============================================================================
# Estas tabelas servem para normalizar os dados, evitando repetição de strings

class Unidade(db.Model):
    __tablename__ = 'unidades'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(150))

class Profissao(db.Model):
    __tablename__ = 'profissoes'
    id = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(150))

class Modalidade(db.Model):
    __tablename__ = 'modalidades'
    id = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(150))

class GrupoUsuario(db.Model):
    __tablename__ = 'grupos_usuario'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(150))