import request from '@/utils/request'

export interface Device {
  id: number
  name: string
  description: string
  type: number
  last_active: string
}

export const getDeviceList = (userId: number) => {
  return request.get(`/device/list?userId=${userId}`)
  // return Promise.resolve({
  //   data: [
  //     {
  //       id: 1,
  //       name: '设备1',
  //       type: 1,
  //       desc: '设备1的描述',
  //       last_active: new Date().getTime(),
  //     },
  //     {
  //       id: 2,
  //       name: '设备2',
  //       type: 2,
  //       desc: '设备2的描述',
  //       last_active: new Date().getTime(),
  //     },
  //     {
  //       id: 3,
  //       name: '设备3',
  //       type: 0,
  //       desc: '设备3的描述',
  //       last_active: new Date().getTime(),
  //     },
  //     {
  //       id: 4,
  //       name: '设备4',
  //       type: 3,
  //       desc: '设备4的描述',
  //       last_active: new Date().getTime(),
  //     },
  //     {
  //       id: 5,
  //       name: '设备5',
  //       type: 4,
  //       desc: '设备5的描述',
  //       last_active: new Date().getTime(),
  //     },
  //     {
  //       id: 6,
  //       name: '设备6',
  //       type: 0,
  //       desc: '设备6的描述',
  //       last_active: new Date().getTime(),
  //     },
  //     {
  //       id: 7,
  //       name: '设备7',
  //       type: 1,
  //       desc: '设备7的描述',
  //       last_active: new Date().getTime(),
  //     },
  //     {
  //       id: 8,
  //       name: '设备8',
  //       type: 2,
  //       desc: '设备8的描述',
  //       last_active: new Date().getTime(),
  //     },
  //     {
  //       id: 9,
  //       name: '设备9',
  //       type: 0,
  //       desc: '设备9的描述',
  //       last_active: new Date().getTime(),
  //     },
  //     {
  //       id: 10,
  //       name: '设备10',
  //       type: 1,
  //       desc: '设备10的描述',
  //       last_active: new Date().getTime(),
  //     },
  //   ],
  // })
}

export const addDevice = (data: any) => {
  return request.post('/device/add', data)
  // return Promise.resolve({
  //   success: true,
  // })
}

export const modifyDevice = (data: any) => {
  return request.post('/device/modify', data)
  // return Promise.resolve({
  //   success: true,
  // })
}
