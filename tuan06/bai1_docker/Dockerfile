FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force
COPY src/ ./src/

FROM node:18-alpine AS production
LABEL maintainer="tuan06"
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
ENV NODE_ENV=production
ENV PORT=3000
USER appuser
EXPOSE 3000
ENTRYPOINT ["node"]
CMD ["src/index.js"]