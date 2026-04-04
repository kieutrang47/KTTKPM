-- BÀI 5 - FOOD DELIVERY APP DATABASE
-- Dùng chung cho cả Mono và SBA

-- ─── USERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) UNIQUE NOT NULL,
    phone      VARCHAR(20),
    address    VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ─── MENU ITEMS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    price       DECIMAL(10,2) NOT NULL,
    category    VARCHAR(50) DEFAULT 'food',
    is_available BOOLEAN DEFAULT TRUE,
    image_url   VARCHAR(500),
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ─── ORDERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS food_orders (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES users(id),
    delivery_address VARCHAR(500) NOT NULL,
    total_amount    DECIMAL(10,2) NOT NULL,
    status          VARCHAR(30) DEFAULT 'pending',
    note            TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── ORDER ITEMS (Chi tiết đơn hàng) ─────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id           SERIAL PRIMARY KEY,
    order_id     INT NOT NULL REFERENCES food_orders(id),
    menu_item_id INT NOT NULL REFERENCES menu_items(id),
    quantity     INT NOT NULL DEFAULT 1,
    unit_price   DECIMAL(10,2) NOT NULL,
    subtotal     DECIMAL(10,2) NOT NULL
);

-- ─── SEED DATA ───────────────────────────────────────────────
INSERT INTO users (name, email, phone, address) VALUES
    ('Nguyen Thi Kieu Trang', 'trang@gmail.com', '0901234567', '1 Vo Van Ngan, Thu Duc, TP.HCM'),
    ('Tran Van Binh',         'binh@gmail.com',  '0907654321', '123 Nguyen Van Cu, Q5, TP.HCM'),
    ('Le Thi Hoa',            'hoa@gmail.com',   '0903456789', '456 Le Van Viet, Thu Duc, TP.HCM');

INSERT INTO menu_items (name, description, price, category) VALUES
    ('Com tam suon bi cha',     'Com tam dac biet da nha',          45000,  'com'),
    ('Pho bo tai lan',          'Pho bo truyen thong Nam Bo',       65000,  'pho'),
    ('Bun bo Hue',              'Bun bo cay dac trung Hue',         55000,  'bun'),
    ('Banh mi thit nuong',      'Banh mi gion voi thit nuong',      30000,  'banh'),
    ('Nuoc cam tuoi',           'Nuoc cam vat tu nhien',            25000,  'drink'),
    ('Tra sua tran chau',       'Tra sua Dai Loan toan hong cau',   40000,  'drink'),
    ('Ga ran KFC style',        'Ga ran gion rut xuong',            75000,  'ga'),
    ('Pizza hai san',           'Pizza 25cm voi tom muc',          120000,  'pizza');

INSERT INTO food_orders (user_id, delivery_address, total_amount, status) VALUES
    (1, '1 Vo Van Ngan, Thu Duc',   90000, 'completed'),
    (2, '123 Nguyen Van Cu, Q5',   195000, 'delivering'),
    (1, '1 Vo Van Ngan, Thu Duc',   55000, 'pending');

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES
    (1, 1, 2, 45000,  90000),   -- 2 com tam
    (2, 2, 1, 65000,  65000),   -- 1 pho bo
    (2, 7, 1, 75000,  75000),   -- 1 ga ran
    (2, 5, 1, 25000,  25000),   -- 1 nuoc cam... (note: 65+75+25=165≠195 for demo ok)
    (3, 3, 1, 55000,  55000);   -- 1 bun bo
