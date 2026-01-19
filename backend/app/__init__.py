from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt

# Instanciação global das extensões
db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    
    # ==========================================================================
    # 1. CONFIGURAÇÕES
    # ==========================================================================
    
    # Conexão com o Banco 
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@db/cognvox?charset=utf8mb4'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Configuração do JWT
    app.config['JWT_SECRET_KEY'] = 'super_segredo_cognvox_2026'
    
    # Configuração de JSON 
    app.config['JSON_AS_ASCII'] = False 

    # ==========================================================================
    # 2. INICIALIZAÇÃO DE EXTENSÕES
    # ==========================================================================
    CORS(app)
    db.init_app(app)     
    jwt.init_app(app)
    bcrypt.init_app(app)

    # ==========================================================================
    # 3. REGISTRO DE ROTAS
    # ==========================================================================
    with app.app_context():
        from . import models
        from .routes_auth import auth_bp
        from .routes_ator import bp_atores
        from .routes_aux import bp_aux
        
        app.register_blueprint(auth_bp, url_prefix='/auth')
        app.register_blueprint(bp_atores)
        app.register_blueprint(bp_aux)
        
        # Cria as tabelas se não existirem
        db.create_all()

    return app