# ===== BUILD =====
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ===== RUNTIME =====
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --only=production

RUN addgroup app && adduser -S -G app app
USER app

EXPOSE 3000

CMD ["node", "dist/index.js"]