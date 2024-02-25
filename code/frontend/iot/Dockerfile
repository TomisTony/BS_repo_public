# 使用带有 Node.js 的官方 Docker 镜像
FROM node:18.19-alpine3.18

# 定义工作目录
WORKDIR /app

RUN npm install -g pnpm

#先 copy package.json 和 package-lock.json/pnpm-lock.yaml 文件，然后安装依赖项
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

# 把剩下的文件复制进去
COPY . .

EXPOSE 3000
CMD ["pnpm", "run", "dev"]