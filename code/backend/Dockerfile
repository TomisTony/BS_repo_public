# 使用 Amazon Corretto 17 作为基础镜像
FROM amazoncorretto:17

# 将工作目录设置为 /app
WORKDIR /app

# 将你的 jar 文件复制到 Docker 容器中
COPY jar/IOT-0.0.1-SNAPSHOT.jar /app

# 启动该 Java 应用
CMD ["java", "-jar", "/app/IOT-0.0.1-SNAPSHOT.jar"]