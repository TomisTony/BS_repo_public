# 配置指南

## 前端

按照 `frontend/iot/README.md` 中的指引配置前端项目

## 后端

按照 `backend/iot/README.md` 中的指引配置后端项目

## mqtt

按照 `mqtt/README.md` 中的指引配置 mqtt 服务器转发

## MySQL

无特殊要求。**数据表将会在后端第一次运行时自动创建**



# 第一次启动

由于后端采用了 Spring JPA，将会在第一次运行时根据配置新建数据表，请先配置并试运行后端。