FROM node:20-alpine AS build-stage

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com \
 && npm install -g pnpm@9.15.4

COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm config set registry https://registry.npmmirror.com \
 && pnpm install --frozen-lockfile

COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production-stage

# 官方镜像会对 /etc/nginx/templates/*.template 做 envsubst（替换 GATEWAY_HOST）
ENV GATEWAY_HOST=auth-gateway
COPY docker/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
