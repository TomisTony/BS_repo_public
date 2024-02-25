import request from '@/utils/request'

export interface Message {
  deviceId: number
  lat: number
  lng: number
  alert: boolean
  timestamp: string
  info: string
  value: number
}

export const getMessageList = (deviceId: number) => {
  return request.get(`/message/list?deviceId=${deviceId}`)
  // return Promise.resolve({
  //   data: [
  //     {
  //       device_id: deviceId,
  //       lat: 39.914889 + Math.random() * 0.05 - 0.5,
  //       lng: 116.404449 + Math.random() * 0.05 - 0.5,
  //       alert: false,
  //       timestamp: new Date().getTime() - 1000 * 60 * 10,
  //       info: '设备正常运行',
  //       value: Math.floor(Math.random() * 0.05 * 100000),
  //     },
  //     {
  //       device_id: deviceId,
  //       lat: 39.914889 + Math.random() * 0.05 - 0.5,
  //       lng: 116.404449 + Math.random() * 0.05 - 0.5,
  //       alert: true,
  //       timestamp: new Date().getTime() - 1000 * 60 * 9,
  //       info: '设备运行警报',
  //       value: Math.floor(Math.random() * 0.05 * 100000),
  //     },
  //     {
  //       device_id: deviceId,
  //       lat: 39.914889 + Math.random() * 0.05 - 0.5,
  //       lng: 116.404449 + Math.random() * 0.05 - 0.5,
  //       alert: false,
  //       timestamp: new Date().getTime() - 1000 * 60 * 8,
  //       info: '设备正常运行',
  //       value: Math.floor(Math.random() * 0.05 * 100000),
  //     },
  //     {
  //       device_id: deviceId,
  //       lat: 39.914889 + Math.random() * 0.05 - 0.5,
  //       lng: 116.404449 + Math.random() * 0.05 - 0.5,
  //       alert: false,
  //       timestamp: new Date().getTime() - 1000 * 60 * 7,
  //       info: '设备正常运行',
  //       value: Math.floor(Math.random() * 0.05 * 100000),
  //     },
  //     {
  //       device_id: deviceId,
  //       lat: 39.914889 + Math.random() * 0.05 - 0.5,
  //       lng: 116.404449 + Math.random() * 0.05 - 0.5,
  //       alert: true,
  //       timestamp: new Date().getTime() - 1000 * 60 * 6,
  //       info: '设备运行警报',
  //       value: Math.floor(Math.random() * 0.05 * 100000),
  //     },
  //     {
  //       device_id: deviceId,
  //       lat: 39.914889 + Math.random() * 0.05 - 0.5,
  //       lng: 116.404449 + Math.random() * 0.05 - 0.5,
  //       alert: false,
  //       timestamp: new Date().getTime() - 1000 * 60 * 5,
  //       info: '设备正常运行',
  //       value: Math.floor(Math.random() * 0.05 * 100000),
  //     },
  //   ],
  // })
}
