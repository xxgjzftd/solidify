FROM registry.cn-hangzhou.aliyuncs.com/xxgjzftd/node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm ci