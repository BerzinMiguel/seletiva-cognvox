# ==============================================================================
# DOCKERFILE - BACKEND 
# ==============================================================================
# Define como a imagem do container do Backend é construída.

FROM python:3.10-slim

# 
# Cria e define a pasta /app dentro do container como o local onde
# os comandos subsequentes serão executados.
WORKDIR /app

# PYTHONDONTWRITEBYTECODE=1: Impede que o Python crie arquivos .pyc (cache compilado).
ENV PYTHONDONTWRITEBYTECODE=1

# Logs em tempo real com 'docker logs'.
ENV PYTHONUNBUFFERED=1

# 4. DEPENDÊNCIAS DO SISTEMA OPERACIONAL (Linux)
# Instala pacotes necessários para compilar bibliotecas Python que usam C 
# - gcc: Compilador C 
# - default-libmysqlclient-dev: Cabeçalhos para conexão com MySQL.
# - pkg-config: Auxiliar para compilação.
# && rm -rf ...: Limpa o cache do app.
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# CACHE 
# Copia APENAS o arquivo de requisitos primeiro.
COPY requirements.txt .

# INSTALAÇÃO DAS LIBS PYTHON

RUN pip install --no-cache-dir -r requirements.txt

# copia todo o restante do código do seu projeto para dentro do /app.
COPY . .


# Informa ao Docker  que este container escuta na porta 5000.
EXPOSE 5000

# COMANDO DE INICIALIZAÇÃO
CMD ["python", "run.py"]