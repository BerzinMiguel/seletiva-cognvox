# ==============================================================================
# DOCKERFILE - FRONTEND 
# ==============================================================================
# Constrói o ambiente de desenvolvimento para o Frontend.


# 
# O Alpine Linux 
FROM node:18-alpine

# Cria a pasta /app dentro do container. Todos os comandos seguintes rodarão aqui.
WORKDIR /app

# 3.CACHE 
COPY package.json package-lock.json* ./

# 4. INSTALAÇÃO DE DEPENDÊNCIAS
# Baixa e instala as bibliotecas listadas no package.json (React, Vite, Axios, etc).
RUN npm install

# 5. CÓDIGO FONTE 
# Copia todo o restante do projeto (pastas src, public, etc) para dentro do container.
# o build passa por aqui instantaneamente.
COPY . .

# Informa que o container escuta na porta 80.
EXPOSE 80

# Executa o servidor de desenvolvimento do Vite.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"]