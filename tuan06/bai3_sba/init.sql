-- Shared DB cho cả Monolith và SBA
CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(200) NOT NULL,
    price      DECIMAL(10,2) NOT NULL,
    stock      INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id           SERIAL PRIMARY KEY,
    user_id      INT NOT NULL REFERENCES users(id),
    product_id   INT NOT NULL REFERENCES products(id),
    quantity     INT NOT NULL DEFAULT 1,
    total_price  DECIMAL(10,2) NOT NULL,
    status       VARCHAR(20) DEFAULT 'pending',
    created_at   TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO users (name, email) VALUES
    ('Nguyen Thi Trang', 'trang@gmail.com'),
    ('Tran Van Binh',    'binh@gmail.com'),
    ('Le Thi Hoa',       'hoa@gmail.com');

INSERT INTO products (name, price, stock) VALUES
    ('Laptop Dell XPS', 25000000, 10),
    ('Mouse Logitech',    450000, 50),
    ('Keyboard Keychron', 980000, 30),
    ('Monitor LG 27"',  7500000, 15);

INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES
    (1, 2, 2,  900000,  'completed'),
    (1, 3, 1,  980000,  'pending'),
    (2, 1, 1, 25000000, 'completed'),
    (3, 4, 1,  7500000, 'pending');
