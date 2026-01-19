# ==============================================================================
# PARTIDA DO SERVIDOR 
# ==============================================================================
# Docker chama (CMD ["python", "run.py"]) para iniciar a API.
# Ele orquestra a criação do app e garante que o banco tenha os dados mínimos para acesso.

from app import create_app, db, bcrypt
from app.models import User

# Cria a instância da aplicação usando a Factory definida em __init__.py
app = create_app()

def garantir_usuario_admin():
    """
    Função de 'Seed' (Semente) / Auto-Cura.
    Objetivo: Garantir que o usuário Admin exista com a senha certa.
    Execução: Roda toda vez que o container inicia, antes do servidor web subir.
    """
    # 'app_context' é necessário pois estamos acessando o banco fora de uma requisição HTTP real.
    with app.app_context():
        # Cria as tabelas caso não existam 
        db.create_all()
        #Metódo para garantir o usuário teste
        email_admin = 'admin@cognvox.net'
        senha_padrao = '123456'
        
        # Gera o hash da senha usando a biblioteca configurada no sistema.
        # Isso garante que o hash no banco seja compatível com o método de verificação do login.
        hash_gerado_na_hora = bcrypt.generate_password_hash(senha_padrao).decode('utf-8')
        
        # Verifica se o usuário já existe no banco
        usuario = User.query.filter_by(email=email_admin).first()
        
        if usuario:
            # Se já existe, apenas atualiza a senha para o padrão.
            usuario.password_hash = hash_gerado_na_hora
            usuario.is_admin = True
            print(f"--- [SISTEMA] Usuário Admin ENCONTRADO. Senha resetada para {senha_padrao} ---")
        else:
            # Se não existe, cria do zero (Primeira execução do sistema)
            novo_admin = User(
                email=email_admin,
                password_hash=hash_gerado_na_hora,
                is_admin=True
            )
            db.session.add(novo_admin)
            print(f"--- [SISTEMA] Usuário Admin CRIADO com sucesso: {email_admin} ---")
        
        # Persiste as alterações no banco de dados MySQL
        db.session.commit()

if __name__ == '__main__':
    # Bloco de Inicialização
    try:
        # Tenta criar/garantir o admin.
        # Isso pode falhar se o container do Banco de Dados (MySQL) ainda estiver iniciando.
        garantir_usuario_admin()
    except Exception as e:
        # Tratamento de erro de conexão inicial ("Race Condition" do Docker Compose)
        print(f"--- [AVISO] O banco de dados ainda não está pronto ou houve erro: {e} ---")
        # O 'pass' permite que o código continue. Se o erro for crítico, o Flask pode falhar ao subir,
        # e o Docker reiniciará este container automaticamente até o banco estar pronto.
        pass

    # Inicia o servidor Flask
    app.run(host='0.0.0.0', port=5000)