from flask import Blueprint, request, jsonify
from .models import User
from flask_jwt_extended import create_access_token
from . import bcrypt  

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password') 

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"erro": "Credenciais inválidas"}), 401

 
    if not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"erro": "Credenciais inválidas"}), 401
    
    token = create_access_token(identity=str(user.id))
    return jsonify({
        "success": True,
        "accessToken": token,
        "user": {"email": user.email, "id": user.id}
    }), 200