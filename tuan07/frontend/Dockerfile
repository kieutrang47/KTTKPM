# Stage 1: Build robust React production bundle
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Nhận env vars lúc build để Vite bake vào bundle
ARG VITE_USER_API_URL
ARG VITE_FOOD_API_URL
ARG VITE_ORDER_API_URL
ARG VITE_PAYMENT_API_URL
ENV VITE_USER_API_URL=$VITE_USER_API_URL
ENV VITE_FOOD_API_URL=$VITE_FOOD_API_URL
ENV VITE_ORDER_API_URL=$VITE_ORDER_API_URL
ENV VITE_PAYMENT_API_URL=$VITE_PAYMENT_API_URL

RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Custom Nginx config to support React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
