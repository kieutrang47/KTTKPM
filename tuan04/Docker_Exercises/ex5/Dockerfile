# 1. Dung image Golang phien ban Alpine
FROM golang:1.21-alpine

# 2. Thiet lap thu muc lam viec
WORKDIR /app

# 3. Copy toan bo code vao container
COPY . .

# 4. Build code Go thanh file thuc thi (binary)
RUN go build -o main .

# 5. Mo cong 8080
EXPOSE 8080

# 6. Chay file da build
CMD ["./main"]