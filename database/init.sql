-- FORÇA O CHARSET PARA O SCRIPT ATUAL
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;

CREATE DATABASE IF NOT EXISTS cognvox CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cognvox;

-- ==========================================================
-- 1. TABELA DE USUÁRIOS
-- ==========================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- INSERÇÃO COM ATUALIZAÇÃO AUTOMÁTICA
-- Se o usuário já existir, atualiza a senha para garantir que o login funcione.
INSERT INTO users (id, email, password_hash, is_admin) VALUES 
(1, 'admin@cognvox.net',       '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj40.D7vfE.K', 1),
(2, 'diretor@escola.com',      '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj40.D7vfE.K', 0),
(3, 'coordenador@cognvox.net', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj40.D7vfE.K', 1),
(4, 'auditoria@mec.gov.br',    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj40.D7vfE.K', 0),
(5, 'professor@cognvox.net',   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj40.D7vfE.K', 0)
ON DUPLICATE KEY UPDATE 
password_hash = VALUES(password_hash),
is_admin = VALUES(is_admin);

-- ==========================================================
-- 2. TABELAS AUXILIARES
-- ==========================================================

-- UNIDADES
CREATE TABLE IF NOT EXISTS unidades (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(150)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
INSERT INTO unidades (id, nome) VALUES 
(1, 'COGNVOX MATRIZ'), (2, 'Creche Alexandre dos Santos'), (3, 'Escola Paulo Freire'),
(4, 'CMEI Pequeno Príncipe'), (5, 'Escola Est. Joaquim Nabuco'), (6, 'IFAL - Campus Maceió'),
(7, 'CAE Especializado'), (8, 'Colégio Santa Maria'), (9, 'Unidade Norte'), (10, 'Creche Vovó Zefa')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

-- PROFISSÕES
CREATE TABLE IF NOT EXISTS profissoes (id INT AUTO_INCREMENT PRIMARY KEY, descricao VARCHAR(150)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
INSERT INTO profissoes (id, descricao) VALUES 
(1, 'Ator DI'), (2, 'Professor Regente'), (3, 'Psicólogo'), (4, 'Fonoaudiólogo'),
(5, 'Terapeuta Ocupacional'), (6, 'Psicopedagogo'), (7, 'Assistente Social'), (8, 'Neuropediatra')
ON DUPLICATE KEY UPDATE descricao = VALUES(descricao);

-- MODALIDADES
CREATE TABLE IF NOT EXISTS modalidades (id INT AUTO_INCREMENT PRIMARY KEY, descricao VARCHAR(150)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
INSERT INTO modalidades (id, descricao) VALUES 
(1, 'Pré-Escola I - Integral'), (2, 'Pré-Escola II - Manhã'), (3, 'Creche II - Tarde'),
(4, 'Fund. I - 1º Ano'), (5, 'Fund. I - 3º Ano'), (6, 'AEE - Especializado'), (7, 'EJA - Adultos')
ON DUPLICATE KEY UPDATE descricao = VALUES(descricao);

-- GRUPOS
CREATE TABLE IF NOT EXISTS grupos_usuario (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(150)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
INSERT INTO grupos_usuario (id, nome) VALUES 
(1, 'Administrador'), (2, 'Operador'), (3, 'Gestor'), (4, 'Visualizador')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

-- ==========================================================
-- 3. TABELA ATORES
-- ==========================================================
CREATE TABLE IF NOT EXISTS atores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150),
    email VARCHAR(150),
    idade_visual VARCHAR(50),
    sessao_visual VARCHAR(50),
    municipio VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Ativo',
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    pais VARCHAR(50),
    data_nascimento DATE,
    data_inicio_intervencao DATE,
    username VARCHAR(100),
    parecer TEXT, 
    
    unidade_id INT,
    profissao_id INT,
    modalidade_ensino_id INT,
    grupo_usuario_id INT,
    idioma_id INT,

    FOREIGN KEY (unidade_id) REFERENCES unidades(id),
    FOREIGN KEY (profissao_id) REFERENCES profissoes(id),
    FOREIGN KEY (modalidade_ensino_id) REFERENCES modalidades(id),
    FOREIGN KEY (grupo_usuario_id) REFERENCES grupos_usuario(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================================
-- 4. POVOAMENTO ATORES
-- ==========================================================

-- 1. ANTHONY
INSERT INTO atores (nome, email, sessao_visual, municipio, status, endereco, cidade, estado, pais, data_nascimento, data_inicio_intervencao, username, parecer, unidade_id, profissao_id, modalidade_ensino_id, grupo_usuario_id, idioma_id)
SELECT 'ANTHONY GABRIEL DA SILVA', 'anthony.g@email.com', '2024', 'Coruripe', 'Ativo', 'Rua das Flores, 123', 'Coruripe', 'AL', 'Brasil', '2018-05-10', '2024-01-15', 'anthony.g', 
'Evolução social positiva. Acompanhar fono.', 
2, 1, 1, 2, 1 FROM DUAL WHERE NOT EXISTS (SELECT * FROM atores WHERE nome = 'ANTHONY GABRIEL DA SILVA');

-- 2. PAULO
INSERT INTO atores (nome, email, sessao_visual, municipio, status, endereco, cidade, estado, pais, data_nascimento, data_inicio_intervencao, username, parecer, unidade_id, profissao_id, modalidade_ensino_id, grupo_usuario_id, idioma_id)
SELECT 'PAULO SÉRGIO DE ALMEIDA', 'paulo.s@email.com', '2025', 'Recife', 'Ativo', 'Av. Boa Viagem, 4500', 'Recife', 'PE', 'Brasil', '2019-02-20', '2025-02-01', 'paulo.s', 
'TEA Nível 1. Boa adaptação curricular.', 
3, 1, 2, 2, 1 FROM DUAL WHERE NOT EXISTS (SELECT * FROM atores WHERE nome = 'PAULO SÉRGIO DE ALMEIDA');

-- 3. MARIA CLARA
INSERT INTO atores (nome, email, sessao_visual, municipio, status, endereco, cidade, estado, pais, data_nascimento, data_inicio_intervencao, username, parecer, unidade_id, profissao_id, modalidade_ensino_id, grupo_usuario_id, idioma_id)
SELECT 'MARIA CLARA DOS SANTOS', 'maria.c@email.com', '2023', 'Maceió', 'Inativo', 'Rua do Sol, 88', 'Maceió', 'AL', 'Brasil', '2017-11-05', '2023-03-10', 'maria.c', 
'Afastada. Tratamento médico externo.', 
4, 1, 1, 2, 1 FROM DUAL WHERE NOT EXISTS (SELECT * FROM atores WHERE nome = 'MARIA CLARA DOS SANTOS');

-- 4. ENZO
INSERT INTO atores (nome, email, sessao_visual, municipio, status, endereco, cidade, estado, pais, data_nascimento, data_inicio_intervencao, username, parecer, unidade_id, profissao_id, modalidade_ensino_id, grupo_usuario_id, idioma_id)
SELECT 'ENZO GABRIEL PEREIRA', 'enzo.gp@email.com', '2024', 'Arapiraca', 'Ativo', 'Rua 15, 200', 'Arapiraca', 'AL', 'Brasil', '2016-08-12', '2024-02-10', 'enzo.g', 
'TDAH. Requer fracionamento de tarefas.', 
5, 6, 4, 3, 1 FROM DUAL WHERE NOT EXISTS (SELECT * FROM atores WHERE nome = 'ENZO GABRIEL PEREIRA');

-- 5. VALENTINA
INSERT INTO atores (nome, email, sessao_visual, municipio, status, endereco, cidade, estado, pais, data_nascimento, data_inicio_intervencao, username, parecer, unidade_id, profissao_id, modalidade_ensino_id, grupo_usuario_id, idioma_id)
SELECT 'VALENTINA OLIVEIRA', 'val.oli@email.com', '2022', 'Maceió', 'Alta', 'Av. Fernandes Lima, 1000', 'Maceió', 'AL', 'Brasil', '2015-01-30', '2022-05-15', 'valentina.o', 
'Alta fonoaudiológica. Segue pedagógico.', 
7, 4, 5, 2, 1 FROM DUAL WHERE NOT EXISTS (SELECT * FROM atores WHERE nome = 'VALENTINA OLIVEIRA');

-- 6. JOÃO PEDRO
INSERT INTO atores (nome, email, sessao_visual, municipio, status, endereco, cidade, estado, pais, data_nascimento, data_inicio_intervencao, username, parecer, unidade_id, profissao_id, modalidade_ensino_id, grupo_usuario_id, idioma_id)
SELECT 'JOÃO PEDRO COSTA', 'jp.costa@email.com', '2025', 'Recife', 'Ativo', 'Rua da Aurora, 50', 'Recife', 'PE', 'Brasil', '2018-06-25', '2025-01-20', 'joao.p', 
'Frequenta AEE. Evolução na leitura.', 
1, 6, 6, 3, 1 FROM DUAL WHERE NOT EXISTS (SELECT * FROM atores WHERE nome = 'JOÃO PEDRO COSTA');

-- 7. LAURA BEATRIZ
INSERT INTO atores (nome, email, sessao_visual, municipio, status, endereco, cidade, estado, pais, data_nascimento, data_inicio_intervencao, username, parecer, unidade_id, profissao_id, modalidade_ensino_id, grupo_usuario_id, idioma_id)
SELECT 'LAURA BEATRIZ LIMA', 'laura.b@email.com', '2024', 'Coruripe', 'Ativo', 'Povoado Poxim, s/n', 'Coruripe', 'AL', 'Brasil', '2020-12-10', '2024-04-01', 'laura.b', 
'Investigação diagnóstica. Atraso fala.', 
2, 8, 2, 2, 1 FROM DUAL WHERE NOT EXISTS (SELECT * FROM atores WHERE nome = 'LAURA BEATRIZ LIMA');

-- 8. PEDRO HENRIQUE
INSERT INTO atores (nome, email, sessao_visual, municipio, status, endereco, cidade, estado, pais, data_nascimento, data_inicio_intervencao, username, parecer, unidade_id, profissao_id, modalidade_ensino_id, grupo_usuario_id, idioma_id)
SELECT 'PEDRO HENRIQUE SOUZA', 'ph.souza@email.com', '2023', 'São Paulo', 'Transferido', 'Rua Augusta, 500', 'São Paulo', 'SP', 'Brasil', '2017-03-15', '2023-02-10', 'pedro.h', 
'Transferido para rede estadual SP.', 
1, 2, 4, 4, 1 FROM DUAL WHERE NOT EXISTS (SELECT * FROM atores WHERE nome = 'PEDRO HENRIQUE SOUZA');

-- 9. ISABELLA FERREIRA
INSERT INTO atores (nome, email, sessao_visual, municipio, status, endereco, cidade, estado, pais, data_nascimento, data_inicio_intervencao, username, parecer, unidade_id, profissao_id, modalidade_ensino_id, grupo_usuario_id, idioma_id)
SELECT 'ISABELLA FERREIRA', 'isa.fer@email.com', '2024', 'Maceió', 'Ativo', 'Rua do Comércio, 33', 'Maceió', 'AL', 'Brasil', '2016-09-09', '2024-01-10', 'isa.f', 
'Implante coclear. Ótima adaptação.', 
6, 2, 5, 2, 1 FROM DUAL WHERE NOT EXISTS (SELECT * FROM atores WHERE nome = 'ISABELLA FERREIRA');

-- 10. LUCAS MENDES
INSERT INTO atores (nome, email, sessao_visual, municipio, status, endereco, cidade, estado, pais, data_nascimento, data_inicio_intervencao, username, parecer, unidade_id, profissao_id, modalidade_ensino_id, grupo_usuario_id, idioma_id)
SELECT 'LUCAS MENDES', 'lucas.m@email.com', '2025', 'Recife', 'Ativo', 'Rua do Espinheiro, 120', 'Recife', 'PE', 'Brasil', '2019-07-20', '2025-02-15', 'lucas.m', 
'Altas habilidades em matemática.', 
8, 6, 6, 3, 1 FROM DUAL WHERE NOT EXISTS (SELECT * FROM atores WHERE nome = 'LUCAS MENDES');