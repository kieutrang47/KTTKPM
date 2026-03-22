-- 1. Tạo bảng sản phẩm mỹ phẩm
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50),
    price DECIMAL(10, 2),
    stock INT
);

-- 2. Chèn dữ liệu mẫu cho đồ án
INSERT INTO products (name, brand, price, stock) VALUES 
('Son môi Matte', 'MAC', 550000, 50),
('Kem nền Fit Me', 'L-Oreal', 320000, 30),
('Phấn phủ bột', 'Chanel', 1200000, 15),
('Nước tẩy trang', 'La Roche-Posay', 450000, 100);