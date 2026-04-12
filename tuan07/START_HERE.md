# 🚀 BẮT ĐẦU TỪ ĐÂY - FOOD DELIVERY SBA

## 📚 TÀI LIỆU QUAN TRỌNG (Chỉ 7 Files)

### 1️⃣ **README.md** - ĐỌC ĐẦU TIÊN
📖 Tổng quan toàn bộ project, tech stack, features

### 2️⃣ **DEPLOY_TU_GIT.md** - DEPLOY NHANH NHẤT ⚡
🚀 Hướng dẫn deploy từ Git lên 3 máy (4 bước đơn giản)
**→ DÙNG FILE NÀY ĐỂ DEMO CHO GIẢNG VIÊN**

### 3️⃣ **DEMO_CHO_GIANG_VIEN.md** - KỊCH BẢN DEMO 🎬
🎓 Kịch bản demo chi tiết, cách giải thích, troubleshooting

### 4️⃣ **GIT_SETUP.md** - PUSH LÊN GIT 📦
📤 Hướng dẫn push code lên GitHub để team clone về

### 5️⃣ **DOCKER_DEPLOYMENT_GUIDE.md** - CHI TIẾT DOCKER 🐳
🔧 Hướng dẫn Docker chi tiết, Docker Swarm, troubleshooting

### 6️⃣ **TEST_DEPLOYMENT.md** - KIỂM TRA HỆ THỐNG 🧪
✅ Hướng dẫn test API, frontend, Redis, database

### 7️⃣ **BAI_TAP_GIAI_DOAN_2.md** - TỔNG HỢP BÀI TẬP 📝
📋 Tổng hợp yêu cầu đề bài và kết quả hoàn thành

---

## 🎯 DÙNG FILE NÀO KHI NÀO?

### Khi Muốn Deploy Nhanh:
→ **DEPLOY_TU_GIT.md** (4 bước)

### Khi Cần Demo Cho Giảng Viên:
→ **DEPLOY_TU_GIT.md** (setup)
→ **DEMO_CHO_GIANG_VIEN.md** (kịch bản)

### Khi Cần Push Lên Git:
→ **GIT_SETUP.md**

### Khi Gặp Lỗi:
→ **DOCKER_DEPLOYMENT_GUIDE.md** (Troubleshooting section)

### Khi Cần Test:
→ **TEST_DEPLOYMENT.md**

---

## ⚡ QUICK START (3 LỆNH)

```bash
# 1. Clone project
git clone <repository-url>
cd <project-folder>

# 2. Deploy local (1 máy)
./deploy.sh start

# 3. Truy cập
open http://localhost:3000
```

---

## 🎬 DEMO CHO GIẢNG VIÊN (TÓM TẮT)

### Chuẩn Bị:
1. Push code lên Git
2. Clone về 3 máy
3. Cập nhật IP trong `docker-compose-machine*.yml`
4. Chạy docker-compose trên mỗi máy

### Demo:
1. Mở 3 terminals với logs
2. Mở browser với DevTools
3. Thực hiện: Đăng ký → Menu → Order → Payment
4. Chỉ vào logs và DevTools
5. Giải thích SBA

**Chi tiết:** `DEMO_CHO_GIANG_VIEN.md`

---

## 📂 CẤU TRÚC FILES

```
.
├── START_HERE.md              ← BẮT ĐẦU TỪ ĐÂY
├── README.md                  ← Tổng quan
├── DEPLOY_TU_GIT.md          ← Deploy nhanh ⭐
├── DEMO_CHO_GIANG_VIEN.md    ← Kịch bản demo ⭐
├── GIT_SETUP.md              ← Push lên Git
├── DOCKER_DEPLOYMENT_GUIDE.md ← Chi tiết Docker
├── TEST_DEPLOYMENT.md         ← Testing
├── BAI_TAP_GIAI_DOAN_2.md    ← Tổng hợp bài tập
│
├── docker-compose.yml         ← Local (1 máy)
├── docker-compose-machine1.yml ← Máy 1
├── docker-compose-machine2.yml ← Máy 2
├── docker-compose-machine3.yml ← Máy 3
│
├── deploy.sh                  ← Script deploy
├── .gitignore                 ← Git ignore
│
├── User-Service/
├── Catalog-Service/
├── Order-Service/
├── Payment-Service/
└── frontend/
```

---

## 🎯 CHECKLIST TRƯỚC KHI DEMO

- [ ] Đã đọc `DEPLOY_TU_GIT.md`
- [ ] Đã đọc `DEMO_CHO_GIANG_VIEN.md`
- [ ] Code đã push lên Git
- [ ] Đã test clone trên máy khác
- [ ] Đã biết IP của 3 máy
- [ ] Đã cập nhật IP trong docker-compose files
- [ ] Đã deploy thành công trên 3 máy
- [ ] Đã test kết nối giữa các máy
- [ ] Đã chuẩn bị 3 terminals với logs

---

## 🆘 CẦN GIÚP?

### Lỗi Deploy:
→ Xem `DOCKER_DEPLOYMENT_GUIDE.md` - Troubleshooting

### Lỗi Git:
→ Xem `GIT_SETUP.md` - Troubleshooting

### Lỗi Test:
→ Xem `TEST_DEPLOYMENT.md`

---

**Bắt đầu từ `README.md` để hiểu tổng quan!**

**Sau đó đọc `DEPLOY_TU_GIT.md` để deploy nhanh!**

**Chúc bạn thành công! 🚀**
