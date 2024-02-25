# README

## Getting Started

> 项目 JDK 版本：corretto-17

1. 在本地的 MySQL 中创建新数据库（建议命名：bs）
2. 根据本地的 MySQL 配置，修改 `src/main/resources/application.yaml` 中的 `spring.datasource` 项
3. 使用 IDEA 启动项目（推荐）或使用 maven 打包启动

注：本项目采用 Spring JPA，即数据库表将会在后端启动的时候自动创建/更新。
