CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL,
    description TEXT
);

INSERT INTO products (name, price, description) VALUES
('Son môi Dior', 1200000, 'Màu đỏ quyến rũ'),
('Kem nền Chanel', 1500000, 'Che phủ hoàn hảo'),
('Nước hoa Gucci', 3500000, 'Hương thơm quý phái');