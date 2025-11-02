FROM crpi-dtgzrnwx1lk7eh2q.cn-hangzhou.personal.cr.aliyuncs.com/maili-${env}/mailihome-web-parent:latest AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM registry.cn-hangzhou.aliyuncs.com/isaiahliu/nginx-mirror:latest AS web
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

