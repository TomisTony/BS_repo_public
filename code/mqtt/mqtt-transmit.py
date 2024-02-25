from paho.mqtt import client as mqtt_client
import json
import pymysql
import time


broker = 'localhost'
port = 1883
topic = "testapp"
client_id = f'python-mqtt-transmiter'

class MysqlTool:
    def __init__(self):
        """mysql 连接初始化"""
        self.host = 'localhost'
        self.port = 3306
        self.user = 'root'
        self.password = '123456'
        self.db = 'bs'
        self.charset = 'utf8'
        """打开数据库连接"""
        # 尝试连接 mysql，失败后暂停五秒后重试，最多重试 5 次
        for i in range(5):
            try:
                self.connect_mysql()
                break
            except Exception as e:
                print(f"第 {i + 1} 次连接数据库失败：{e}")
                time.sleep(5)
        else:
            raise Exception("连接数据库失败")
    
    def connect_mysql(self):
        self.mysql_conn = pymysql.connect(
            host=self.host,
            port=self.port,
            user=self.user,
            passwd=self.password,
            db=self.db,
            charset=self.charset
        )
        print("数据库连接成功")
        

    def execute(self, sql: str, args: tuple = None, commit: bool = False) -> any:
        """执行 SQL 语句"""
        try:
            with self.mysql_conn.cursor() as cursor:
                cursor.execute(sql, args)
                if commit:
                    self.mysql_conn.commit()
                    print(f"执行 SQL 语句：{sql}，参数：{args}，数据提交成功")
                else:
                    result = cursor.fetchall()
                    print(f"执行 SQL 语句：{sql}，参数：{args}，查询到的数据为：{result}")
                    return result
        except Exception as e:
            print(f"执行 SQL 语句出错：{e}")
            self.mysql_conn.rollback()
            raise e

# 连接数据库实例
db = MysqlTool()

def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def subscribe(client: mqtt_client):
    def on_message(client, userdata, msg):
        content = msg.payload.decode()
        print(f"Received `{content}` from `{msg.topic}` topic")
        # 以 JSON 格式解析 content
        content = json.loads(content)
        fixed_content = messageFix(content)
        insertMessage(fixed_content, db)
        updateDevice(fixed_content, db)

    client.subscribe(topic)
    client.on_message = on_message
    
def messageFix(msg: dict):
    return {
        "device_id": int(msg["clientId"].lstrip("device")),
        "alert": bool(int(msg["alert"])),
        "info": msg["info"],
        "lat": msg["lat"],
        "lng": msg["lng"],
        "timestamp": str(msg["timestamp"]),
        "value": msg["value"]
    }

def insertMessage(msg: dict, db: MysqlTool):
    sql = "INSERT INTO `message` (`device_id`, `alert`, `info`, `lat`, `lng`, `timestamp`, `value`) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    args = (msg["device_id"], msg["alert"], msg["info"], msg["lat"], msg["lng"], msg["timestamp"], msg["value"])
    db.execute(sql, args, True)

def updateDevice(msg: dict, db: MysqlTool):
    sql = "UPDATE `device` SET `last_active` = %s WHERE `id` = %s"
    args = (msg["timestamp"], msg["device_id"])
    db.execute(sql, args, True)


def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()


if __name__ == '__main__':
    run()