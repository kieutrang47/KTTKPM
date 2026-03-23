FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# Chỉ định rõ ràng đường dẫn đến file index.js bên trong src
CMD ["node", "src/index.js"]