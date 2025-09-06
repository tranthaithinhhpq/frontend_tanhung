# Base image
FROM node:18 AS build

# Set working dir
WORKDIR /app

# Copy package.json để cài dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ source
COPY . .

# ✅ Fix lỗi OpenSSL
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build app (sẽ tạo ra thư mục build)
RUN npm run build

# Dùng Nginx để serve build
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Xóa file mặc định
RUN rm -rf ./*

# Copy build từ bước trước sang
COPY --from=build /app/build .

# Copy file nginx.conf thay config mặc định
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy file cấu hình nginx (nếu có)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
