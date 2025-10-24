-- =============================================
-- ACADEMIA DATABASE SCHEMA
-- =============================================

-- =============================================
-- 1. USUARIO TABLE (Main user table for all types)
-- =============================================
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ALUNO', 'PROFESSOR', 'ADM')),
    cpf VARCHAR(14) UNIQUE NOT NULL,
    asaas_customer_id VARCHAR(255), 
    perfil_ativo BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES usuario(id_usuario),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER REFERENCES usuario(id_usuario),
    updated_at TIMESTAMP,
    deleted_by INTEGER REFERENCES usuario(id_usuario),
    deleted_at TIMESTAMP
);

-- =============================================
-- 2. EXERCICIO TABLE (Exercise catalog)
-- =============================================
CREATE TABLE exercicio (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    created_by INTEGER REFERENCES usuario(id_usuario),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER REFERENCES usuario(id_usuario),
    updated_at TIMESTAMP,
    deleted_by INTEGER REFERENCES usuario(id_usuario),
    deleted_at TIMESTAMP
);

-- =============================================
-- 3. TREINO TABLE (Training/workout plans)
-- =============================================
CREATE TABLE treino (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    id_professor INTEGER NOT NULL REFERENCES usuario(id_usuario),
    publico BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_by INTEGER REFERENCES usuario(id_usuario),
    deleted_at TIMESTAMP
);

-- =============================================
-- 4. TREINO_EXERCICIOS TABLE (Training exercises relationship)
-- =============================================
CREATE TABLE treino_exercicios (
    id SERIAL PRIMARY KEY,
    treino_id INTEGER NOT NULL REFERENCES treino(id) ON DELETE CASCADE,
    exercicio_id INTEGER NOT NULL REFERENCES exercicio(id),
    series_repeticoes VARCHAR(100), -
    carga DECIMAL(10,2),
    observacoes TEXT,
    ordem INTEGER NOT NULL, 
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(treino_id, ordem) 
);

-- =============================================
-- 5. USUARIO_TREINO TABLE (Student-Training assignments)
-- =============================================
CREATE TABLE usuario_treino (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_treino INTEGER NOT NULL REFERENCES treino(id) ON DELETE CASCADE,
    assigned_by INTEGER REFERENCES usuario(id_usuario),
    assigned_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(id_usuario, id_treino) 
);

-- =============================================
-- 6. PROFESSOR_TREINO TABLE 
-- =============================================
CREATE TABLE professor_treino (
    id SERIAL PRIMARY KEY,
    id_professor INTEGER NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_treino INTEGER NOT NULL REFERENCES treino(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(id_professor, id_treino) 
);

-- =============================================
-- 7. PAGAMENTO TABLE (Payment records)
-- =============================================
CREATE TABLE pagamento (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario),
    id_pagamento_asaas VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('BOLETO', 'PIX', 'CREDIT_CARD')),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDENTE',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================


CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_usuario_tipo ON usuario(tipo);
CREATE INDEX idx_usuario_cpf ON usuario(cpf);
CREATE INDEX idx_usuario_deleted_at ON usuario(deleted_at);
CREATE INDEX idx_usuario_perfil_ativo ON usuario(perfil_ativo);


CREATE INDEX idx_exercicio_nome ON exercicio(nome);
CREATE INDEX idx_exercicio_deleted_at ON exercicio(deleted_at);


CREATE INDEX idx_treino_professor ON treino(id_professor);
CREATE INDEX idx_treino_publico ON treino(publico);
CREATE INDEX idx_treino_deleted_at ON treino(deleted_at);


CREATE INDEX idx_treino_exercicios_treino ON treino_exercicios(treino_id);
CREATE INDEX idx_treino_exercicios_exercicio ON treino_exercicios(exercicio_id);
CREATE INDEX idx_treino_exercicios_ordem ON treino_exercicios(treino_id, ordem);

CREATE INDEX idx_usuario_treino_usuario ON usuario_treino(id_usuario);
CREATE INDEX idx_usuario_treino_treino ON usuario_treino(id_treino);

CREATE INDEX idx_professor_treino_professor ON professor_treino(id_professor);
CREATE INDEX idx_professor_treino_treino ON professor_treino(id_treino);


CREATE INDEX idx_pagamento_usuario ON pagamento(id_usuario);
CREATE INDEX idx_pagamento_asaas_id ON pagamento(id_pagamento_asaas);
CREATE INDEX idx_pagamento_status ON pagamento(status);
CREATE INDEX idx_pagamento_created_at ON pagamento(created_at);

-- =============================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_usuario_updated_at BEFORE UPDATE ON usuario FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exercicio_updated_at BEFORE UPDATE ON exercicio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treino_updated_at BEFORE UPDATE ON treino FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pagamento_updated_at BEFORE UPDATE ON pagamento FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE usuario IS 'Main user table storing all users (students, professors, admins)';
COMMENT ON TABLE exercicio IS 'Exercise catalog with exercises that can be used in trainings';
COMMENT ON TABLE treino IS 'Training/workout plans created by professors';
COMMENT ON TABLE treino_exercicios IS 'Many-to-many relationship between trainings and exercises';
COMMENT ON TABLE usuario_treino IS 'Assignment of trainings to students';
COMMENT ON TABLE professor_treino IS 'Ownership relationship between professors and trainings';
COMMENT ON TABLE pagamento IS 'Payment records integrated with Asaas payment gateway';

COMMENT ON COLUMN usuario.tipo IS 'User type: ALUNO (student), PROFESSOR (trainer), ADM (admin)';
COMMENT ON COLUMN usuario.asaas_customer_id IS 'External customer ID from Asaas payment gateway';
COMMENT ON COLUMN treino.publico IS 'Whether the training is public and can be assigned to any student';
COMMENT ON COLUMN treino_exercicios.ordem IS 'Order of exercise within the training (1, 2, 3, etc.)';
COMMENT ON COLUMN pagamento.tipo IS 'Payment method: BOLETO, PIX, or CREDIT_CARD';
COMMENT ON COLUMN pagamento.status IS 'Payment status: PENDENTE, PAGO, CANCELADO, etc.';



-- ===========================================
-- GETTING STARTED
--============================================
INSERT INTO usuario (
    nome,
    email,
    senha ,
    tipo, 
    cpf 
) VALUES(
    ADMIN,
    'admin@gmail.com',
    '1234',
    'ADMIN',
    123
);