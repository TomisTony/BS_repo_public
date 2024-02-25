import request from '@/utils/request'

export const getUserInfo = (userId: number) => {
  return request.get('/user/info?userId=' + userId)
  // return Promise.resolve({
  //   id: 1,
  //   name: 'admin',
  //   email: 'example@example.com',
  //   phone: '13111111111',
  // })
}

export const modifyUserInfo = (data: any) => {
  return request.post('/user/modify/info', data)
  // return Promise.resolve({
  //   success: true,
  // })
}

export const modifyUserPassword = (data: any) => {
  return request.post('/user/modify/password', data)
  // return Promise.resolve({
  //   success: true,
  // })
}
