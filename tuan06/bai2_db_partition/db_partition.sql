-- ============================================================
-- BÀI 2: DATABASE PARTITION - SQL SERVER
-- ============================================================
-- 
-- 3 LOẠI PARTITIONING:
--
-- 1. HORIZONTAL (Sharding theo hàng)
--    → Chia bảng theo hàng dựa vào giá trị cột
--    → Ví dụ: nam → table_user_01, nữ → table_user_02
--    → Tăng performance vì SELECT chỉ quét 1 bảng nhỏ
--
-- 2. VERTICAL (Chia theo cột)
--    → Chia bảng theo cột (thuộc tính)
--    → Ví dụ: user_basic (id, name, email) + user_profile (id, avatar, bio)
--    → Tăng performance vì truy vấn thường dùng chỉ lấy vài cột
--
-- 3. FUNCTIONAL (Chia theo chức năng/domain)
--    → Mỗi chức năng có schema/database riêng
--    → Ví dụ: schema_orders, schema_products, schema_users
--    → Giống service-based partition
-- ============================================================

-- ============================================================
-- PHẦN 1: HORIZONTAL PARTITION (Chia theo giới tính)
-- ============================================================

-- Bảng nam
CREATE TABLE table_user_01 (
    id          INT PRIMARY KEY IDENTITY(1,1),
    name        NVARCHAR(100) NOT NULL,
    gender      NVARCHAR(10)  NOT NULL DEFAULT N'Nam',
    email       NVARCHAR(150),
    created_at  DATETIME DEFAULT GETDATE(),
    CONSTRAINT chk_gender_male CHECK (gender = N'Nam')
);

-- Bảng nữ  
CREATE TABLE table_user_02 (
    id          INT PRIMARY KEY IDENTITY(1,1),
    name        NVARCHAR(100) NOT NULL,
    gender      NVARCHAR(10)  NOT NULL DEFAULT N'Nữ',
    email       NVARCHAR(150),
    created_at  DATETIME DEFAULT GETDATE(),
    CONSTRAINT chk_gender_female CHECK (gender = N'Nữ')
);
GO

-- View hợp nhất → truy vấn như 1 bảng duy nhất
CREATE VIEW v_all_users AS
    SELECT id, name, gender, email, created_at, 'table_01' AS source_table FROM table_user_01
    UNION ALL
    SELECT id, name, gender, email, created_at, 'table_02' AS source_table FROM table_user_02;
GO

-- Dữ liệu mẫu
INSERT INTO table_user_01 (name, gender, email) VALUES
    (N'Nguyễn Văn An', N'Nam', 'an@gmail.com'),
    (N'Trần Văn Bình', N'Nam', 'binh@gmail.com'),
    (N'Lê Văn Cường', N'Nam', 'cuong@gmail.com');

INSERT INTO table_user_02 (name, gender, email) VALUES
    (N'Nguyễn Thị Kiều Trang', N'Nữ', 'trang@gmail.com'),
    (N'Trần Thị Mai', N'Nữ', 'mai@gmail.com'),
    (N'Lê Thị Hoa', N'Nữ', 'hoa@gmail.com');

-- Kiểm tra performance (Index scan nhỏ hơn so với bảng gộp)
SELECT * FROM table_user_01 WHERE gender = N'Nam';   -- Nhanh: chỉ quét 3 hàng
SELECT * FROM v_all_users;                            -- Gộp cả 2 bảng

-- ============================================================
-- PHẦN 2: VERTICAL PARTITION (Chia theo cột)
-- ============================================================

-- Bảng thông tin cơ bản (truy vấn thường xuyên)
CREATE TABLE user_basic (
    id          INT PRIMARY KEY IDENTITY(1,1),
    name        NVARCHAR(100) NOT NULL,
    email       NVARCHAR(150),
    phone       NVARCHAR(20),
    created_at  DATETIME DEFAULT GETDATE()
);

-- Bảng thông tin mở rộng (ít truy vấn hơn, dữ liệu lớn)
CREATE TABLE user_profile (
    user_id     INT PRIMARY KEY,
    avatar_url  NVARCHAR(500),        -- URL ảnh (thường không cần trong list)
    bio         NVARCHAR(MAX),        -- Mô tả dài
    address     NVARCHAR(500),
    birth_date  DATE,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES user_basic(id)
);

-- Dữ liệu mẫu
INSERT INTO user_basic (name, email, phone) VALUES
    (N'Nguyễn Thị Kiều Trang', 'trang@gmail.com', '0901234567'),
    (N'Trần Văn Bình', 'binh@gmail.com', '0907654321');

INSERT INTO user_profile (user_id, avatar_url, bio, address) VALUES
    (1, 'https://example.com/avatar/trang.jpg', N'Sinh viên năm 3 UTE', N'TP.HCM'),
    (2, 'https://example.com/avatar/binh.jpg', N'Lập trình viên', N'Hà Nội');

-- Truy vấn danh sách (NHANH - chỉ đọc user_basic, bỏ qua user_profile)
SELECT id, name, email FROM user_basic;

-- Truy vấn chi tiết (JOIN khi cần thêm thông tin)
SELECT b.id, b.name, b.email, p.avatar_url, p.bio, p.address
FROM user_basic b
LEFT JOIN user_profile p ON b.id = p.user_id
WHERE b.id = 1;

-- ============================================================
-- PHẦN 3: FUNCTIONAL PARTITION (Chia theo schema/chức năng)
-- ============================================================
GO

-- Schema cho Users domain
CREATE SCHEMA schema_users;
GO
CREATE TABLE schema_users.accounts (
    id          INT PRIMARY KEY IDENTITY(1,1),
    username    NVARCHAR(50) UNIQUE NOT NULL,
    password    NVARCHAR(255) NOT NULL,
    role        NVARCHAR(20) DEFAULT 'customer',
    created_at  DATETIME DEFAULT GETDATE()
);
GO

-- Schema cho Orders domain
CREATE SCHEMA schema_orders;
GO
CREATE TABLE schema_orders.orders (
    id              INT PRIMARY KEY IDENTITY(1,1),
    user_id         INT NOT NULL,           -- ref sang schema_users.accounts
    total_amount    DECIMAL(10,2) NOT NULL,
    status          NVARCHAR(20) DEFAULT 'pending',
    created_at      DATETIME DEFAULT GETDATE()
);
GO

-- Schema cho Products domain
CREATE SCHEMA schema_products;
GO
CREATE TABLE schema_products.items (
    id          INT PRIMARY KEY IDENTITY(1,1),
    name        NVARCHAR(200) NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    category    NVARCHAR(50),
    stock       INT DEFAULT 0
);

-- Dữ liệu mẫu
INSERT INTO schema_users.accounts (username, password, role) VALUES
    ('trang', 'hashed_pw_1', 'customer'),
    ('admin', 'hashed_pw_2', 'admin');

INSERT INTO schema_products.items (name, price, category, stock) VALUES
    (N'Cơm tấm sườn', 45000, N'Cơm', 100),
    (N'Phở bò', 60000, N'Phở', 80),
    (N'Bún bò Huế', 55000, N'Bún', 60);

INSERT INTO schema_orders.orders (user_id, total_amount, status) VALUES
    (1, 45000, 'completed'),
    (1, 115000, 'pending');

-- Cross-schema query (trong cùng 1 DB)
SELECT 
    u.username,
    o.id AS order_id,
    o.total_amount,
    o.status
FROM schema_users.accounts u
JOIN schema_orders.orders o ON u.id = o.user_id
WHERE u.username = 'trang';
