# 📦 HƯỚNG DẪN PUSH PROJECT LÊN GIT

## 🎯 Mục Tiêu
Push toàn bộ project lên Git để các máy khác có thể clone về và deploy.

---

## 🚀 BƯỚC 1: Tạo Repository Trên GitHub

### 1.1. Truy cập GitHub
```
https://github.com
```

### 1.2. Tạo Repository Mới
- Click **"New repository"**
- Repository name: `food-delivery-sba` (hoặc tên khác)
- Description: `Food Delivery System - Service-Based Architecture`
- Chọn **Public** hoặc **Private**
- **KHÔNG** chọn "Initialize with README" (vì đã có README.md)
- Click **"Create repository"**

### 1.3. Copy Repository URL
```
https://github.com/your-username/food-delivery-sba.git
```

---

## 🚀 BƯỚC 2: Khởi Tạo Git Local

### 2.1. Mở Terminal Trong Thư Mục Project

```bash
cd /path/to/your/project
```

### 2.2. Khởi Tạo Git (Nếu Chưa Có)

```bash
# Kiểm tra xem đã có git chưa
git status

# Nếu chưa có, khởi tạo
git init
```

### 2.3. Kiểm Tra Files

```bash
# Xem files sẽ được commit
git status
```

**Đảm bảo các file quan trọng có:**
- ✅ README.md
- ✅ docker-compose*.yml
- ✅ All service folders
- ✅ Documentation files
- ✅ .gitignore

---

## 🚀 BƯỚC 3: Commit và Push

### 3.1. Add Tất Cả Files

```bash
git add .
```

### 3.2. Commit

```bash
git commit -m "Initial commit: Food Delivery SBA with Docker deployment"
```

### 3.3. Add Remote Repository

```bash
git remote add origin https://github.com/your-username/food-delivery-sba.git
```

### 3.4. Push Lên GitHub

```bash
# Push lần đầu
git push -u origin main

# Hoặc nếu branch là master
git push -u origin master
```

**Nếu gặp lỗi authentication:**
```bash
# Sử dụng Personal Access Token
# Tạo token tại: https://github.com/settings/tokens
# Khi push, nhập:
# Username: your-username
# Password: your-personal-access-token
```

---

## ✅ BƯỚC 4: Kiểm Tra

### 4.1. Truy Cập GitHub Repository
```
https://github.com/your-username/food-delivery-sba
```

### 4.2. Kiểm Tra Files
- ✅ README.md hiển thị đẹp
- ✅ Tất cả folders có đầy đủ
- ✅ Documentation files có đầy đủ

---

## 🔄 BƯỚC 5: Update Code Sau Này

### Khi Có Thay Đổi:

```bash
# 1. Xem files đã thay đổi
git status

# 2. Add files
git add .

# 3. Commit với message mô tả
git commit -m "Fix: Update Redis configuration for Payment Service"

# 4. Push lên GitHub
git push origin main
```

---

## 👥 BƯỚC 6: Chia Sẻ Với Team

### 6.1. Share Repository URL

Gửi link cho các thành viên:
```
https://github.com/your-username/food-delivery-sba
```

### 6.2. Hướng Dẫn Clone

**Các thành viên chạy:**
```bash
git clone https://github.com/your-username/food-delivery-sba.git
cd food-delivery-sba
```

### 6.3. Hướng Dẫn Deploy

**Gửi cho team:**
- `README.md` - Tổng quan
- `DEPLOY_TU_GIT.md` - Hướng dẫn deploy nhanh
- `DEMO_CHO_GIANG_VIEN.md` - Hướng dẫn demo

---

## 📝 Git Commands Thường Dùng

### Xem Trạng Thái:
```bash
git status
```

### Xem Lịch Sử Commit:
```bash
git log
git log --oneline
```

### Pull Code Mới Nhất:
```bash
git pull origin main
```

### Tạo Branch Mới:
```bash
git checkout -b feature/new-feature
```

### Merge Branch:
```bash
git checkout main
git merge feature/new-feature
```

### Xóa Branch:
```bash
git branch -d feature/new-feature
```

---

## 🔒 Bảo Mật

### Files Không Nên Commit:
- ❌ `.env` files với credentials
- ❌ Database files (*.mv.db)
- ❌ `node_modules/`
- ❌ `target/` (Maven build)
- ❌ `.idea/` (IDE settings)

**Đã được ignore trong `.gitignore`**

### Nếu Đã Commit Nhầm:

```bash
# Remove file from Git but keep local
git rm --cached .env

# Commit
git commit -m "Remove .env from Git"

# Push
git push origin main
```

---

## 🎯 Checklist Push Lên Git

- [ ] Đã tạo repository trên GitHub
- [ ] Đã khởi tạo git local
- [ ] Đã add tất cả files
- [ ] Đã commit với message rõ ràng
- [ ] Đã add remote origin
- [ ] Đã push lên GitHub
- [ ] Đã kiểm tra trên GitHub
- [ ] README.md hiển thị đẹp
- [ ] Đã share link với team

---

## 🎓 Demo Cho Giảng Viên

### Khi Demo, Chỉ Vào:

1. **GitHub Repository**
   - "Em đã push code lên Git để team có thể clone về"
   - Chỉ vào README.md, documentation

2. **Clone Process**
   - "Mỗi máy chỉ cần chạy `git clone` là có code"
   - Demo clone trên 1 máy khác

3. **Easy Deployment**
   - "Sau khi clone, chỉ cần chạy docker-compose"
   - "Không cần copy files thủ công"

---

## 📚 Tài Liệu Tham Khảo

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

## 🆘 Troubleshooting

### Lỗi: Permission Denied

**Giải pháp:**
```bash
# Sử dụng HTTPS thay vì SSH
git remote set-url origin https://github.com/your-username/food-delivery-sba.git
```

### Lỗi: Conflict

**Giải pháp:**
```bash
# Pull trước khi push
git pull origin main

# Resolve conflicts
# Edit files, then:
git add .
git commit -m "Resolve conflicts"
git push origin main
```

### Lỗi: Large Files

**Giải pháp:**
```bash
# Remove large files
git rm --cached large-file.zip

# Add to .gitignore
echo "large-file.zip" >> .gitignore

# Commit
git commit -m "Remove large file"
```

---

**Chúc bạn push code thành công! 🚀**

**Sau khi push, các máy khác chỉ cần:**
```bash
git clone <repository-url>
cd <project-folder>
docker-compose -f docker-compose-machineX.yml up -d
```
