-- ============================================================
-- SQLearn Database Schema
-- Banco de dados SQLite gerenciado via sql.js (WebAssembly)
-- Persistido no localStorage como binário base64
-- ============================================================

-- Exercícios disponíveis na plataforma
CREATE TABLE IF NOT EXISTS exercises (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  description TEXT    NOT NULL,
  difficulty  TEXT    CHECK(difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
  hint        TEXT,
  expected_query TEXT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Histórico de queries executadas pelo usuário no editor
CREATE TABLE IF NOT EXISTS query_history (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  query       TEXT    NOT NULL,
  result      TEXT,                  -- JSON serializado das linhas retornadas
  had_error   INTEGER DEFAULT 0,     -- 0 = sucesso, 1 = erro
  executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Progresso do usuário por exercício
CREATE TABLE IF NOT EXISTS user_progress (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id   INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  completed     INTEGER DEFAULT 0,
  attempts      INTEGER DEFAULT 0,
  completed_at  DATETIME
);

-- ============================================================
-- Dados iniciais de exemplo para o editor livre
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT    NOT NULL,
  category TEXT    NOT NULL,
  price    REAL    NOT NULL,
  stock    INTEGER DEFAULT 0
);

INSERT OR IGNORE INTO products (id, name, category, price, stock) VALUES
  (1, 'Notebook Pro',     'Eletrônicos', 4999.90, 15),
  (2, 'Mouse Sem Fio',    'Eletrônicos',  129.90, 80),
  (3, 'Teclado Mecânico', 'Eletrônicos',  349.90, 40),
  (4, 'Cadeira Gamer',    'Móveis',      1299.90,  8),
  (5, 'Mesa Escritório',  'Móveis',       899.90, 12),
  (6, 'Headset USB',      'Eletrônicos',  249.90, 55),
  (7, 'Monitor 27"',      'Eletrônicos', 1799.90, 20),
  (8, 'Webcam HD',        'Eletrônicos',  299.90, 35);

CREATE TABLE IF NOT EXISTS orders (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER REFERENCES products(id),
  quantity   INTEGER NOT NULL,
  total      REAL    NOT NULL,
  ordered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO orders (id, product_id, quantity, total) VALUES
  (1, 1, 2,  9999.80),
  (2, 2, 5,   649.50),
  (3, 3, 1,   349.90),
  (4, 4, 1,  1299.90),
  (5, 6, 3,   749.70),
  (6, 7, 2,  3599.80),
  (7, 2, 10, 1299.00),
  (8, 5, 1,   899.90);
