# README

本 mqtt 采用：

- 服务器：mosquitto
- 客户端：iotclient，由课程（学在浙大）提供
- 二次转发：mqtt-transmit.py

## 配置

- 于[Download | Eclipse Mosquitto](https://mosquitto.org/download/)下载 mosquitto 服务器
- 于 python 3.10.x 环境下执行以下语句安装对应依赖

```shell
pip install pymysql
pip install paho
```



## 启动方式

1. 启动 mosquitto 服务
2. 启动 iotclient
3. 在 `mqtt-transmit.py` 目录下使用 `python mqtt-transmit.py` 启动 mqtt-transmit.py

注意：启动 `mqtt-transmit.py` 前必须启动过后端，否则数据库中的数据表将未被创建，`mqtt-transmit.py` 将无法正确执行